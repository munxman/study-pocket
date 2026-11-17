const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const B = require('../src/imat-english.js')(require('../src/imat-content.js'));
const E = require('../src/imat-engine.js');
const NOW = Date.UTC(2026, 10, 17, 12);

function legacyState({failed = true} = {}) {
  const state = E.fresh(), a = E.start(state, B, NOW - 1000, 'enzyme');
  // A synthetic older teaching-first session must retain its original route
  // even if this concept's current new-session flow changes later.
  delete a.targetedPractice; delete a.questionIndex; delete a.retryIndex;
  a.stage = 'question'; a.assisted = true;
  a.selected = (E.question(B, a).answer + 1) % 5; a.confidence = 'sure';
  E.submit(state, B, NOW - 900); E.classify(state, 'Lugesin valesti');
  E.beginRetry(state);
  if (failed) {
    a.retrySelected = (E.retryQuestion(B, a).answer + 1) % 5;
    E.retry(state, B, NOW - 800); E.classifyRetry(state, 'Ei teadnud');
  }
  return state;
}

function screen({initial = legacyState(), search = '', rows, engine = E} = {}) {
  const data = new Map(rows || [[E.KEY, JSON.stringify(initial)]]), events = {};
  const main = {innerHTML: '', querySelector: () => null, querySelectorAll: () => []};
  let url = new URL('https://example.test/imat.html' + search + '#learn');
  const location = {
    get search() { return url.search; }, get href() { return url.href; },
    get hash() { return url.hash; }, set hash(value) { url.hash = value; for (const fn of events.hashchange || []) fn(); }
  };
  class Clock extends Date { static now() { return NOW; } }
  const context = {
    IMAT_CONTENT: B, ImatEngine: engine, URL, URLSearchParams, location, Date: Clock,
    document: {activeElement: null, getElementById: () => main,
      addEventListener(name, fn) { (events[name] ||= []).push(fn); }},
    localStorage: {getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value)},
    history: {replaceState(_state, _title, path) { url = new URL(path, url); }},
    addEventListener(name, fn) { (events[name] ||= []).push(fn); }, scrollTo() {}
  };
  context.window = context; vm.createContext(context);
  for (const file of ['guided-session-model.js', 'guided-session.js', 'imat.js']) {
    vm.runInContext(fs.readFileSync(require.resolve('../src/' + file), 'utf8'), context);
  }
  function fire(action, value) {
    const el = {dataset: {coach: action, value}, disabled: false};
    for (const fn of events.click || []) fn({target: {closest: selector => selector === '[data-coach]' ? el : null}});
  }
  return {
    main, data, get url() { return url; }, read: () => JSON.parse(data.get(E.KEY)), fire,
    click(action, value) {
      assert.ok(main.innerHTML.includes('data-coach="' + action + '"'), 'visible control: ' + action);
      fire(action, value);
    }
  };
}

test('a submitted wrong legacy check offers another concept without automatically starting or crediting one', () => {
  const h = screen({initial: legacyState({failed: false})});
  assert.doesNotMatch(h.main.innerHTML, /data-coach="continue-after-check"/);
  let a = E.active(h.read());
  h.click('retry-select', String((E.retryQuestion(B, a).answer + 1) % 5));
  h.click('retry-submit'); h.click('retry-error', '0');
  const before = h.read(), failed = E.active(before), card = before.cards[failed.concept];
  assert.equal(before.sessions.length, 1);
  assert.equal(failed.stage, 'retry'); assert.equal(failed.completedAt, 0);
  assert.match(h.main.innerHTML, /data-coach="continue-after-check"/);
  assert.match(h.main.innerHTML, /data-coach="retry-again"/);
  assert.match(h.main.innerHTML, /data-coach="pause"/);
  h.click('continue-after-check');
  const after = h.read(), next = E.active(after), saved = after.sessions.find(x => x.id === failed.id);
  assert.notEqual(next.id, failed.id); assert.notEqual(next.concept, failed.concept);
  assert.equal(after.sessions.length, 2); assert.equal(next.answeredAt, 0);
  assert.deepEqual(saved, {...failed, closed: true});
  assert.deepEqual(after.cards[failed.concept], card, 'failure scheduling is not cleared');
  const progress = E.progress(after, B);
  assert.equal(progress.completions, 0); assert.equal(progress.more, 0);
  assert.equal(progress.remembered, 0); assert.equal(progress.corrected, 0);
  const reloaded = screen({rows: h.data});
  assert.equal(E.active(reloaded.read()).id, next.id);
  assert.equal(reloaded.read().sessions.length, 2);
  assert.deepEqual(reloaded.read().sessions.find(x => x.id === failed.id), saved);
});

test('retrying the same legacy check remains available and preserves prior wrong answers and errors', () => {
  const h = screen(), before = E.active(h.read());
  h.click('retry-again');
  const retry = E.active(h.read());
  assert.equal(retry.id, before.id); assert.equal(h.read().sessions.length, 1);
  assert.equal(retry.retrySelected, null); assert.equal(retry.retrySubmitted, false);
  assert.deepEqual(retry.retryAnswers, before.retryAnswers);
  assert.deepEqual(retry.retryErrors, before.retryErrors);
  assert.equal(retry.answeredAt, before.answeredAt); assert.equal(retry.completedAt, 0);
  assert.doesNotMatch(h.main.innerHTML, /data-coach="continue-after-check"/);
  h.fire('continue-after-check');
  assert.deepEqual(E.active(h.read()), retry, 'a queued old action cannot bypass an unsubmitted retry');
});

test('continuing away from a failed legacy check leaves the guided plan without fabricating completion', () => {
  const h = screen({search: '?guided=8'}), failed = E.active(h.read());
  assert.match(h.main.innerHTML, /1\. plokk kolmest/);
  h.click('continue-after-check');
  assert.equal(h.url.searchParams.has('guided'), false);
  assert.doesNotMatch(h.main.innerHTML, /1\. plokk kolmest/);
  const after = h.read();
  assert.notEqual(E.active(after).concept, failed.concept);
  assert.deepEqual(after.sessions.find(a => a.id === failed.id), {...failed, closed: true});
  assert.equal(E.progress(after, B).completions, 0);
  assert.equal(E.progress(after, B).more, 0);
});

test('a learner can choose another concept even when no ordinary review is due', () => {
  const h = screen({engine: {...E, recommend: () => null}}), failed = E.active(h.read());
  h.click('continue-after-check');
  const after = h.read();
  assert.notEqual(E.active(after).concept, failed.concept);
  assert.equal(after.sessions.length, 2);
  assert.deepEqual(after.sessions.find(a => a.id === failed.id), {...failed, closed: true});
});
