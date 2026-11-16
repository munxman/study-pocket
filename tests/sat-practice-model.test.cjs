const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/sat-practice-model.js');
const E = require('../src/video-engine.js');
const B = require('../src/video-content.js');
const T = Date.parse('2026-11-16T09:00:00Z');
const math = M.sections.maths;
const english = M.sections.english;
function answer(state, videoId, now, {correct = true, confidence = 'sure', help = false} = {}) {
  const a = E.start(state, B, now, videoId);
  if (help) E.expose(state, 'gist', now + 1);
  const q = E.question(B, a);
  a.selected = correct ? q.answer : (q.answer + 1) % q.options.length;
  a.confidence = confidence;
  E.submit(state, B, now + 2);
  return a;
}
const pick = (state, now = T, section = 'maths', options = {}) => M.choose(state, B, now, {section, ...options});

test('cold start offers one question-first baseline in either SAT section', () => {
  const state = E.fresh();
  assert.deepEqual(M.choose(state, B, T), {videoId: math[0], section: 'maths', reason: 'unseen', repeat: false, resume: false});
  assert.equal(pick(state, T, 'english').videoId, english[0]);
  assert.equal(M.getSection('sat-transitions'), 'english');
  assert.equal(M.getSection('i12-chem-molarity'), null);
});

test('an unresolved due exact-skill mistake is selected before unseen items', () => {
  const state = E.fresh();
  answer(state, math[2], T, {correct: false});
  const result = pick(state, T + E.DAY + 3);
  assert.equal(result.videoId, math[2]);
  assert.equal(result.reason, 'weak-due');
  assert.equal(result.repeat, false);
  assert.equal(pick(state, T + 3).videoId, math[0], 'fresh items remain available before the weak item is due');
});

test('supported success does not conceal the original mistake even if the latest card says no help needed', () => {
  const state = E.fresh();
  answer(state, math[2], T, {correct: false});
  answer(state, math[2], T + E.DAY + 3, {help: true});
  assert.equal(state.cards[math[2]].needsHelp, false);
  assert.equal(pick(state, T + 2 * E.DAY + 6).reason, 'weak-due');
  assert.equal(pick(state, T + 2 * E.DAY + 6).videoId, math[2]);
});

test('later confident unaided eligible retrieval resolves priority, but another skill cannot', () => {
  const state = E.fresh();
  answer(state, math[2], T, {correct: false});
  answer(state, math[1], T + E.DAY + 3);
  assert.equal(pick(state, T + E.DAY + 6).videoId, math[2]);
  const recovered = answer(state, math[2], T + E.DAY + 10);
  assert.equal(recovered.delayedProbe, true);
  assert.equal(pick(state, T + 3 * E.DAY + 15).videoId, math[0]);
  assert.equal(pick(state, T + 3 * E.DAY + 15).reason, 'unseen');
});

test('same-day unaided success and correct uncertainty both keep exact-skill follow-up priority', () => {
  const state = E.fresh();
  answer(state, math[3], T, {correct: false});
  answer(state, math[3], T + 10);
  assert.equal(pick(state, T + E.DAY + 13).videoId, math[3]);
  assert.equal(pick(state, T + E.DAY + 13).reason, 'weak-due');
  const uncertain = E.fresh();
  answer(uncertain, math[1], T, {confidence: 'unsure'});
  assert.equal(pick(uncertain, T + E.DAY + 3).reason, 'weak-due');
});

test('requested-section unfinished work resumes the same ID, choice and confidence without mutation', () => {
  const state = E.fresh();
  const a = E.start(state, B, T, math[2]);
  a.selected = 2; a.confidence = 'unsure';
  E.start(state, B, T + 1, english[1]);
  const before = structuredClone(state);
  assert.deepEqual(pick(state, T + 2), {videoId: math[2], section: 'maths', reason: 'resume', repeat: false, resume: true, sessionId: a.id});
  assert.deepEqual(state, before);
});

test('automatic section alternates after dated SAT answers; unrelated items do not change it', () => {
  const state = E.fresh();
  answer(state, math[0], T);
  assert.equal(M.choose(state, B, T + 4).section, 'english');
  answer(state, english[0], T + 10);
  answer(state, 'i12-chem-molarity', T + 20);
  assert.equal(M.choose(state, B, T + 25).section, 'maths');
});

test('home resumes unfinished SAT work across both parts before alternating; explicit section remains scoped', () => {
  const state = E.fresh();
  answer(state, math[0], T);
  const old = E.start(state, B, T + 5, english[1]);
  old.selected = 1; old.confidence = 'unsure';
  const latest = E.start(state, B, T + 10, math[1]);
  let choice = M.choose(state, B, T + 15);
  assert.equal(choice.sessionId, latest.id, 'the active unfinished maths step beats default English alternation');
  assert.equal(choice.reason, 'resume');
  assert.equal(pick(state, T + 15, 'english').sessionId, old.id);
  state.activeId = null;
  choice = M.choose(state, B, T + 15);
  assert.equal(choice.sessionId, old.id, 'without an active attempt, oldest unfinished work resumes');
  assert.equal(choice.section, 'english');
  assert.equal(old.selected, 1);
  assert.equal(old.confidence, 'unsure');
});

test('future, malformed and guest answer references cannot choose a section or weak skill', () => {
  const state = E.fresh();
  const future = answer(state, math[0], T + 100, {correct: false});
  const guest = answer(state, math[1], T, {correct: false}); guest.participant = 'guest';
  const malformed = answer(state, math[2], T + 10, {correct: false}); malformed.answeredAt = 'yesterday';
  const result = M.choose(state, B, T + 20);
  assert.equal(result.section, 'maths');
  assert.equal(result.videoId, math[3]);
  assert.equal(result.reason, 'unseen');
  assert.equal(future.correct, false, 'source evidence remains untouched');
});

test('future unfinished state is not disguised as a fresh baseline which would resume that state', () => {
  const state = E.fresh();
  E.start(state, B, T + E.DAY, math[0]);
  assert.equal(pick(state, T).videoId, math[1]);
});

test('invalid and future completed records without cards cannot be offered as unseen work', () => {
  const state = E.fresh();
  answer(state, math[0], T + E.DAY, {correct: false});
  const malformed = answer(state, math[1], T, {correct: false});
  malformed.questionId = 'unknown-old-reference';
  delete state.cards[math[0]];
  delete state.cards[math[1]];
  const before = structuredClone(state);
  assert.equal(pick(state, T + 10).videoId, math[2]);
  assert.deepEqual(state, before);
});

test('only recent answers produce an explicit repeat choice, preserving reserved later questions', () => {
  const state = E.fresh();
  math.forEach((id, i) => answer(state, id, T + i * 10));
  const before = structuredClone(state);
  const result = pick(state, T + 100);
  assert.equal(result.reason, 'repeat');
  assert.equal(result.repeat, true);
  assert.equal(result.videoId, math[0]);
  assert.deepEqual(state, before);
  assert.equal(state.sessions.every(a => a.questionIndex === 0), true);
});

test('due time alone cannot bypass recent support exposure; a valid due item needs no repetition warning', () => {
  const state = E.fresh();
  math.forEach((id, i) => answer(state, id, T + i * 10));
  E.start(state, B, T + E.DAY, english[0]);
  for (const id of math) state.cards[id].lastExposure = T + E.DAY;
  assert.equal(pick(state, T + E.DAY + 100).repeat, true);
  const due = pick(state, T + 2 * E.DAY + 1);
  assert.equal(due.reason, 'due');
  assert.equal(due.repeat, false);
});

test('exclusions stay in the requested section and invalid requests safely return null', () => {
  const state = E.fresh();
  assert.equal(pick(state, T, 'maths', {excludeVideoIds: [math[0]]}).videoId, math[1]);
  assert.equal(pick(state, T, 'maths', {excludeVideoIds: math}), null);
  assert.equal(pick(state, T, 'chemistry'), null);
  assert.equal(pick(state, NaN), null);
  assert.equal(M.choose(state, {videos: []}, T), null);
});

test('duplicate IDs and inconsistent cards cannot manufacture follow-up or recovery evidence', () => {
  const state = E.fresh();
  const a = answer(state, math[0], T, {correct: false});
  state.sessions.push(structuredClone(a));
  answer(state, math[1], T + 10, {correct: false});
  state.cards[math[1]].lastAt = T + 9;
  assert.equal(pick(state, T + E.DAY + 100).videoId, math[2]);
});
