const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/geometry-sprint-engine.js');
require('../src/geometry-sprint-content.js');
const data = globalThis.GeometrySprintContent;
const correct = () => data.diagnostic.map((question) => String(question.answer));
const submit = (state, values) => { const rank = E.rankTopics(data, values); state.diagnostic.submitted = { values: [...values], working: [], at: 100, topics: rank.topics, reasons: rank.reasons }; };

test('Numeric marking accepts Estonian decimal/grouping syntax but rejects units, partial numbers and blanks', () => {
  assert.equal(E.matches({ answer: 1620 }, '1\u202f620'), true);
  assert.equal(E.matches({ answer: 3.5 }, '3,5'), true);
  for (const value of ['', ' ', '3,5 cm', '3.5oops', '3+0.5', 'Infinity', {}]) assert.equal(E.matches({ answer: 3.5 }, value), false);
  assert.equal(E.matches({ choices: ['yes', 'no'], answer: 0 }, '0'), true);
  assert.equal(E.matches({ choices: ['yes', 'no'], answer: 0 }, ''), false);
});

test('Diagnostic ranks actual error rate rather than question count and does not call omissions wrong', () => {
  const values = correct();
  values[0] = '-1'; // angles: 1/3 wrong
  values[5] = '-1'; // areas: 1/2 wrong
  values[6] = '-1'; // mixed: 1/1 wrong
  values[3] = '';  // properties: omitted, remaining answer correct
  const rank = E.rankTopics(data, values);
  assert.deepEqual(rank.topics, ['mixed', 'areas']);
  assert.deepEqual(rank.stats.find((stat) => stat.topic === 'properties'), { topic: 'properties', answered: 1, correct: 1, missed: 0, omitted: 1 });
  assert.equal(rank.reasons.mixed, 'errors');
});

test('Exactly two routes distinguish one observed error, an unassessed topic and transfer after success', () => {
  const values = correct(); values[3] = '-1'; values[6] = '';
  let rank = E.rankTopics(data, values);
  assert.deepEqual(rank.topics, ['properties', 'mixed']);
  assert.deepEqual(rank.reasons, { properties: 'errors', mixed: 'unanswered' });
  rank = E.rankTopics(data, correct());
  assert.equal(rank.topics.length, 2);
  assert.ok(Object.values(rank.reasons).every((reason) => reason === 'transfer'));
  rank = E.rankTopics(data, []);
  assert.equal(rank.topics.length, 2);
  assert.ok(rank.stats.every((stat) => stat.missed === 0 && stat.answered === 0));
  assert.ok(Object.values(rank.reasons).every((reason) => reason === 'unanswered'));
});

test('Interrupted diagnostic drafts and working survive a reload without becoming submitted results', () => {
  const state = E.fresh(data);
  state.diagnostic.values[0] = '1 620';
  state.diagnostic.working[0] = '9 kolmnurka × 180°';
  state.diagnostic.index = 2;
  const restored = E.restore(JSON.parse(JSON.stringify(state)), data);
  assert.equal(restored.diagnostic.values[0], '1 620');
  assert.equal(restored.diagnostic.working[0], '9 kolmnurka × 180°');
  assert.equal(restored.diagnostic.submitted, null);
  assert.deepEqual(E.nextStep(restored, data), { kind: 'diagnostic', index: 2 });
});

test('Submitted diagnostic remains independent of later draft edits and restore does not mutate source', () => {
  const state = E.fresh(data), values = correct(); values[6] = '-1';
  submit(state, values);
  state.diagnostic.values = correct();
  const source = structuredClone(state), restored = E.restore(state, data);
  assert.equal(restored.diagnostic.submitted.values[6], '-1');
  assert.equal(restored.diagnostic.values[6], '96');
  assert.equal(restored.diagnostic.submitted.topics[0], 'mixed');
  restored.diagnostic.values[6] = 'another draft';
  restored.diagnostic.submitted.values[0] = 'changed clone';
  assert.deepEqual(state, source);
});

test('Practice draft, wrong first attempt and working survive; wrong checks allow the next step', () => {
  const state = E.fresh(data); submit(state, correct());
  const [first, second] = state.diagnostic.submitted.topics;
  state.practice[first] = { 0: { value: '-1', working: 'My method', helped: true, attempts: [{ value: '-1', correct: false, at: 200, supported: true }] }, 1: { value: '10', working: 'Not submitted yet', attempts: [] } };
  const restored = E.restore(JSON.parse(JSON.stringify(state)), data);
  assert.equal(restored.practice[first][0].attempts[0].correct, false);
  assert.equal(restored.practice[first][1].working, 'Not submitted yet');
  assert.deepEqual(E.nextStep(restored, data), { kind: 'practice', topic: first, index: 1 });
  restored.practice[first][1].attempts.push({ correct: true, at: 300 });
  assert.deepEqual(E.nextStep(restored, data), { kind: 'practice', topic: second, index: 0 });
  restored.practice[second] = { 0: { attempts: [{ correct: false }] }, 1: { attempts: [{ correct: false }] } };
  assert.deepEqual(E.nextStep(restored, data), { kind: 'mock' });
});

test('Started mock resumes its own task and finished self-marked paper routes to review', () => {
  const state = E.fresh(data);
  state.mock = { started: 1234, finished: false, working: ['on paper'], marks: ['2', ''] };
  assert.deepEqual(E.nextStep(state, data), { kind: 'mock' });
  state.mock.finished = true;
  const restored = E.restore(JSON.parse(JSON.stringify(state)), data);
  assert.deepEqual(restored.mock, state.mock);
  assert.deepEqual(E.nextStep(restored, data), { kind: 'review' });
});

test('Legacy submitted diagnostic and mock migrate without rewriting their original records', () => {
  const legacyDiagnostic = correct(), legacyMock = { started: 100, finished: true, marks: ['4', '3', '2', '4', '3', '4'] };
  const diagnosticBefore = [...legacyDiagnostic], mockBefore = structuredClone(legacyMock);
  const state = E.restore(null, data, legacyDiagnostic, legacyMock);
  assert.deepEqual(state.diagnostic.submitted.values, legacyDiagnostic);
  assert.equal(state.diagnostic.submitted.at, null);
  assert.deepEqual(state.mock, legacyMock);
  assert.deepEqual(legacyDiagnostic, diagnosticBefore);
  assert.deepEqual(legacyMock, mockBefore);
  assert.equal(E.restore(E.fresh(data), data, legacyDiagnostic, legacyMock).diagnostic.submitted, null);
});

test('Malformed local data is safely normalised without false completion or prototype pollution', () => {
  const raw = JSON.parse('{"version":1,"diagnostic":{"values":[{},null],"working":false,"index":999,"submitted":{"values":[]}},"practice":{"angles":{"0":{"attempts":[null,"answer",false,{}, {"correct":null}],"__proto__":{"polluted":true}}}},"mock":{"started":"123","finished":true}}');
  const state = E.restore(raw, data);
  assert.equal(state.diagnostic.index, data.diagnostic.length - 1);
  assert.equal(state.diagnostic.submitted, null);
  assert.equal(state.mock, null);
  assert.deepEqual(state.practice.angles[0].attempts, []);
  assert.equal({}.polluted, undefined);
  assert.doesNotThrow(() => E.restore({ version: 1, diagnostic: {} }, {}));
});

test('Only the optional mixed-topic cosine extension can be deferred without inventing an answer or mastery', () => {
  const state = E.fresh(data), values = correct(); values[6] = '-1'; submit(state, values);
  state.practice.mixed = [ { attempts: [{ correct: true }] }, { attempts: [], deferredAt: 300 } ];
  const before = structuredClone(state);
  const step = E.nextStep(state, data);
  assert.equal(step.kind, 'practice');
  assert.equal(step.topic, state.diagnostic.submitted.topics[1]);
  assert.equal(step.index, 0);
  assert.deepEqual(state, before);
  assert.deepEqual(E.restore(state, data).practice.mixed[1], { attempts: [], deferredAt: 300 });
  for (const value of [null, 0, -1, '300', Infinity, NaN]) {
    state.practice.mixed[1].deferredAt = value;
    assert.deepEqual(E.nextStep(state, data), { kind: 'practice', topic: 'mixed', index: 1 });
  }
  state.practice.mixed[0] = { attempts: [], deferredAt: 300 };
  state.practice.mixed[1].deferredAt = 300;
  assert.deepEqual(E.nextStep(state, data), { kind: 'practice', topic: 'mixed', index: 0 });
  const core = E.fresh(data); submit(core, correct());
  core.practice.angles = [{ attempts: [{ correct: true }] }, { attempts: [], deferredAt: 300 }];
  assert.deepEqual(E.nextStep(core, data), { kind: 'practice', topic: 'angles', index: 1 });
});
