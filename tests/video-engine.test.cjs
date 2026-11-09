const test = require('node:test');
const assert = require('node:assert/strict');
const Engine = require('../src/video-engine.js');
const T = Date.UTC(2026, 10, 9, 12);
const bank = {videos: ['one', 'two'].map(id => ({id, questions: [
  {id: id + '-q1', options: ['A', 'B', 'C'], answer: 1},
  {id: id + '-q2', options: ['D', 'E', 'F'], answer: 2}
]}))};
const answer = (state, now, correct = true, confidence = 'sure') => {
  const session = Engine.active(state), q = Engine.question(bank, session);
  session.selected = correct ? q.answer : (q.answer + 1) % q.options.length;
  session.confidence = confidence;
  assert.equal(Engine.submit(state, bank, now), true);
  return session;
};

test('question opens and video views alone create no scored answer, due card, block or chain credit', () => {
  const s = Engine.fresh(), a = Engine.start(s, bank, T, 'one');
  assert.equal(Engine.MODULE_ID, 'hendrik-video-practice-v1');
  assert.equal(a.concept, 'one');
  assert.equal(a.questionIndex, 0);
  assert.equal(a.questionId, 'one-q1');
  assert.equal(a.initialProbe, true);
  Engine.expose(s, 'video', T + 1000);
  assert.equal(a.openedAt, T + 1000);
  assert.equal(a.helpedAt, T + 1000);
  assert.deepEqual(s.cards, {});
  assert.equal(a.answeredAt, 0);
  assert.equal(a.completedAt, 0);
  assert.equal(a.ordinaryBlockCredit, false);
  assert.equal(a.chainCredit, false);
  assert.equal(a.masteryCredit, false);
  assert.deepEqual(Engine.dueVideos(s, bank, T + 100 * Engine.DAY), []);
});

test('start resumes the same unfinished video, including selections, without losing another unfinished one', () => {
  const s = Engine.fresh(), a = Engine.start(s, bank, T, 'one');
  a.selected = 2; a.confidence = 'unsure';
  Engine.start(s, bank, T + 1000, 'two');
  const resumed = Engine.start(s, bank, T + 2000, 'one');
  assert.equal(resumed, a);
  assert.equal(resumed.selected, 2);
  assert.equal(resumed.confidence, 'unsure');
  assert.equal(s.sessions.length, 2);
});

test('a displayed gist makes the first application supported, and one answer ends only this practice', () => {
  const s = Engine.fresh(), a = Engine.start(s, bank, T, 'one');
  Engine.expose(s, 'gist', T + 1);
  answer(s, T + 1000);
  assert.equal(a.correct, true);
  assert.equal(a.assisted, true);
  assert.equal(a.independent, false);
  assert.equal(a.delayedProbe, false);
  assert.equal(a.stage, 'done');
  assert.equal(a.completedAt, a.answeredAt);
  assert.equal(s.cards.one.due, a.answeredAt + Engine.DAY);
  assert.equal(s.cards.one.intervalDays, 1);
});

test('a first unaided application remains a baseline, never independent delayed recall', () => {
  const s = Engine.fresh();
  const a = Engine.start(s, bank, T, 'one');
  answer(s, T + 1);
  assert.equal(a.independent, true);
  assert.equal(a.delayedProbe, false);
  assert.equal(a.initialProbe, true);
  assert.equal(s.cards.one.intervalDays, 1);
});

test('the different application is reserved for a later due visit; immediate practice is a labelled repeat', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'one'); answer(s, T + 1);
  let a = Engine.start(s, bank, T + 2, 'one');
  assert.equal(a.questionIndex, 0); assert.equal(a.repeatedQuestion, true);
  answer(s, T + 3);
  a = Engine.start(s, bank, s.cards.one.due, 'one');
  assert.equal(a.questionIndex, 1); assert.equal(a.repeatedQuestion, false);
  answer(s, s.cards.one.due + 1);
  a = Engine.start(s, bank, s.cards.one.due, 'one');
  assert.equal(a.questionIndex, 0); assert.equal(a.repeatedQuestion, true);
});

test('later unaided correct sure answers double spacing only when due and at least 24 hours since exposure', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'one'); Engine.expose(s, 'video', T + 1); answer(s, T + 2);
  let now = s.cards.one.due;
  for (const interval of [2, 4, 7, 7]) {
    const a = Engine.start(s, bank, now, 'one');
    assert.equal(a.delayedEligibleAtStart, true);
    answer(s, now + 1);
    assert.equal(a.delayedProbe, true);
    assert.equal(a.independent, true);
    assert.equal(s.cards.one.intervalDays, interval);
    now = s.cards.one.due;
  }
});

test('video reopening updates last exposure and prevents premature delayed credit', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'one'); answer(s, T + 1);
  Engine.expose(s, 'video', T + Engine.DAY - 1);
  assert.equal(s.cards.one.lastExposure, T + Engine.DAY - 1);
  assert.equal(Engine.active(s).independent, true, 'post-answer help must not rewrite frozen attribution');
  const a = Engine.start(s, bank, T + Engine.DAY + 2, 'one');
  assert.equal(a.delayedEligibleAtStart, false);
  answer(s, T + Engine.DAY + 3);
  assert.equal(a.delayedProbe, false);
  assert.equal(s.cards.one.intervalDays, 1);
});

test('help during a due question removes independent delayed eligibility', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'one'); answer(s, T + 1);
  const now = s.cards.one.due, a = Engine.start(s, bank, now, 'one');
  assert.equal(a.delayedEligibleAtStart, true);
  Engine.expose(s, 'explanation', now + 1);
  answer(s, now + 2);
  assert.equal(a.independent, false);
  assert.equal(a.delayedProbe, false);
  assert.equal(s.cards.one.lastExposure, now + 2);
  assert.equal(s.cards.one.intervalDays, 1);
});

test('a pre-due session does not become delayed by leaving it open until due', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'one'); answer(s, T + 1);
  const a = Engine.start(s, bank, T + 2, 'one');
  assert.equal(a.delayedEligibleAtStart, false);
  answer(s, T + 3 * Engine.DAY);
  assert.equal(a.delayedProbe, false);
});

test('wrong, uncertain or supported work schedules one day, preserving correctness independently', () => {
  for (const mode of ['wrong', 'uncertain', 'supported']) {
    const s = Engine.fresh();
    Engine.start(s, bank, T, 'one'); answer(s, T + 1);
    const now = s.cards.one.due, a = Engine.start(s, bank, now, 'one');
    if (mode === 'supported') Engine.expose(s, 'gist', now + 1);
    answer(s, now + 2, mode !== 'wrong', mode === 'uncertain' ? 'unsure' : 'sure');
    assert.equal(a.correct, mode !== 'wrong');
    assert.equal(s.cards.one.intervalDays, 1);
    assert.equal(s.cards.one.needsHelp, mode !== 'supported');
  }
});

test('submission requires an actual valid selection and confidence and cannot rewrite a finished answer', () => {
  const s = Engine.fresh(), a = Engine.start(s, bank, T, 'one');
  assert.equal(Engine.submit(s, bank, T + 1), false);
  a.selected = 1;
  assert.equal(Engine.submit(s, bank, T + 2), false);
  a.confidence = 'sure'; a.selected = 20;
  assert.equal(Engine.submit(s, bank, T + 3), false);
  a.selected = -1;
  assert.equal(Engine.submit(s, bank, T + 4), false);
  a.selected = 1;
  assert.equal(Engine.submit(s, bank, T + 5), true);
  const before = JSON.stringify(s);
  assert.equal(Engine.submit(s, bank, T + 6), false);
  assert.equal(JSON.stringify(s), before);
});

test('restore roundtrip preserves IDs, immutable answer evidence, exposure and unfinished choice', () => {
  const s = Engine.fresh();
  const completed = Engine.start(s, bank, T, 'one');
  Engine.expose(s, 'video', T + 1); answer(s, T + 2);
  Engine.expose(s, 'explanation', T + 3);
  const waiting = Engine.start(s, bank, T + 4, 'two'); waiting.selected = 2; waiting.confidence = 'unsure';
  assert.deepEqual(Engine.restore(JSON.stringify(s), bank), s);
  const newBank = structuredClone(bank); newBank.videos[0].questions[0].answer = 0;
  assert.equal(Engine.restore(s, newBank).sessions.find(a => a.id === completed.id).correct, true, 'restore must not regrade old answers against changed keys');
});

test('restore rejects unreadable or inconsistent histories instead of silently deleting evidence', () => {
  assert.throws(() => Engine.restore('{bad json', bank));
  assert.throws(() => Engine.restore({version: 2}, bank));
  const s = Engine.fresh(); Engine.start(s, bank, T, 'one'); answer(s, T + 1);
  for (const mutate of [
    x => x.sessions.push({...x.sessions[0]}),
    x => x.activeId = 'missing',
    x => x.sessions[0].questionId = 'other',
    x => x.sessions[0].chainCredit = true,
    x => x.sessions[0].correct = null,
    x => x.sessions[0].correct = false,
    x => x.sessions[0].answerKeyAtSubmission = 99,
    x => x.sessions[0].contentVersion = 0,
    x => x.sessions[0].assisted = true,
    x => x.sessions[0].answeredAt = null,
    x => x.cards.one.intervalDays = 90,
    x => x.cards.one.due = 'tomorrow'
  ]) {
    const bad = structuredClone(s); mutate(bad); assert.throws(() => Engine.restore(bad, bank));
  }
  assert.equal(s.sessions[0].correct, true);
});

test('restore rejects unacknowledged support instead of granting false independent credit', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'one'); Engine.expose(s, 'video', T + 1); answer(s, T + 2);
  const bad = structuredClone(s);
  bad.sessions[0].assisted = false; bad.sessions[0].independent = true; bad.sessions[0].helpedAt = 0;
  assert.throws(() => Engine.restore(bad, bank));
});

test('due lists arise only from answered videos and sort by real answer schedules', () => {
  const s = Engine.fresh();
  Engine.start(s, bank, T, 'two'); answer(s, T + 1);
  Engine.start(s, bank, T + 2, 'one'); answer(s, T + 3);
  assert.deepEqual(Engine.dueVideos(s, bank, T + Engine.DAY + 4).map(v => v.id), ['two', 'one']);
  assert.deepEqual(Engine.dueVideos(s, bank, T), []);
});

test('invalid bank IDs, unavailable questions and unknown exposure types are rejected safely', () => {
  const s = Engine.fresh();
  assert.throws(() => Engine.start(s, bank, T, 'missing'));
  assert.throws(() => Engine.start(s, {videos: [{id: '__proto__', questions: bank.videos[0].questions}]}, T, '__proto__'));
  Engine.start(s, bank, T, 'one');
  assert.equal(Engine.expose(s, 'watch-completed', T + 1), false);
  assert.equal(Engine.expose(s, 'video', NaN), false);
  assert.deepEqual(Engine.active(s).exposures, []);
});
