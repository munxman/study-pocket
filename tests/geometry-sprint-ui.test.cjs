const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const E = require('../src/geometry-sprint-engine.js');
require('../src/geometry-sprint-content.js');
const DATA = globalThis.GeometrySprintContent;
const SOURCE = fs.readFileSync(path.join(__dirname, '../src/geometry-sprint.js'), 'utf8');
const HTML = fs.readFileSync(path.join(__dirname, '../src/geometry-sprint.html'), 'utf8');
const KEY = 'study-pocket-geometry-coach-v1';
const START = Date.UTC(2026, 10, 11, 15);

class Element {
  constructor(tag, document) { this.tagName = tag.toUpperCase(); this.document = document; this.children = []; this.listeners = new Map(); this.attributes = {}; this._text = ''; this.hidden = false; this.value = ''; this.className = ''; this.disabled = false; this.readOnly = false; this.open = false; this.parentNode = null; this.classList = { toggle: () => {} }; if (tag === 'template') this.content = new Element('fragment', document); }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map((child) => typeof child === 'string' ? child : child.textContent).join(''); }
  append(...items) { for (const item of items) { if (typeof item !== 'string') item.parentNode = this; this.children.push(item); } }
  replaceChildren(...items) { this._text = ''; this.children = []; this.append(...items); }
  setAttribute(key, value) { this.attributes[key] = String(value); if (key === 'id') this.id = String(value); if (key === 'class') this.className = String(value); if (key === 'hidden') this.hidden = true; }
  getAttribute(key) { return this.attributes[key] ?? null; }
  addEventListener(type, fn) { const listeners = this.listeners.get(type) || []; listeners.push(fn); this.listeners.set(type, listeners); }
  async emit(type, extra = {}) { for (const fn of this.listeners.get(type) || []) await fn({ type, target: this, preventDefault() {}, ...extra }); }
  async click() { if (this.disabled || this.hidden) return; this.document.clicks.push(this); await this.emit('click'); }
  focus() { this.document.activeElement = this; }
  scrollIntoView() { this.document.scrolledTo = this.id; }
  select() { this.selected = true; }
  cloneNode(deep) { const copy = new Element(this.tagName.toLowerCase(), this.document); copy._text = this._text; copy.attributes = { ...this.attributes }; if (deep) copy.append(...this.children.map((child) => typeof child === 'string' ? child : child.cloneNode(true))); return copy; }
  querySelectorAll(selector) {
    const selectors = selector.split(',').map((s) => s.trim());
    const match = (node) => selectors.some((s) => s[0] === '#' ? node.id === s.slice(1) : s[0] === '.' ? node.className.split(' ').includes(s.slice(1)) : node.tagName.toLowerCase() === s);
    const result = [];
    for (const child of this.children) if (typeof child !== 'string') { if (match(child)) result.push(child); result.push(...child.querySelectorAll(selector)); }
    return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

function documentFixture() {
  const document = { clicks: [], activeElement: null, scrolledTo: null };
  document.body = new Element('body', document);
  document.createElement = (tag) => new Element(tag, document);
  document.getElementById = (id) => document.body.querySelector('#' + id);
  const stack = [document.body], voids = new Set(['meta', 'link', 'input', 'br', 'hr']);
  for (const token of HTML.match(/<[^>]+>|[^<]+/g)) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) { const tag = token.match(/^<\/([^\s>]+)/)?.[1]; const i = stack.findLastIndex((node) => node.tagName.toLowerCase() === tag); if (i > 0) stack.length = i; continue; }
    if (token.startsWith('<')) {
      const tag = token.match(/^<([^\s/>]+)/)?.[1]; if (!tag) continue;
      const node = new Element(tag, document);
      for (const [, key, value] of token.matchAll(/([\w:-]+)="([^"]*)"/g)) node.setAttribute(key, value);
      if (/\shidden(?:\s|>)/.test(token)) node.hidden = true;
      if (/\sreadonly(?:\s|>)/.test(token)) node.readOnly = true;
      stack.at(-1).append(node);
      if (!voids.has(tag) && !token.endsWith('/>')) stack.push(node);
    } else stack.at(-1).append(token);
  }
  return document;
}

function harness({ storage = new Map(), storageFailure = false, clipboardFailure = false, now = START } = {}) {
  const document = documentFixture(), intervals = new Map(), timeouts = new Map(), clipboard = [], blobs = [], revoked = [];
  let clock = now, timerId = 0;
  class Clock extends Date { static now() { return clock; } }
  const context = {
    GeometrySprintEngine: E, GeometrySprintContent: DATA, document, Intl, Date: Clock,
    localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => { if (storageFailure) throw Error('quota'); storage.set(key, value); } },
    navigator: { clipboard: { writeText: async (text) => { if (clipboardFailure) throw Error('denied'); clipboard.push(text); } } },
    Blob: class { constructor(parts, options) { this.parts = parts; this.options = options; } },
    URL: { createObjectURL(blob) { blobs.push(blob); return 'blob:isolated-' + blobs.length; }, revokeObjectURL(url) { revoked.push(url); } },
    setInterval: (fn) => { intervals.set(++timerId, fn); return timerId; }, clearInterval: (id) => intervals.delete(id),
    setTimeout: (fn) => { timeouts.set(++timerId, fn); return timerId; }, clearTimeout: (id) => timeouts.delete(id),
  };
  vm.runInNewContext(SOURCE, context);
  const h = {
    storage, document, clipboard, blobs, revoked, get now() { return clock; },
    id: (id) => document.getElementById(id),
    state: () => JSON.parse(storage.get(KEY)),
    button: (text, scope = document.body) => scope.querySelectorAll('button').find((node) => node.textContent.trim() === text),
    async click(text, scope) { const node = h.button(text, scope); assert.ok(node, 'button exists: ' + text); await node.click(); },
    async input(node, value, type = 'input') { assert.ok(node, 'input exists'); node.value = value; await node.emit(type); },
    async submit(node) { assert.ok(node, 'form exists'); await node.emit('submit'); },
    answerField(scope) { return scope.querySelectorAll('input,select').find((node) => node.type !== 'checkbox'); },
    async advance(ms, runTimers = true) { clock += ms; if (runTimers) for (const fn of [...intervals.values()]) await fn(); },
    reload(options = {}) { return harness({ storage, storageFailure, clipboardFailure, now: clock, ...options }); },
    async fillDiagnostic(values = DATA.diagnostic.map((q) => String(q.answer))) {
      for (let i = 0; i < DATA.diagnostic.length; i++) {
        await h.input(h.answerField(h.id('diagnostic-questions')), values[i] || '');
        if (i < DATA.diagnostic.length - 1) await h.click('Salvesta ja järgmine', h.id('diagnostic-nav'));
      }
      await h.submit(h.id('diagnostic-form'));
    },
  };
  return h;
}

test('Diagnostic answers and reasoning autosave per input and resume at the next question after reload', async () => {
  let h = harness();
  await h.input(h.answerField(h.id('diagnostic-questions')), '1620');
  await h.input(h.id('diagnostic-questions').querySelector('textarea'), '9 kolmnurka, igaüks 180 kraadi');
  await h.click('Salvesta ja järgmine', h.id('diagnostic-nav'));
  h = h.reload();
  assert.equal(h.state().diagnostic.values[0], '1620');
  assert.equal(h.state().diagnostic.working[0], '9 kolmnurka, igaüks 180 kraadi');
  assert.equal(h.state().diagnostic.submitted, null);
  assert.equal(h.state().diagnostic.index, 1);
  assert.equal(h.answerField(h.id('diagnostic-questions')).getAttribute('aria-label'), DATA.diagnostic[1].prompt);
  await h.click('Eelmine', h.id('diagnostic-nav'));
  assert.equal(h.answerField(h.id('diagnostic-questions')).value, '1620');
});

test('Submitted diagnostic chooses two topics and four short submitted steps lead to an unstarted mock choice', async () => {
  const h = harness(), values = DATA.diagnostic.map((q) => String(q.answer)); values[0] = '-1'; values[5] = '-1';
  await h.fillDiagnostic(values);
  assert.deepEqual(h.state().diagnostic.submitted.topics, ['areas', 'angles']);
  const frozen = structuredClone(h.state().diagnostic.submitted);
  for (let i = 0; i < 4; i++) {
    const step = E.nextStep(h.state(), DATA);
    assert.equal(step.kind, 'practice');
    await h.input(h.answerField(h.id('guided-practice')), '-1');
    await h.input(h.id('guided-practice').querySelector('textarea'), 'My attempted reasoning ' + i);
    await h.submit(h.id('guided-practice').querySelector('form'));
    assert.equal(h.state().practice[step.topic][step.index].attempts[0].correct, false);
    await h.click('Järgmine väike samm', h.id('guided-practice'));
  }
  assert.deepEqual(E.nextStep(h.state(), DATA), { kind: 'mock' });
  assert.equal(h.state().mock, null, 'practice does not auto-start a timed assessment');
  assert.equal(h.id('mock-options').hidden, false);
  assert.deepEqual(h.state().diagnostic.submitted, frozen);
});

test('An unanswered diagnostic item is unassessed, all-blank submission makes no personal weakness plan', async () => {
  const empty = harness(); await empty.fillDiagnostic(Array(8).fill(''));
  assert.equal(empty.state().diagnostic.submitted, null);
  const h = harness(), values = DATA.diagnostic.map((q) => String(q.answer)); values[6] = '';
  await h.fillDiagnostic(values);
  assert.equal(h.state().diagnostic.submitted.reasons.mixed, 'unanswered');
  assert.equal(E.rankTopics(DATA, h.state().diagnostic.submitted.values).stats.find((s) => s.topic === 'mixed').missed, 0);
});

test('Wrong practice and explicit unknown permit continuation without changing the submitted result', async () => {
  let h = harness(); await h.fillDiagnostic();
  await h.click('Ma ei tea veel · vaatan selgitust', h.id('guided-practice'));
  const first = h.state().diagnostic.submitted.topics[0];
  assert.equal(h.state().practice[first][0].attempts[0].unknown, true);
  h = h.reload();
  assert.equal(E.nextStep(h.state(), DATA).index, 1);
  await h.input(h.answerField(h.id('guided-practice')), 'wrong');
  await h.submit(h.id('guided-practice').querySelector('form'));
  await h.click('Järgmine väike samm', h.id('guided-practice'));
  assert.equal(E.nextStep(h.state(), DATA).topic, h.state().diagnostic.submitted.topics[1]);
});

test('Storage failure is visible and unfinished diagnostic working can be recovered by explicit copy', async () => {
  const h = harness({ storageFailure: true });
  await h.input(h.answerField(h.id('diagnostic-questions')), '1620');
  await h.input(h.id('diagnostic-questions').querySelector('textarea'), 'My unsaved 9 × 180 reasoning');
  assert.match(h.id('save-status').textContent, /ei õnnestunud/);
  await h.id('copy-work').click();
  assert.match(h.clipboard[0], /My unsaved 9 × 180 reasoning/);
  assert.match(h.clipboard[0], /1620/);
});

test('Timed expiry freezes existing working and blocks a late input even before a timer callback', async () => {
  const h = harness(); await h.id('mock-start').click();
  await h.input(h.id('mock-questions').querySelector('textarea'), 'Work saved before deadline');
  await h.advance(35 * 60 * 1000 + 1, false);
  await h.input(h.id('mock-questions').querySelector('textarea'), 'Late replacement');
  assert.equal(h.state().mock.expired, true);
  assert.equal(h.state().mock.finished, true);
  assert.equal(h.state().mock.working[0], 'Work saved before deadline');
  assert.equal(h.id('mock-questions').querySelector('textarea').readOnly, true);
  assert.equal(h.id('mock-key').hidden, true, 'answers stay hidden until deliberate reveal');
  assert.equal(h.id('mock-reveal').hidden, false);
  await h.id('mock-reveal').click();
  assert.equal(h.id('mock-key').hidden, false);
});

test('Short mock practice resumes after a long pause with its working and question index, without timed credit', async () => {
  let h = harness(); await h.id('mock-short').click();
  await h.input(h.id('mock-questions').querySelector('textarea'), 'First solution in a short session');
  await h.click('Järgmine ülesanne', h.id('mock-nav'));
  await h.input(h.id('mock-questions').querySelector('textarea'), 'Second draft');
  await h.click('Salvestan ja teen pausi', h.id('mock-nav'));
  await h.advance(2 * 60 * 60 * 1000);
  h = h.reload();
  assert.equal(h.state().mock.mode, 'practice');
  assert.equal(h.state().mock.index, 1);
  assert.equal(h.state().mock.finished, false);
  assert.equal(h.id('mock-questions').querySelector('textarea').value, 'Second draft');
  assert.equal(h.id('mock-clock').hidden, true);
  await h.id('mock-finish').click();
  assert.equal(h.state().mock.finished, true);
  assert.equal(h.state().mock.mode, 'practice');
});

test('Legacy diagnostic and finished self-marked mock restore without deleting original storage', async () => {
  const diagnostic = DATA.diagnostic.map((q) => String(q.answer)), mock = { started: START - 50000, finished: true, marks: ['4', '4', '3', '4', '4', '5'] };
  const storage = new Map([['study-pocket-geometry-diagnostic-v1', JSON.stringify(diagnostic)], ['study-pocket-geometry-mock-v1', JSON.stringify(mock)]]);
  const before = new Map(storage), h = harness({ storage });
  assert.equal(h.id('diagnostic-form').hidden, true);
  assert.equal(h.id('mock-key').hidden, false);
  await h.id('copy-work').click();
  assert.match(h.clipboard[0], /Minu vastus: 1620/);
  for (const [key, value] of before) assert.equal(storage.get(key), value);
});

test('Reloaded submitted practice exports reasoning; clipboard denial exposes selectable recovery text', async () => {
  let h = harness({ clipboardFailure: true }); await h.fillDiagnostic();
  await h.input(h.answerField(h.id('guided-practice')), '8');
  await h.input(h.id('guided-practice').querySelector('textarea'), 'My independent method to share');
  await h.submit(h.id('guided-practice').querySelector('form'));
  h = h.reload();
  await h.id('copy-work').click();
  assert.equal(h.id('share-text').hidden, false);
  assert.equal(h.id('share-text').selected, true);
  assert.match(h.id('share-text').value, /My independent method to share/);
  await h.id('download-work').click();
  assert.equal(h.blobs.length, 1);
  assert.match(h.blobs[0].parts.join(''), /My independent method to share/);
});

test('Observed example help stays supported after closing the example and reloading', async () => {
  let h = harness(); await h.fillDiagnostic();
  const topic = h.state().diagnostic.submitted.topics[0];
  const help = h.id('guided-practice').querySelector('details'); help.open = true; await help.emit('toggle');
  help.open = false; await help.emit('toggle');
  h = h.reload();
  const checkbox = h.id('guided-practice').querySelectorAll('input').find((node) => node.type === 'checkbox');
  assert.equal(checkbox.disabled, true);
  assert.equal(checkbox.checked, true);
  await h.input(h.answerField(h.id('guided-practice')), '8');
  await h.submit(h.id('guided-practice').querySelector('form'));
  assert.equal(h.state().practice[topic][0].attempts[0].help, true);
});

test('A correction note cannot replace the frozen original wrong answer or reasoning', async () => {
  const h = harness(); await h.fillDiagnostic();
  const topic = h.state().diagnostic.submitted.topics[0];
  await h.input(h.answerField(h.id('guided-practice')), '-1');
  await h.input(h.id('guided-practice').querySelector('textarea'), 'Original mistaken method');
  await h.submit(h.id('guided-practice').querySelector('form'));
  const original = structuredClone(h.state().practice[topic][0].attempts[0]);
  const fields = h.id('guided-practice').querySelectorAll('textarea');
  assert.equal(fields[0].readOnly, true);
  await h.input(fields[1], 'I now subtract the interior angle from 180 degrees');
  await h.submit(h.id('guided-practice').querySelector('form'));
  assert.deepEqual(h.state().practice[topic][0].attempts, [original]);
  assert.match(h.state().practice[topic][0].correction, /subtract/);
});

test('Expiry on reload retains a failed-save warning instead of replacing it with generic reassurance', async () => {
  const seed = E.fresh(DATA); seed.mock = { started: START - 36 * 60 * 1000, finished: false, mode: 'timed', working: ['Existing method'], marks: [] };
  const h = harness({ storage: new Map([[KEY, JSON.stringify(seed)]]), storageFailure: true });
  assert.equal(h.id('mock-questions').querySelector('textarea').readOnly, true);
  assert.match(h.id('save-status').textContent, /ei õnnestunud/);
  await h.id('copy-work').click();
  assert.match(h.clipboard[0], /Existing method/);
});

test('Finish and conversion buttons on a stale background page respect the elapsed deadline', async () => {
  for (const action of ['finish', 'convert']) {
    const h = harness(); await h.id('mock-start').click();
    await h.input(h.id('mock-questions').querySelector('textarea'), 'Saved before background');
    await h.advance(36 * 60 * 1000, false);
    if (action === 'finish') await h.id('mock-finish').click();
    else await h.click('Jätkan osadena · ajastatud proov lõpeb', h.id('mock-nav'));
    assert.equal(h.state().mock.expired, true, action + ' must apply expiry first');
    assert.equal(h.state().mock.mode, 'timed');
    assert.equal(h.state().mock.finishedAt, START + 35 * 60 * 1000);
    assert.equal(h.state().mock.working[0], 'Saved before background');
  }
});

test('Pause after failed saving keeps the recovery warning and does not promise a saved resume', async () => {
  const h = harness({ storageFailure: true });
  await h.input(h.answerField(h.id('diagnostic-questions')), '1620');
  await h.click('Praegu paus', h.id('coach-next'));
  assert.match(h.id('save-status').textContent, /ei õnnestunud/);
  assert.doesNotMatch(h.id('pause-note').textContent, /Järgmisel avamisel ootab sama/);
  assert.match(h.id('pause-note').textContent, /sulge|lahti|avatud|koopia|kopeeri|salvesta/i);
});
