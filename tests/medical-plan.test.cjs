const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/medical-plan.js');
const V = require('../src/video-engine.js');
const B = require('../src/video-content.js');
const I = require('../src/ielts-engine.js');
const DAY = 86400000;
const NOW = Date.parse('2026-11-16T20:00:00Z');
const KEYS = {biology: 'hendrik-imat-bio-v1', chemistry: 'hendrik-chemistry-v1', physics: 'hendrik-physics-v1', ielts: I.KEY, sat: V.MODULE_ID};
const chemistry = {concept: 'concentration_dilution', skill: 'dilution_amount_conservation', lastEvidenceAt: NOW - 2 * DAY, dueAt: NOW - DAY, eligible: true, reason: 'unresolved-skill'};
let serial = 0;
function ordinary(subject, at, overrides = {}) {
  return {id: subject + '-' + (++serial), kind: subject === 'biology' ? 'imat' : 'quantitative',
    concept: subject === 'chemistry' ? 'concentration_dilution' : subject === 'physics' ? 'pressure' : 'transport',
    stage: 'done', startedAt: at - 5000, answeredAt: at - 3000, checkAnsweredAt: at,
    completedAt: at, correct: true, checkCorrect: true, confidence: 'sure', independent: true,
    ...overrides};
}
function moduleOf(sessions, activeId = null) { return {version: 1, serial: sessions.length, sessions, cards: {}, activeId}; }
function ielts(kind, at, {empty = false, recorded = false} = {}) {
  const state = I.fresh(), a = I.start(state, {kind, title: 'Synthetic sample', taskIds: ['synthetic-' + kind], mode: 'short'}, at - 5000);
  if (!empty) a.texts = {task: 'My own short practice response, without any automatic assessment.'};
  if (recorded) a.recorded = true;
  I.submit(state, [], at);
  return a;
}
function readyCore() {
  return {
    [KEYS.biology]: moduleOf([ordinary('biology', NOW - DAY)]),
    [KEYS.chemistry]: moduleOf([ordinary('chemistry', NOW - 2 * DAY)]),
    [KEYS.ielts]: {...I.fresh(), sessions: [ielts('writing', NOW - 8 * DAY), ielts('speaking', NOW - 7 * DAY)]}
  };
}
const build = (modules = {}, options = {}, now = NOW) => M.build(modules, now, {bank: B, chemistry, ...options});
function satAnswer(state, videoId, at, {help = false, correct = true} = {}) {
  const a = V.start(state, B, at - 1000, videoId), q = V.question(B, a);
  if (help) V.expose(state, 'gist', at - 500);
  a.selected = correct ? q.answer : (q.answer + 1) % q.options.length;
  a.confidence = 'sure'; V.submit(state, B, at); return a;
}
function satReady({correct = true, help = false} = {}) {
  const state = V.fresh();
  satAnswer(state, 'sat-linear-equation', NOW - 3 * DAY, {correct, help});
  satAnswer(state, 'sat-inferences', NOW - 3 * DAY + 1000, {correct, help});
  satAnswer(state, 'sat-linear-model', NOW - 2 * DAY, {correct, help});
  satAnswer(state, 'sat-transitions', NOW - DAY, {correct, help});
  return state;
}

test('an old worked physics check cannot indefinitely starve overdue IELTS production', () => {
  const modules = readyCore(), unfinished = ordinary('physics', NOW - 1000, {id: 'pressure-draft', stage: 'check', completedAt: 0, checkAnsweredAt: 0, checkCorrect: null});
  modules[KEYS.physics] = moduleOf([unfinished], unfinished.id);
  const r = build(modules);
  assert.equal(r.primary.subject, 'ielts');
  assert.match(r.primary.href, /ielts\.html\?guided=1&skill=writing/);
  assert.ok(r.resumes.some(x => x.href.includes('subject=physics') && x.href.includes('concept=pressure')));
});

test('a genuinely worked IELTS draft resumes within the chosen subject rather than creating another task', () => {
  const modules = readyCore();
  const state = modules[KEYS.ielts], a = I.start(state, {kind: 'writing', title: 'Draft', taskIds: ['draft'], mode: 'short'}, NOW - 1000);
  a.texts = {draft: 'An unfinished response that must remain saved.'};
  I.pause(state, NOW - 500);
  const before = structuredClone(modules), r = build(modules);
  assert.equal(r.primary.subject, 'ielts');
  assert.equal(r.primary.kind, 'resume');
  assert.match(r.primary.href, /ielts\.html/);
  assert.deepEqual(modules, before);
});

test('meaningful IELTS completion leads to due chemistry, then biology after chemistry completes', () => {
  const modules = readyCore();
  let r = build(modules); assert.equal(r.primary.subject, 'ielts');
  modules[KEYS.ielts].sessions.push(ielts('writing', NOW - 1000));
  r = build(modules);
  assert.equal(r.primary.subject, 'chemistry');
  assert.match(r.primary.href, /subject=chemistry/);
  assert.match(r.primary.href, /concept=concentration_dilution/);
  assert.match(r.primary.href, /skill=dilution_amount_conservation/);
  assert.match(r.primary.href, /from=plan/);
  modules[KEYS.chemistry].sessions.push(ordinary('chemistry', NOW - 500));
  r = build(modules);
  assert.equal(r.primary.subject, 'biology');
  assert.match(r.primary.href, /imat\.html\?guided=8/);
});

test('an empty IELTS submit, opened task or SAT English answer does not satisfy IELTS production', () => {
  const modules = readyCore();
  modules[KEYS.ielts].sessions.push(ielts('writing', NOW - 1000, {empty: true}));
  const s = I.start(modules[KEYS.ielts], {kind: 'speaking', taskIds: ['open'], title: 'Only open'}, NOW - 500);
  assert.equal(s.completedAt, 0);
  modules[KEYS.sat] = satReady();
  assert.equal(build(modules).primary.subject, 'ielts');
});

test('recent IELTS reading/listening and drills do not reset the productive-skills gap', () => {
  const modules = readyCore();
  for (const [i, kind] of ['reading', 'listening', 'drill'].entries()) modules[KEYS.ielts].sessions.push({
    id: 'recent-' + kind, kind, startedAt: NOW - 5000 + i * 100,
    completedAt: NOW - 2000 + i * 100, status: 'submitted',
    answers: {q: 'learner response'}, results: [{blank: false, correct: true}]
  });
  const r = build(modules);
  assert.equal(r.primary.subject, 'ielts');
  assert.match(r.primary.href, /skill=writing/);
});

test('a missing productive IELTS skill is suggested without forcing both productive tasks on one day', () => {
  const modules = readyCore();
  modules[KEYS.ielts].sessions = [ielts('speaking', NOW - DAY)];
  assert.match(build(modules).primary.href, /skill=writing/);
  modules[KEYS.ielts].sessions.push(ielts('speaking', NOW - 1000));
  assert.notEqual(build(modules).primary.subject, 'ielts', 'one real productive sample today allows science to return');
});

test('a successful supported chemistry check does not hide a supplied unresolved exact-skill recommendation', () => {
  const modules = readyCore();
  modules[KEYS.ielts].sessions.push(ielts('writing', NOW - 1000));
  modules[KEYS.chemistry].sessions = [ordinary('chemistry', NOW - 2 * DAY, {correct: false, checkCorrect: true, independent: true})];
  const r = build(modules);
  assert.equal(r.primary.subject, 'chemistry');
  assert.match(r.primary.href, /skill=dilution_amount_conservation/);
});

test('a chosen chemistry step preserves its worked unfinished concept instead of overriding it with another gap', () => {
  const modules = readyCore();
  modules[KEYS.ielts].sessions.push(ielts('writing', NOW - 1000));
  const a = ordinary('chemistry', NOW - 500, {id: 'saved-polarity', concept: 'bonding_polarity', stage: 'check', completedAt: 0, checkAnsweredAt: 0, checkCorrect: null});
  modules[KEYS.chemistry].sessions.push(a); modules[KEYS.chemistry].activeId = a.id;
  const r = build(modules);
  assert.equal(r.primary.subject, 'chemistry');
  assert.equal(r.primary.kind, 'resume');
  assert.match(r.primary.href, /concept=bonding_polarity/);
  assert.doesNotMatch(r.primary.href, /skill=dilution_amount_conservation/);
});

test('after all three core areas have submitted work today, a remaining physics check can be offered without creating activity', () => {
  const modules = readyCore();
  modules[KEYS.ielts].sessions.push(ielts('writing', NOW - 3000));
  modules[KEYS.chemistry].sessions.push(ordinary('chemistry', NOW - 2000));
  modules[KEYS.biology].sessions.push(ordinary('biology', NOW - 1000));
  const a = ordinary('physics', NOW - DAY, {id: 'pressure-check', stage: 'check', completedAt: 0, checkAnsweredAt: 0, checkCorrect: null});
  modules[KEYS.physics] = moduleOf([a], a.id);
  const before = structuredClone(modules), r = build(modules);
  assert.equal(r.primary.subject, 'physics');
  assert.equal(r.primary.kind, 'resume');
  assert.deepEqual(modules, before);
  const second = {...a, id: 'older-pressure-check', startedAt: a.startedAt - 1000, answeredAt: a.answeredAt - 1000};
  modules[KEYS.physics].sessions.push(second);
  const deferred = build(modules, {prefs: {deferred: {[r.primary.key]: NOW + DAY, physics: NOW + DAY}}});
  assert.notEqual(deferred.primary.subject, 'physics', 'choosing another subject must not immediately offer a second physics draft');
});

test('local Later preferences change navigation without mutating learning history or creating credit', () => {
  const modules = readyCore(), before = structuredClone(modules), first = build(modules);
  const prefs = {deferred: {[first.primary.key]: NOW + DAY}};
  const next = build(modules, {prefs});
  assert.notEqual(next.primary.key, first.primary.key);
  assert.deepEqual(modules, before);
  assert.deepEqual(prefs, {deferred: {[first.primary.key]: NOW + DAY}});
  assert.equal(build(modules, {prefs}, NOW + DAY + 1).primary.subject, 'ielts');
});

test('deferring the currently offered core choices never leaves the learner without a usable action', () => {
  const modules = readyCore(), prefs = {deferred: {}}, seen = new Set();
  for (let i = 0; i < 6; i++) {
    const r = build(modules, {prefs});
    assert.equal(typeof r.primary.title, 'string');
    assert.ok(r.primary.href.startsWith('./'), 'a local study entry remains available');
    if (seen.has(r.primary.key)) break;
    seen.add(r.primary.key); prefs.deferred[r.primary.key] = NOW + DAY;
  }
  assert.ok(seen.size >= 2);
});

test('future, guest and duplicate submissions cannot falsely make overdue IELTS current', () => {
  for (const mutate of [
    a => { a.completedAt = NOW + DAY; a.startedAt = NOW + DAY - 1000; },
    a => { a.participant = 'guest'; },
    a => { a.participant = 'unknown'; }
  ]) {
    const modules = readyCore(), a = ielts('writing', NOW - 1000); mutate(a); modules[KEYS.ielts].sessions.push(a);
    assert.equal(build(modules).primary.subject, 'ielts');
  }
  const modules = readyCore(), a = ielts('writing', NOW - 1000);
  modules[KEYS.ielts].sessions.push(a, structuredClone(a));
  assert.equal(build(modules).primary.subject, 'ielts');
});

test('SAT diagnostic suggestion requires both sections, multiple authored items and three Tallinn study dates', () => {
  const modules = {[KEYS.sat]: satReady({correct: false, help: true})};
  const before = structuredClone(modules), r = build(modules);
  assert.ok(r.sat, 'a diagnostic is useful without an accuracy or unsupported-mastery gate');
  assert.equal(r.sat.href, 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook');
  assert.equal(r.sat.deviceHref, 'https://bluebook.collegeboard.org/students/prepare-your-device/approved-devices');
  assert.deepEqual(modules, before);
  const onlyMaths = V.fresh();
  for (let i = 0; i < 3; i++) satAnswer(onlyMaths, ['sat-linear-equation', 'sat-linear-model', 'sat-area-volume'][i], NOW - (3 - i) * DAY);
  assert.equal(build({[KEYS.sat]: onlyMaths}).sat, null);
  const oneDay = V.fresh();
  for (const [i, id] of ['sat-linear-equation', 'sat-inferences', 'sat-linear-model', 'sat-transitions'].entries()) satAnswer(oneDay, id, NOW - 10000 + i * 1000);
  assert.equal(build({[KEYS.sat]: oneDay}).sat, null);
});

test('SAT viewing, repeated item copies and unknown authored references cannot create baseline eligibility', () => {
  const repeated = V.fresh();
  for (let day = 3; day > 0; day--) {
    satAnswer(repeated, 'sat-linear-equation', NOW - day * DAY);
    satAnswer(repeated, 'sat-inferences', NOW - day * DAY + 100);
  }
  // Make each submission refer to the same actual authored item per section.
  for (const a of repeated.sessions) { const v = V.video(B, a.videoId); a.questionIndex = 0; a.questionId = v.questions[0].id; }
  assert.equal(build({[KEYS.sat]: repeated}).sat, null);
  for (const change of [
    a => { a.answeredAt = 0; a.completedAt = 0; a.stage = 'question'; a.openedAt = NOW - 100; },
    a => { a.questionId = 'not-an-authored-item'; },
    a => { a.participant = 'guest'; },
    a => { a.answeredAt = NOW + DAY; a.completedAt = a.answeredAt; }
  ]) {
    const state = satReady(); change(state.sessions.at(-1));
    assert.equal(build({[KEYS.sat]: state}).sat, null);
  }
  const state = satReady(); state.sessions.push(structuredClone(state.sessions.at(-1)));
  assert.equal(build({[KEYS.sat]: state}).sat, null);
});

test('SAT distinct-day evidence uses Europe/Tallinn midnight rather than UTC', () => {
  const state = V.fresh();
  satAnswer(state, 'sat-linear-equation', Date.parse('2026-11-13T21:50:00Z'));
  satAnswer(state, 'sat-inferences', Date.parse('2026-11-13T22:10:00Z'));
  satAnswer(state, 'sat-linear-model', Date.parse('2026-11-14T22:10:00Z'));
  satAnswer(state, 'sat-transitions', Date.parse('2026-11-14T22:11:00Z'));
  assert.ok(build({[KEYS.sat]: state}).sat, 'three Tallinn dates even though only two UTC dates');
});

test('SAT Later and already-done self-report suppress only the invitation, not canonical answers or study guidance', () => {
  const modules = {[KEYS.sat]: satReady()}, before = structuredClone(modules);
  for (const prefs of [{satUntil: NOW + DAY}, {satDoneAt: NOW - 1000}]) {
    const r = build(modules, {prefs});
    assert.equal(r.sat, null); assert.ok(r.primary.href);
    assert.deepEqual(modules, before);
  }
  assert.ok(build(modules, {prefs: {satUntil: NOW - 1}}).sat);
});
