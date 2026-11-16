const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const B = require('../src/video-content.js');
const E = require('../src/video-engine.js');
const L = require('../src/video-links.js');
const M = require('../src/sat-practice-model.js');
const NOW = Date.UTC(2026, 10, 16, 10);
const HTML = fs.readFileSync(require.resolve('../src/sat.html'), 'utf8');
const SCRIPT = fs.readFileSync(require.resolve('../src/sat.js'), 'utf8');

// This fixture executes the actual handlers with the real engine/content/model.
// It checks saved state and navigation, not physical-device rendering or focus.
function screen({search = '', initial = {}, online = true, failWrites = false} = {}) {
  const rows = new Map(Object.entries(initial).map(([key, value]) => [key,
    typeof value === 'string' ? value : JSON.stringify(value)]));
  const writes = [], subscribers = new Map(), globalEvents = {};
  const elements = new Map([...HTML.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => [id, {
    id, innerHTML: '', hidden: /^(geometry-calc-toggle|geometry-calc-panel)$/.test(id), events: {}, attrs: {},
    addEventListener(type, callback) { this.events[type] = callback; },
    setAttribute(key, value) { this.attrs[key] = String(value); },
    focus() { this.focused = true; }
  }]));
  const main = elements.get('sat-coach');
  let url = new URL('https://example.test/study-pocket/sat.html' + search);
  const store = {
    getItem: key => rows.get(key) ?? null,
    setItem(key, value) {
      if (failWrites) throw Error('Simulated storage unavailable');
      writes.push(key); rows.set(key, value);
    }
  };
  class Clock extends Date { static now() { return NOW; } }
  const context = {
    VIDEO_CONTENT: B, VideoEngine: E, VideoLinks: L, SatPracticeModel: M,
    StudySync: { storage: store, subscribe(key, callback) { subscribers.set(key, callback); } },
    document: { getElementById: id => elements.get(id) || null },
    location: { get search() { return url.search; } },
    history: { replaceState(_state, _title, path) { url = new URL(path, url); } },
    navigator: { onLine: online }, URLSearchParams, Date: Clock,
    addEventListener(type, callback) { globalEvents[type] = callback; }
  };
  context.window = context;
  vm.runInNewContext(SCRIPT, context, {filename: 'sat.js'});
  return {
    main, rows, writes, elements,
    state: () => JSON.parse(store.getItem(E.MODULE_ID)),
    search: () => url.search,
    active: () => {
      const state = JSON.parse(store.getItem(E.MODULE_ID));
      return state.sessions.find(a => a.id === url.searchParams.get('session'));
    },
    change(name, value) { main.events.change({target: {name, value: String(value)}}); },
    click(attribute, value) {
      const marker = value === undefined ? attribute : attribute + '="' + value + '"';
      assert.ok(main.innerHTML.includes(marker), 'visible control exists: ' + marker);
      const key = attribute.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      main.events.click({target: {closest: selector => selector === '[' + attribute + ']' ?
        {dataset: {[key]: value}} : null}});
    },
    submit() {
      assert.match(main.innerHTML, /id="sat-answer"/);
      main.events.submit({preventDefault() {}});
    },
    sync(state) { subscribers.get(E.MODULE_ID)(JSON.stringify(state)); },
    connection(online) { context.navigator.onLine = online; globalEvents[online ? 'online' : 'offline'](); }
  };
}

function answer(h, {correct = true, confidence = 'sure'} = {}) {
  const a = h.active(), q = E.question(B, a);
  h.change('choice', correct ? q.answer : (q.answer + 1) % q.options.length);
  h.change('confidence', confidence);
  h.submit();
}

function completed(state, videoId, at, correct = true) {
  const a = E.start(state, B, at, videoId), q = E.question(B, a);
  a.selected = correct ? q.answer : (q.answer + 1) % q.options.length;
  a.confidence = 'sure'; E.submit(state, B, at);
  return a;
}

test('SAT opens one question before help and preserves the other subjects and their records', () => {
  const untouched = {'hendrik-imat-v1': {sentinel: 'biology'}, 'hendrik-chemistry-v1': {sentinel: 'chemistry'}, 'hendrik-ielts-v1': {sentinel: 'IELTS'}};
  const h = screen({initial: untouched}), a = h.active();
  assert.equal(M.getSection(a.videoId), 'maths');
  assert.equal(h.state().sessions.length, 1);
  assert.equal(a.answeredAt, 0); assert.equal(a.assisted, false); assert.equal(a.selected, null);
  assert.deepEqual(a.exposures, []);
  assert.doesNotMatch(h.main.innerHTML, /class="video-support"|data-video-open/);
  assert.ok(!h.main.innerHTML.includes(E.video(B, a.videoId).title), 'external video title does not cue the first answer');
  assert.match(h.main.innerHTML, /href="\.\/imat.html\?guided=8"/);
  assert.match(h.main.innerHTML, /href="\.\/quant.html\?subject=chemistry"/);
  assert.match(h.main.innerHTML, /href="\.\/ielts.html"/);
  for (const [key, value] of Object.entries(untouched)) assert.equal(h.rows.get(key), JSON.stringify(value));
  assert.ok(h.writes.every(key => key === E.MODULE_ID));
});

test('SAT answer and confidence selections survive pause and exact-session reload without creating another attempt', () => {
  const h = screen(); h.change('choice', 1); h.change('confidence', 'unsure');
  const before = h.state(), a = h.active();
  const reloaded = screen({search: h.search(), initial: Object.fromEntries(h.rows)});
  assert.equal(reloaded.active().id, a.id);
  assert.deepEqual(reloaded.state(), before);
  assert.match(reloaded.main.innerHTML, /name="choice" value="1" checked/);
  assert.match(reloaded.main.innerHTML, /name="confidence" value="unsure" checked/);
  assert.deepEqual(reloaded.writes, []);
});

test('SAT requires answer and confidence, freezes submission, and never grants ordinary block or chain credit', () => {
  const h = screen(); h.submit();
  assert.equal(h.active().answeredAt, 0);
  assert.match(h.main.innerHTML, /Vali vastus ja kindlus/);
  answer(h, {correct: false});
  const first = h.active();
  assert.equal(first.correct, false); assert.equal(first.independent, true); assert.equal(first.assisted, false);
  assert.equal(first.ordinaryBlockCredit, false); assert.equal(first.chainCredit, false); assert.equal(first.masteryCredit, false);
  assert.equal(first.delayedProbe, false); assert.equal(h.state().sessions.length, 1);
  h.change('choice', E.question(B, first).answer);
  h.main.events.submit({preventDefault() {}}); // A queued second tap must be harmless.
  assert.deepEqual(h.active(), first, 'a completed answer cannot be edited through the change handler');
  const reloaded = screen({search: h.search(), initial: Object.fromEntries(h.rows)});
  for (const key of ['id', 'selected', 'confidence', 'correct', 'answeredAt', 'completedAt', 'assisted', 'independent', 'delayedProbe']) {
    assert.equal(reloaded.active()[key], first[key], 'redisplaying feedback preserves ' + key);
  }
  assert.equal(reloaded.active().exposures.length, first.exposures.length + 1);
  const redisplayed = reloaded.active(); reloaded.connection(false); reloaded.connection(true);
  assert.deepEqual(reloaded.active(), redisplayed, 'ordinary redraw does not manufacture more feedback exposure');
  assert.match(reloaded.main.innerHTML, /Vaatame mõtte läbi/);
  assert.doesNotMatch(reloaded.main.innerHTML, /id="sat-answer"/);
  assert.equal(reloaded.state().sessions.length, 1);
});

test('SAT suggests the other section only after an explicit click and stops its suggested visit after two answers', () => {
  const h = screen(); answer(h);
  assert.equal(h.state().sessions.length, 1);
  assert.match(h.main.innerHTML, /data-action="next"/);
  h.click('data-action', 'next');
  assert.equal(M.getSection(h.active().videoId), 'english');
  assert.equal(h.state().sessions.length, 2);
  assert.match(h.search(), /step=2/);
  assert.equal(h.active().assisted, false);
  answer(h);
  assert.equal(h.state().sessions.length, 2);
  assert.match(h.main.innerHTML, /Kaks õppesammu on tehtud/);
  assert.doesNotMatch(h.main.innerHTML, /data-action="next"/);
  assert.match(h.main.innerHTML, /Bioloogia, keemia ja IELTS/);
  const reloaded = screen({search: h.search(), initial: Object.fromEntries(h.rows)});
  assert.equal(reloaded.state().sessions.length, 2);
  assert.match(reloaded.main.innerHTML, /Kaks õppesammu on tehtud/);
});

test('optional SAT help marks support before the answer while later help cannot rewrite an independent answer', () => {
  const h = screen(); h.click('data-action', 'help');
  assert.equal(h.active().assisted, true); assert.equal(h.active().openedAt, 0);
  assert.match(h.main.innerHTML, /class="video-support"/);
  h.click('data-video-open'); assert.equal(h.active().openedAt, NOW);
  answer(h);
  assert.equal(h.active().independent, false); assert.equal(h.active().delayedProbe, false);
  assert.match(h.main.innerHTML, /toetatud harjutus/);
  const independent = screen(); answer(independent);
  const answerBefore = independent.active(); independent.click('data-action', 'help');
  const answerAfter = independent.active();
  for (const key of ['selected', 'correct', 'answeredAt', 'assisted', 'independent', 'delayedProbe']) {
    assert.equal(answerAfter[key], answerBefore[key], 'post-answer help preserves ' + key);
  }
});

test('SAT returns to the exact due missed skill without autohelp and preserves the different later question', () => {
  const state = E.fresh(), first = completed(state, 'sat-linear-model', NOW - 2 * E.DAY, false);
  const h = screen({search: '?section=maths', initial: {[E.MODULE_ID]: state}}), a = h.active();
  assert.equal(a.videoId, first.videoId); assert.notEqual(a.questionId, first.questionId);
  assert.equal(a.delayedEligibleAtStart, true); assert.equal(a.assisted, false);
  assert.equal(a.answeredAt, 0); assert.doesNotMatch(h.main.innerHTML, /class="video-support"/);
  answer(h); assert.equal(h.active().delayedProbe, true);
});

test('SAT offers familiar same-day repetition explicitly instead of silently consuming another question', () => {
  const state = E.fresh();
  for (const id of M.sections.maths) completed(state, id, NOW - 1000);
  const h = screen({search: '?section=maths', initial: {[E.MODULE_ID]: state}});
  assert.equal(h.state().sessions.length, 4); assert.equal(h.writes.length, 0);
  assert.match(h.main.innerHTML, /data-action="repeat"/);
  h.click('data-action', 'repeat');
  assert.equal(h.state().sessions.length, 5);
  assert.equal(h.active().questionIndex, 0); assert.equal(h.active().repeatedQuestion, true);
  assert.equal(h.active().delayedEligibleAtStart, false);
});

test('SAT switching sections preserves the unfinished selection and shows the calculator only for Maths', () => {
  const h = screen(); h.change('choice', 2); h.change('confidence', 'sure');
  const id = h.active().id, toggle = h.elements.get('geometry-calc-toggle'), panel = h.elements.get('geometry-calc-panel');
  assert.equal(toggle.hidden, false); panel.hidden = false;
  h.click('data-section', 'english');
  assert.equal(toggle.hidden, true); assert.equal(panel.hidden, true); assert.equal(toggle.attrs['aria-expanded'], 'false');
  assert.equal(h.state().sessions.find(a => a.id === id).selected, 2);
  h.click('data-section', 'maths');
  assert.equal(h.active().id, id); assert.equal(h.state().sessions.length, 2);
  assert.equal(toggle.hidden, false); answer(h); assert.equal(toggle.hidden, false, 'maths calculator remains usable while reviewing feedback');
});

test('SAT home resumes an unfinished English attempt before suggesting a fresh Maths question', () => {
  const state = E.fresh(), a = E.start(state, B, NOW - 1000, 'sat-transitions');
  a.selected = 2; a.confidence = 'unsure';
  const h = screen({initial: {[E.MODULE_ID]: state}});
  assert.equal(h.active().id, a.id); assert.equal(h.active().selected, 2);
  assert.equal(h.state().sessions.length, 1);
  assert.equal(h.elements.get('geometry-calc-toggle').hidden, true);
});

test('SAT first Maths choice uses a recent exact ordinary skill miss as a probe without teaching first', () => {
  const maths = {sessions: [{id: 'ordinary-geometry-miss', concept: 'plane_geometry', questionIndex: 0,
    answeredAt: NOW - 100, correct: false, confidence: 'sure'}]};
  const h = screen({initial: {'hendrik-maths-v1': maths}});
  assert.equal(h.active().videoId, 'sat-area-volume');
  assert.equal(h.active().assisted, false); assert.equal(h.active().answeredAt, 0);
  assert.deepEqual(h.active().exposures, []);
  assert.match(h.main.innerHTML, /seostub ühe varasema matemaatikaülesandega/);
  assert.equal(h.rows.get('hendrik-maths-v1'), JSON.stringify(maths));
  for (const change of [{questionIndex: null}, {answeredAt: NOW - 8 * E.DAY}, {participant: 'guest'}]) {
    const ignored = screen({initial: {'hendrik-maths-v1': {sessions: [{...maths.sessions[0], ...change}]}}});
    assert.equal(ignored.active().videoId, 'sat-linear-equation');
    assert.doesNotMatch(ignored.main.innerHTML, /seostub ühe varasema matemaatikaülesandega/);
  }
});

test('incoming canonical sync keeps the URL-selected attempt even when another session is active elsewhere', () => {
  const h = screen(); h.change('choice', 1); h.change('confidence', 'unsure');
  const id = h.active().id, incoming = h.state();
  E.start(incoming, B, NOW, 'sat-inferences');
  h.sync(incoming);
  assert.match(h.main.innerHTML, /Math · matemaatika/);
  assert.match(h.main.innerHTML, /name="choice" value="1" checked/);
  assert.equal(new URLSearchParams(h.search()).get('session'), id);
  const unchanged = [...h.rows]; h.sync(E.fresh());
  assert.match(h.main.innerHTML, /Ühendatud salvestuses pole seda sammu veel/);
  assert.deepEqual([...h.rows], unchanged);
  assert.match(h.main.innerHTML, /name="choice" value="1" checked/);
});

test('SAT preserves malformed history and stale session links instead of overwriting or silently restarting', () => {
  const raw = '{broken-json';
  const bad = screen({initial: {[E.MODULE_ID]: raw}});
  assert.equal(bad.rows.get(E.MODULE_ID), raw); assert.deepEqual(bad.writes, []);
  assert.match(bad.main.innerHTML, /Hoiame varasema töö alles/);
  const state = E.fresh(), stale = screen({search: '?session=does-not-exist', initial: {[E.MODULE_ID]: state}});
  assert.deepEqual(stale.state(), state); assert.deepEqual(stale.writes, []);
  assert.match(stale.main.innerHTML, /See õppesamm pole selles brauseris veel saadaval/);
});

test('offline SAT still saves a local answer and reconnect rendering does not start a new step', () => {
  const h = screen({online: false});
  assert.match(h.main.innerHTML, /Oled võrguühenduseta/);
  answer(h); const result = h.active();
  h.connection(true);
  assert.deepEqual(h.active(), result); assert.equal(h.state().sessions.length, 1);
  assert.doesNotMatch(h.main.innerHTML, /Oled võrguühenduseta/);
});

test('SAT storage failure is explicit and preserves the existing stored history', () => {
  const state = E.fresh(), h = screen({initial: {[E.MODULE_ID]: state}, failWrites: true});
  assert.match(h.main.innerHTML, /Salvestamine ei õnnestunud/);
  assert.deepEqual(h.state(), state); assert.deepEqual(h.writes, []);
});
