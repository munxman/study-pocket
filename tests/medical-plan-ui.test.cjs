const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../src/medical-plan.js');
const Q = require('../src/quant-engine.js');
const C = require('../src/chemistry-content.js');
const V = require('../src/video-engine.js');
const B = require('../src/video-content.js');
const L = require('../src/video-links.js');
const I = require('../src/ielts-engine.js');
const DAY = 86400000, NOW = Date.parse('2026-11-17T10:00:00Z');
const CK = C.key, IK = I.KEY, BK = 'hendrik-imat-bio-v1', PK = 'hendrik-physics-v1';
const PLAN_PREFS = 'opitasku-medical-guidance-v1';
const script = fs.readFileSync(require.resolve('../src/today-plan.js'), 'utf8');

// Production home handlers with a small simulated DOM. No browser/layout claim.
class Element {
  constructor(tag) { this.tagName = tag; this.textContent = ''; this.children = []; this.listeners = {}; this.hidden = false; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
  click() { this.listeners.click?.(); }
  querySelector(selector) { return this.all().find(x => x.tagName === selector) || null; }
  all() { return this.children.flatMap(x => [x, ...x.all()]); }
  text() { return this.textContent + this.children.map(x => x.text()).join(' '); }
}
function screen({modules = {}, prefs = {}, corrupt = false, medical = true} = {}) {
  const original = structuredClone(modules), local = new Map(Object.entries(prefs)), writes = [], subscriptions = {}, events = {};
  const target = new Element('section'), welcome = new Element('section'), choices = new Element('div');
  const ids = {'today-plan': target, 'video-welcome': welcome, 'subject-choices': choices};
  let broken = corrupt;
  class Clock extends Date { static now() { return NOW; } }
  const context = {Date: Clock, Intl,
    document: {getElementById: id => ids[id] || null, createElement: tag => new Element(tag)},
    localStorage: {getItem: key => local.get(key) || null, setItem(key, value) { writes.push([key, value]); local.set(key, value); }},
    BackupStore: {corrupt: () => broken, snapshot: () => ({modules})},
    BackupModel: {keys: [CK, IK, BK, PK, V.MODULE_ID]},
    StudySync: {subscribe(key, fn) { subscriptions[key] = fn; }, storage: {setItem() { throw Error('Home guidance must not write learner history.'); }}},
    VIDEO_CONTENT: B, VideoLinks: L, QuantEngine: Q, ChemistryContent: C,
    addEventListener(name, fn) { events[name] = fn; }
  };
  if (medical) context.MedicalPlan = M;
  context.window = context; context.globalThis = context;
  vm.runInNewContext(script, context, {filename: 'today-plan.js'});
  return {target, welcome, choices, modules, original, local, writes,
    find: label => target.all().find(x => x.textContent === label),
    primary: () => target.children.find(x => x.tagName === 'a' && x.className === 'backup-primary'),
    refresh: key => subscriptions[key](),
    corrupt() { broken = true; events['backup-changed'](); }
  };
}
function productive(kind, at) {
  const state = I.fresh(), a = I.start(state, {kind, taskIds: ['own-' + kind], title: 'Synthetic own work'}, at - 1000);
  a.texts = {response: 'A deliberately written original practice response.'}; I.submit(state, [], at); return a;
}
function chemistryState(at = NOW - 3 * DAY) {
  const state = Q.fresh(), a = Q.startSkill(state, C, at, 'concentration_dilution', 'dilution_amount_conservation');
  let q = Q.topic(C, a).questions[a.questionIndex]; a.selected = (q.answer + 1) % q.options.length; a.confidence = 'sure'; Q.submit(state, C, at + 1000); Q.beginCheck(state);
  q = Q.topic(C, a).questions[a.checkIndex]; a.checkSelected = (q.answer + 1) % q.options.length; Q.check(state, C, at + 2000); return state;
}
function modules() {
  return {[IK]: {...I.fresh(), sessions: [productive('writing', NOW - 9 * DAY), productive('speaking', NOW - 8 * DAY)]},
    [CK]: chemistryState(),
    [BK]: {version: 1, serial: 1, cards: {}, activeId: null, sessions: [{id: 'bio-old', concept: 'transport', stage: 'done', startedAt: NOW - DAY - 1000, answeredAt: NOW - DAY - 500, completedAt: NOW - DAY, correct: true, checkCorrect: true}]},
    [PK]: {version: 1, serial: 1, cards: {}, activeId: 'physics-check', sessions: [{id: 'physics-check', kind: 'quantitative', concept: 'pressure', stage: 'check', startedAt: NOW - 2 * DAY, answeredAt: NOW - 2 * DAY + 1000, selected: 1, correct: false, confidence: 'sure', completedAt: 0}]}};
}
function satState() {
  const state = V.fresh();
  for (const [i, id] of ['sat-linear-equation', 'sat-inferences', 'sat-linear-model', 'sat-transitions'].entries()) {
    const at = NOW - [3, 3, 2, 1][i] * DAY + i * 1000;
    const a = V.start(state, B, at - 100, id); a.selected = V.question(B, a).answer; a.confidence = 'sure'; V.submit(state, B, at);
  }
  return state;
}

test('home puts the medical next step before SAT and gives one primary recommendation', () => {
  const html = fs.readFileSync(require.resolve('../src/index.html'), 'utf8');
  assert.ok(html.indexOf('id="today-plan"') < html.indexOf('id="sat-home-title"'));
  const h = screen({modules: modules()});
  assert.equal(h.target.hidden, false);
  assert.equal(h.target.children.filter(x => x.tagName === 'a' && x.className === 'backup-primary').length, 1);
  assert.match(h.primary().href, /ielts\.html\?guided=1&skill=writing/);
  assert.match(h.target.text(), /MEDITSIINIÕPPE/);
  const pressure = h.target.all().find(x => x.tagName === 'a' && x.href?.includes('subject=physics'));
  assert.match(pressure.href, /concept=pressure/);
  assert.deepEqual(h.modules, h.original); assert.equal(h.writes.length, 0);
});

test('choosing another step changes browser preference only and leaves all drafts and learner history intact', () => {
  const h = screen({modules: modules()}), original = structuredClone(h.modules);
  h.find('Valin teise sammu').click();
  assert.match(h.primary().href, /subject=chemistry/);
  assert.match(h.primary().href, /skill=dilution_amount_conservation/);
  assert.deepEqual(h.modules, original);
  assert.ok(h.writes.length > 0 && h.writes.every(([key]) => key === PLAN_PREFS));
  const prefs = JSON.parse(h.local.get(PLAN_PREFS));
  assert.equal(prefs.deferred.ielts, NOW + DAY);
});

test('real submitted work received through sync refreshes the recommended next subject without auto-starting it', () => {
  const state = modules(), h = screen({modules: state});
  state[IK].sessions.push(productive('writing', NOW - 1000));
  h.refresh(IK);
  assert.match(h.primary().href, /subject=chemistry/);
  assert.match(h.primary().href, /skill=dilution_amount_conservation/);
  assert.equal(state[CK].sessions.length, 1, 'rendering a new recommendation does not open a question');
  state[CK].sessions.push({...state[CK].sessions[0], id: 'chemistry-new', startedAt: NOW - 900, answeredAt: NOW - 800, checkAnsweredAt: NOW - 500, completedAt: NOW - 500});
  h.refresh(CK);
  assert.match(h.primary().href, /imat\.html\?guided=8/);
  assert.equal(h.writes.length, 0);
});

test('a targeted chemistry skill does not inherit an unrelated video solely from the same broad topic', () => {
  const state = modules(); state[IK].sessions.push(productive('writing', NOW - 1000));
  const a = Q.startSkill(state[CK], C, NOW - 2 * DAY, 'concentration_dilution', 'molarity_from_amount');
  let q = Q.topic(C, a).questions[a.questionIndex]; a.selected = (q.answer + 1) % q.options.length; a.confidence = 'sure';
  Q.submit(state[CK], C, NOW - 2 * DAY + 1000); Q.beginCheck(state[CK]);
  q = Q.topic(C, a).questions[a.checkIndex]; a.checkSelected = (q.answer + 1) % q.options.length; Q.check(state[CK], C, NOW - 2 * DAY + 2000);
  const help = L.suggestedHelp(state, B, NOW);
  assert.equal(help.videoId, 'i12-chem-molarity', 'fixture offers a video for another exact skill in the same topic');
  const h = screen({modules: state});
  assert.match(h.primary().href, /skill=dilution_amount_conservation/);
  assert.equal(h.find('Vaatan sobivat selgitust'), undefined);
});

test('SAT invitation stays secondary and Later/done never manufacture a score, submission or study day', () => {
  for (const action of ['Tuleta hiljem meelde', 'Olen proovi juba teinud']) {
    const state = modules(); state[V.MODULE_ID] = satState(); const h = screen({modules: state}), before = structuredClone(state);
    const link = h.find('Vaata ametlikku SAT-i proovi');
    assert.equal(link.href, 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook');
    assert.equal(link.target, '_blank'); assert.equal(link.rel, 'noopener noreferrer');
    assert.match(h.target.text(), /iPhone’is saad jätkata/);
    assert.equal(h.find('Milline seade sobib?').href, 'https://bluebook.collegeboard.org/students/prepare-your-device/approved-devices');
    h.find(action).click();
    assert.equal(h.find('Vaata ametlikku SAT-i proovi'), undefined);
    assert.deepEqual(state, before); assert.match(h.primary().href, /ielts\.html/);
    const prefs = JSON.parse(h.local.get(PLAN_PREFS));
    if (action === 'Tuleta hiljem meelde') assert.equal(prefs.satUntil, NOW + 7 * DAY);
    else assert.equal(prefs.satDoneAt, NOW);
    assert.ok(h.writes.every(([key]) => key === PLAN_PREFS));
  }
});

test('a newly unreadable store hides the old recommendation instead of presenting stale personal guidance', () => {
  const h = screen({modules: modules()}); assert.equal(h.target.hidden, false);
  h.corrupt(); assert.equal(h.target.hidden, true);
  assert.deepEqual(h.modules, h.original); assert.equal(h.writes.length, 0);
});

test('older clients without MedicalPlan retain the existing safe recommendation fallback', () => {
  const h = screen({modules: modules(), medical: false});
  assert.equal(h.target.hidden, false); assert.match(h.primary().href, /subject=physics/);
  assert.equal(h.find('Valin teise sammu'), undefined);
  assert.deepEqual(h.modules, h.original); assert.equal(h.writes.length, 0);
});
