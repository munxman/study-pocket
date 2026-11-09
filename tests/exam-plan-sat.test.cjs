const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../src/exam-plan-content.js');
const E = require('../src/exam-plan.js');

test('SAT route preserves the official 2026 medicine alternative without inventing 2027 eligibility', () => {
  const r = C.sat.tartuRules;
  assert.equal(r.applicableYear, 2026);
  assert.equal(r.weight, C.tartu.components.find(c => c.id === 'academic').weight);
  assert.equal(r.weight, 20);
  assert.equal(r.minimum, 51);
  assert.equal(r.betterResultCounts, true);
  assert.equal(r.attemptsPerYear, 1);
  assert.deepEqual(r.academicDates, ['2026-03-28', '2026-04-11', '2026-07-06']);
  assert.equal(r.intake2027Confirmed, false);
  assert.deepEqual([r.acceptedSatFrom, r.acceptedSatThrough, r.officialScoreDeadline], ['2025-03-28', '2026-06-10', '2026-06-30']);
  const html = E.renderSat(C);
  assert.match(html, /6\. juuli/);
  assert.match(html, /2027\. aasta arvestusaken ja tingimused vajavad kinnitamist/);
  assert.match(html, /paremat tulemust/);
  assert.doesNotMatch(html, /ainult kevadel|juulis ei saa testi teha/);
});

test('selected conversions reproduce UT non-linear table and never convert short app answers', () => {
  assert.deepEqual(C.sat.tartuRules.conversions, [
    {sat: 1030, academic: 51}, {sat: 1330, academic: 70}, {sat: 1400, academic: 75},
    {sat: 1450, academic: 80}, {sat: 1500, academic: 88}, {sat: 1530, academic: 93}
  ]);
  const html = E.renderSat(C);
  assert.match(html, /lühiharjutused ei anna SAT-i skaalapunkte/);
  assert.match(html, /mitte selle äpi lühiharjutuste teisendus/);
  assert.doesNotMatch(html, /<input|<form|countdown/);
});

test('confirmed College Board dates remain optional and do not promise a June UT result', () => {
  assert.deepEqual(C.sat.possibleDates.map(d => [d.date, d.registration]), [
    ['2026-12-05', '2026-11-20'], ['2027-03-06', '2027-02-19'],
    ['2027-05-01', '2027-04-16'], ['2027-06-05', '2027-05-21']
  ]);
  const html = E.renderSat(C);
  assert.match(html, /mitte broneeringud/);
  assert.match(html, /Juuni tulemuse sobivust TÜ 2027\. aasta vastuvõtuks ei saa praegu lubada/);
  assert.match(html, /USA idaranniku aja järgi/);
  assert.match(html, /ei registreeri ega maksa/);
});

test('route offers a current sample and original skills while reserving unseen Bluebook assessments', () => {
  assert.equal(C.sat.href, './videos.html?exam=SAT');
  assert.equal(C.sources.academicSample.url, 'https://ut.ee/sites/default/files/2023-02/Akadeemilise%20testi%20n%C3%A4idis%C3%BClesanded.pdf');
  assert.deepEqual(C.sat.format, {readingQuestions: 54, readingMinutes: 64, mathQuestions: 44, mathMinutes: 70, breakMinutes: 10, sourceId: 'satFormat'});
  const html = E.renderSat(C);
  assert.match(html, /href="\.\/videos\.html\?exam=SAT"/);
  assert.match(html, /seni tegemata ametlik Bluebooki täistest/);
  assert.match(html, /teine seni nägemata test/);
  assert.match(html, /väljaspool seda äppi/);
  assert.doesNotMatch(html, /Bluebooki.*test nr/);
});

test('SAT content remains safely escaped and shows no unsupported private state', () => {
  const copy = JSON.parse(JSON.stringify(C));
  copy.sat.title = '<script>bad()</script>';
  copy.sat.href = 'javascript:alert(1)';
  copy.sat.steps[0] = '<img src=x onerror=alert(1)>';
  copy.sat.possibleDates[0].label = '<svg onload=alert(1)>';
  copy.sat.tartuRules.conversions[0].sat = '<iframe>';
  const html = E.renderSat(copy);
  assert.doesNotMatch(html, /<script|<img|<svg|<iframe|href="javascript:/);
  assert.match(html, /&lt;script/);
  assert.equal(E.renderSat({}), '');
});
