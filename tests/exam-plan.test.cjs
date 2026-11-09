const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../src/exam-plan-content.js');
const E = require('../src/exam-plan.js');

test('every date has a source, applicable year and check date; only confirmed dates have a precise day', () => {
  for (const d of C.dates) {
    assert.ok(d.year && C.sources[d.sourceId]);
    assert.match(C.sources[d.sourceId].checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(C.sources[d.sourceId].url, /^https:\/\//);
    if (d.status !== 'confirmed') {
      assert.equal(d.date, null, d.id);
      assert.doesNotMatch(E.renderDate(C, d), /<time|datetime=|countdown/i);
    }
    assert.match(E.renderDate(C, d), /kontrollitud 09\.11\.2026/);
  }
  assert.equal(C.dates.find(d => d.id === 'estonian-exam').date, '2027-04-12');
  assert.equal(C.dates.find(d => d.id === 'maths-exam').date, '2027-05-19');
  assert.equal(C.dates.find(d => d.id === 'school-certificate').date, '2027-01-20');
  assert.equal(C.dates.find(d => d.id === 'harno-certificate').date, '2027-02-01');
});

test('Tartu gates belong to the correct combined result, and rules retain their 2026 provenance', () => {
  assert.equal(C.tartu.applicableYear, 2026);
  assert.equal(C.tartu.status, 'previous-year');
  assert.deepEqual(C.tartu.components.map(c => c.weight), [30, 20, 30, 20]);
  assert.deepEqual(C.tartu.components.filter(c => c.minimum !== null).map(c => c.id), ['academic', 'science', 'interview']);
  assert.equal(C.tartu.components.find(c => c.id === 'science').parts.reduce((n, p) => n + p.maximum, 0), 100);
  assert.equal(C.tartu.components.find(c => c.id === 'science').minimum, 51);
  assert.ok(C.tartu.components.find(c => c.id === 'science').parts.every(p => !('minimum' in p)));
  assert.equal(C.tartu.eligibilityMinimum, 66);
  assert.match(C.tartu.note, /lubab konkureerida/);
  assert.match(C.tartu.note, /paremusjärjestus/);
});

test('whole-exam coverage is not inferred from short modules or a biology simulation', () => {
  assert.equal(C.italy.applicableYear, 2026);
  assert.equal(C.italy.sections.reduce((n, s) => n + s.questions, 0), 60);
  assert.deepEqual(C.coverage.map(c => c.topics), [30, 4, 5, 5]);
  assert.ok(C.coverage.every(c => c.gap));
  const html = E.render(C);
  assert.match(html, /mitte kogu eksamite ainekava/);
  assert.match(html, /Teemade arv ei näita sinu läbimist ega oskust/);
  assert.match(html, /Lühike bioloogiaproov ei näita kogu IMAT-i tulemust/);
});

test('coverage counts follow the actual bundled content, not completion counts', () => {
  const quant = require('../src/quant-content.js').subjects;
  const chemistry = require('../src/chemistry-content.js');
  const biology = require('../src/imat-content.js');
  const actual = {biology: biology.concepts.length, chemistry: chemistry.topics.length, maths: quant.maths.topics.length, physics: quant.physics.topics.length};
  for (const field of C.coverage) assert.equal(field.topics, actual[field.id], field.id);
});

test('source text and hrefs cannot introduce markup or executable links', () => {
  const copy = JSON.parse(JSON.stringify(C));
  copy.dates[0].title = '<img src=x onerror=alert(1)>';
  copy.sources.english.url = 'javascript:alert(1)';
  copy.sources.english.title = '<script>bad()</script>';
  const html = E.render(copy);
  assert.doesNotMatch(html, /<img|<script|href="javascript:/);
  assert.match(html, /&lt;img/);
  assert.equal(E.safeHref('./quant.html?subject=chemistry'), './quant.html?subject=chemistry');
  assert.equal(E.safeHref('https://example.org/" onclick="x'), '#');
});

test('browser rendering needs no learner storage and does not make requests or record progress', () => {
  const target = {innerHTML: ''};
  const context = vm.createContext({ExamPlanContent: C, document: {getElementById: id => id === 'exam-plan' ? target : null}});
  Object.defineProperty(context, 'localStorage', {get() { throw new Error('Plan must not access learner storage'); }});
  context.fetch = () => { throw new Error('Plan must not make a request'); };
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/exam-plan.js'), 'utf8'), context);
  assert.match(target.innerHTML, /Tartu võimalus avatuks/);
  assert.match(target.innerHTML, /<details>/);
  assert.match(target.innerHTML, /Bluebook/);
  assert.doesNotMatch(target.innerHTML, /<form|type="submit"/);
});
