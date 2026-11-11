const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Simulated DOM: these exercise production event handlers and actual HTML controls.
// They do not establish browser rendering, mobile layout, or native focus behavior.
class Element {
  constructor(tag, document) {
    this.tagName = tag.toUpperCase(); this.document = document; this.children = [];
    this.attributes = {}; this.listeners = new Map(); this.parentNode = null;
    this._text = ''; this._value = ''; this.hidden = false; this.disabled = false;
    this.readOnly = false; this.selectionStart = 0; this.selectionEnd = 0;
  }
  get value() { return this._value; }
  set value(value) { this._value = String(value); this.selectionStart = this.selectionEnd = this._value.length; }
  get textContent() { return this._text + this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
  set textContent(value) { this._text = String(value); this.children = []; }
  append(...items) { for (const item of items) { if (typeof item !== 'string') item.parentNode = this; this.children.push(item); } }
  setAttribute(key, value) {
    this.attributes[key] = String(value);
    if (key === 'id') this.id = String(value);
    if (key === 'type') this.type = String(value);
    if (key === 'hidden') this.hidden = true;
    if (key === 'disabled') this.disabled = true;
    if (key === 'readonly') this.readOnly = true;
  }
  getAttribute(key) { return this.attributes[key] ?? null; }
  addEventListener(type, fn) { const list = this.listeners.get(type) || []; list.push(fn); this.listeners.set(type, list); }
  async emit(type, extra = {}) {
    const event = { type, target: this, currentTarget: this, bubbles: true, defaultPrevented: false, stopped: false,
      preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; }, ...extra };
    for (let node = this; node; node = node.parentNode) {
      event.currentTarget = node;
      for (const fn of node.listeners.get(type) || []) await fn(event);
      if (!event.bubbles || event.stopped) break;
    }
    return event;
  }
  async click() {
    if (this.disabled) return;
    for (let node = this; node; node = node.parentNode) if (node.hidden) return;
    this.focus();
    const event = await this.emit('click');
    if (this.tagName === 'BUTTON' && (this.type || 'submit') === 'submit' && !event.defaultPrevented) {
      for (let node = this.parentNode; node; node = node.parentNode) if (node.tagName === 'FORM') { await node.emit('submit'); break; }
    }
    return event;
  }
  focus() { this.document.activeElement = this; }
  setSelectionRange(start, end) { this.selectionStart = Math.max(0, Math.min(start, this.value.length)); this.selectionEnd = Math.max(this.selectionStart, Math.min(end, this.value.length)); }
  select() { this.selected = true; this.setSelectionRange(0, this.value.length); }
  querySelectorAll(selector) {
    const matches = node => selector.split(',').some(raw => {
      const part = raw.trim();
      if (part.startsWith('#')) return node.id === part.slice(1);
      if (part.startsWith('[') && part.endsWith(']')) return node.getAttribute(part.slice(1, -1)) !== null;
      return node.tagName.toLowerCase() === part;
    });
    const result = [];
    for (const child of this.children) if (typeof child !== 'string') {
      if (matches(child)) result.push(child);
      result.push(...child.querySelectorAll(selector));
    }
    return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

function documentFixture() {
  const document = { activeElement: null, listeners: new Map(), lookups: [] };
  document.body = new Element('body', document);
  document.body.parentNode = document;
  document.addEventListener = Element.prototype.addEventListener;
  document.getElementById = id => { document.lookups.push(id); return document.body.querySelector('#' + id); };
  const html = fs.readFileSync(path.join(__dirname, '../src/geometry-sprint.html'), 'utf8');
  const stack = [document.body], voids = new Set(['meta', 'link', 'input', 'br', 'hr']);
  for (const token of html.match(/<[^>]+>|[^<]+/g)) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) {
      const tag = token.match(/^<\/([^\s>]+)/)?.[1];
      const i = stack.findLastIndex(node => node.tagName.toLowerCase() === tag);
      if (i > 0) stack.length = i;
    } else if (token.startsWith('<')) {
      const tag = token.match(/^<([^\s/>]+)/)?.[1]; if (!tag) continue;
      const node = new Element(tag, document);
      for (const [, key, value] of token.matchAll(/([\w:-]+)="([^"]*)"/g)) node.setAttribute(key, value);
      for (const name of ['hidden', 'disabled', 'readonly']) if (new RegExp('\\s' + name + '(?:\\s|>)').test(token)) node.setAttribute(name, '');
      stack.at(-1).append(node);
      if (!voids.has(tag) && !token.endsWith('/>')) stack.push(node);
    } else stack.at(-1).append(token);
  }
  return document;
}

function harness({ clipboardMode = 'success' } = {}) {
  const document = documentFixture(), forbiddenAccess = [], clipboard = [], globalListeners = new Map();
  const lessonEvents = [], lessonFields = [], lessonForms = [];
  for (const [containerId, formId] of [['diagnostic-questions', 'diagnostic-form'], ['guided-practice', null], ['mock-questions', null]]) {
    const container = document.getElementById(containerId);
    assert.ok(container, 'existing lesson container: ' + containerId);
    const form = formId ? document.getElementById(formId) : new Element('form', document);
    if (!formId) container.append(form);
    lessonForms.push(form);
    form.addEventListener('submit', () => lessonEvents.push(containerId + ':submit'));
    for (const tag of ['input', 'textarea']) {
      const node = new Element(tag, document);
      node.value = containerId + (tag === 'input' ? ': saved answer 1620' : ': original method and unfinished draft');
      node.setAttribute('data-existing-lesson-field', tag);
      node.addEventListener('input', () => lessonEvents.push(containerId + ':input'));
      node.addEventListener('change', () => lessonEvents.push(containerId + ':change'));
      (formId ? container : form).append(node);
      lessonFields.push(node);
    }
  }
  const savedLessonFields = lessonFields.map(node => ({ value: node.value, readOnly: node.readOnly, disabled: node.disabled, attributes: { ...node.attributes } }));
  const context = {
    document,
    navigator: clipboardMode === 'missing' ? {} : { clipboard: { async writeText(value) {
      if (clipboardMode === 'denied') throw Error('Clipboard permission denied');
      clipboard.push(value);
    } } },
    addEventListener(type, fn) { const list = globalListeners.get(type) || []; list.push(fn); globalListeners.set(type, list); }
  };
  context.window = context;
  for (const name of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch', 'XMLHttpRequest', 'WebSocket', 'BackupStore', 'StudySync', 'GeometrySprintEngine', 'GeometrySprintContent', 'GeometrySprintTargets', 'GeometryReportAdapter', 'GeometryReportModel', 'setInterval', 'clearInterval']) {
    Object.defineProperty(context, name, { get() { forbiddenAccess.push(name); throw Error('Unexpected calculator access: ' + name); } });
  }
  document.lookups = [];
  vm.createContext(context);
  for (const name of ['geometry-calculator-engine.js', 'geometry-calculator.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/' + name), 'utf8'), context, { filename: name });
  }
  const h = {
    document, clipboard, forbiddenAccess, globalListeners, lessonFields, lessonForms, lessonEvents,
    id: name => document.getElementById('geometry-calc-' + name),
    async press(...values) {
      for (const value of values) {
        const key = h.id('panel').querySelectorAll('[data-calc-key]').find(node => node.getAttribute('data-calc-key') === value);
        assert.ok(key, 'actual calculator button: ' + value);
        await key.click();
      }
    },
    async open() { if (h.id('panel').hidden) await h.id('toggle').click(); },
    async input(value) { h.id('expression').value = value; await h.id('expression').emit('input'); },
    async select(start, end = start) { h.id('expression').setSelectionRange(start, end); await h.id('expression').emit('select'); },
    assertLessonUnchanged() {
      assert.deepEqual(lessonFields.map(node => ({ value: node.value, readOnly: node.readOnly, disabled: node.disabled, attributes: { ...node.attributes } })), savedLessonFields);
      assert.deepEqual(lessonEvents, []);
      assert.deepEqual(forbiddenAccess, []);
      assert.ok(document.lookups.every(id => id.startsWith('geometry-calc-')), 'calculator only looks up its own DOM controls');
    }
  };
  return h;
}

test('Simulated DOM: actual arithmetic, root, trig and decimal-comma buttons calculate', async () => {
  const h = harness(); await h.open();
  await h.press('7', '×', '8', 'equals');
  assert.equal(h.id('result').value, '56');
  await h.press('clear', 'sqrt(', '9', '+', '1', '6', ')', 'equals');
  assert.equal(h.id('result').value, '5');
  await h.press('clear', 'sin(', '3', '0', ')', 'equals');
  assert.equal(h.id('result').value, '0,5');
  await h.press('clear', '1', ',', '5', '+', '2', ',', '2', '5', 'equals');
  assert.equal(h.id('result').value, '3,75');
  await h.press('clear', 'acos(', '0', ',', '5', ')', 'equals');
  assert.equal(h.id('result').value, '60');
  h.assertLessonUnchanged();
});

test('Simulated DOM: calculation errors are visible, recoverable, and do not submit lesson work', async () => {
  const h = harness(); await h.open();
  await h.press('1', '÷', '0', 'equals');
  assert.equal(h.id('result').value, '');
  assert.match(h.id('note').textContent, /Nulliga ei saa jagada/);
  assert.equal(h.id('ans').disabled, true);
  assert.equal(h.id('expression').value, '1÷0');
  await h.press('back', '2', 'equals');
  assert.equal(h.id('result').value, '0,5');
  await h.input('sqrt(-1)'); await h.press('equals');
  assert.equal(h.id('result').value, '');
  assert.match(h.id('note').textContent, /reaalarv|määratud/);
  await h.input('2+'); await h.press('equals');
  assert.match(h.id('note').textContent, /Kontrolli avaldist/);
  h.assertLessonUnchanged();
});

test('Simulated DOM: cursor insertion, selection replacement, backspace and clear edit scratch input', async () => {
  const h = harness(); await h.open();
  await h.input('12+34'); await h.select(2); await h.press('0');
  assert.equal(h.id('expression').value, '120+34');
  assert.equal(h.id('expression').selectionStart, 3);
  await h.press('back');
  assert.equal(h.id('expression').value, '12+34');
  await h.select(3, 5); await h.press('7');
  assert.equal(h.id('expression').value, '12+7');
  await h.select(0, 3); await h.press('back');
  assert.equal(h.id('expression').value, '7');
  await h.select(0); await h.press('back');
  assert.equal(h.id('expression').value, '7', 'backspace at start preserves the expression');
  await h.press('equals'); assert.equal(h.id('ans').disabled, false);
  await h.press('clear');
  for (const name of ['expression', 'result']) assert.equal(h.id(name).value, '');
  assert.equal(h.id('note').textContent, '');
  assert.equal(h.id('ans').disabled, true);
  await h.press('answer'); assert.equal(h.id('expression').value, '');
  h.assertLessonUnchanged();
});

test('Simulated DOM: closing and reopening retains scratch work and returns focus to the toggle', async () => {
  const h = harness();
  assert.equal(h.id('toggle').hidden, false);
  assert.equal(h.id('panel').hidden, true);
  assert.equal(h.id('toggle').getAttribute('aria-expanded'), 'false');
  await h.open();
  assert.equal(h.id('toggle').getAttribute('aria-expanded'), 'true');
  assert.equal(h.document.activeElement, h.id('close'));
  await h.input('sqrt(9+16)'); await h.press('equals');
  await h.id('close').click();
  assert.equal(h.id('panel').hidden, true);
  assert.equal(h.document.activeElement, h.id('toggle'));
  await h.open();
  assert.equal(h.id('expression').value, 'sqrt(9+16)');
  assert.equal(h.id('result').value, '5');
  const event = await h.id('expression').emit('keydown', { key: 'Escape' });
  assert.equal(event.defaultPrevented, true);
  assert.equal(h.id('panel').hidden, true);
  assert.equal(h.id('toggle').getAttribute('aria-expanded'), 'false');
  h.assertLessonUnchanged();
});

test('Simulated DOM: chaining and Ans reuse full precision rather than the rounded display', async () => {
  const h = harness(); await h.open();
  await h.press('1', '÷', '3', 'equals');
  assert.equal(h.id('result').value, '0,333333333333');
  await h.press('×', '3', 'equals');
  assert.equal(h.id('expression').value, '(0.3333333333333333)×3');
  assert.equal(h.id('result').value, '1');
  await h.press('clear', '1', '÷', '3', 'equals', 'answer');
  assert.equal(h.id('expression').value, '(0.3333333333333333)', 'Ans after equals starts a fresh expression');
  await h.press('×', '3', 'equals');
  assert.equal(h.id('result').value, '1');
  await h.input('2+'); await h.press('answer', 'equals');
  assert.equal(h.id('expression').value, '2+(1)');
  assert.equal(h.id('result').value, '3');
  await h.press('7');
  assert.equal(h.id('expression').value, '7', 'a digit after equals starts a new calculation');
  assert.equal(h.id('result').value, '');
  h.assertLessonUnchanged();
});

test('Simulated DOM: Enter calculates only in its field and no global keyboard handler traps lesson typing', async () => {
  const h = harness(); await h.open(); await h.input('7*8');
  const enter = await h.id('expression').emit('keydown', { key: 'Enter' });
  assert.equal(enter.defaultPrevented, true);
  assert.equal(h.id('result').value, '56');
  await h.input('sqrt(9+16)');
  const submit = await h.id('form').emit('submit');
  assert.equal(submit.defaultPrevented, true);
  assert.equal(h.id('result').value, '5');
  await h.input('12/4');
  const equals = await h.id('expression').emit('keydown', { key: '=' });
  assert.equal(equals.defaultPrevented, true);
  assert.equal(h.id('result').value, '3');
  for (const key of ['Tab', 'ArrowLeft', 'Home', 'a']) {
    const event = await h.id('expression').emit('keydown', { key });
    assert.equal(event.defaultPrevented, false, key + ' keeps normal editing/navigation behavior');
  }
  for (const key of ['Enter', 'Escape', '7', '+']) {
    const event = await h.lessonFields[0].emit('keydown', { key });
    assert.equal(event.defaultPrevented, false, key + ' outside calculator remains untouched');
  }
  assert.equal(h.id('panel').hidden, false, 'Escape in a lesson does not close the calculator');
  for (const type of ['keydown', 'keypress', 'keyup']) {
    assert.equal(h.document.listeners.has(type), false);
    assert.equal(h.document.body.listeners.has(type), false);
    assert.equal(h.globalListeners.has(type), false);
  }
  h.assertLessonUnchanged();
});

test('Simulated DOM: oversized keypad insertion preserves the complete expression and remains editable', async () => {
  const h = harness(); await h.open();
  const expression = '1+'.repeat(255) + '1';
  await h.input(expression);
  await h.press('pi');
  assert.equal(h.id('expression').value, expression, 'multi-character insert is rejected without truncating existing input');
  assert.match(h.id('note').textContent, /liiga pikk/);
  await h.press('2');
  assert.equal(h.id('expression').value, expression + '2');
  assert.equal(h.id('note').textContent, '');
  await h.press('3');
  assert.equal(h.id('expression').value, expression + '2');
  assert.match(h.id('note').textContent, /liiga pikk/);
  await h.press('back', 'equals');
  assert.equal(h.id('expression').value, expression);
  assert.equal(h.id('result').value, '256');
  h.assertLessonUnchanged();
});

test('Simulated DOM: all calculator keys are non-submitting buttons in a separate form', () => {
  const h = harness(), panel = h.id('panel'), form = h.id('form');
  const buttons = [h.id('toggle'), ...panel.querySelectorAll('button')];
  assert.ok(buttons.length >= 30);
  for (const button of buttons) assert.equal(button.getAttribute('type'), 'button', button.textContent.trim());
  for (let node = form.parentNode; node; node = node.parentNode) assert.notEqual(node.tagName, 'FORM', 'calculator is not nested in a lesson form');
  assert.equal(h.id('result').readOnly, true);
  assert.equal(h.id('note').getAttribute('role'), 'status');
  assert.equal(h.id('toggle').getAttribute('aria-controls'), panel.id);
  h.assertLessonUnchanged();
});

test('Simulated DOM: clipboard copy is explicit and missing or denied clipboard offers selectable result', async () => {
  for (const clipboardMode of ['success', 'denied', 'missing']) {
    const h = harness({ clipboardMode }); await h.open();
    await h.id('copy').click();
    assert.match(h.id('note').textContent, /Arvuta enne/);
    assert.deepEqual(h.clipboard, []);
    await h.press('1', '÷', '3', 'equals');
    assert.deepEqual(h.clipboard, [], 'calculation alone never writes to the clipboard');
    await h.id('copy').click();
    if (clipboardMode === 'success') {
      assert.deepEqual(h.clipboard, ['0,333333333333']);
      assert.match(h.id('note').textContent, /kopeeritud/);
    } else {
      assert.equal(h.document.activeElement, h.id('result'));
      assert.equal(h.id('result').selected, true);
      assert.equal(h.id('result').selectionStart, 0);
      assert.equal(h.id('result').selectionEnd, h.id('result').value.length);
      assert.match(h.id('note').textContent, /valitud.*kopeerimist/);
    }
    h.assertLessonUnchanged();
  }
});
