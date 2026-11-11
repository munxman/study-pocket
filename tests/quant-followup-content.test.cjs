const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const content = require('../src/quant-content.js');
const topics = Object.fromEntries(Object.values(content.subjects).flatMap(b => b.topics).map(t => [t.id, t]));

function item(id, key, stage) {
  const t = topics[id];
  return t.questions[t.followups[key][stage + 'Index']];
}
function numeric(text, unit = '') {
  if (unit && !text.endsWith(unit)) return NaN;
  let s = (unit ? text.slice(0, -unit.length) : text).trim().replace(',', '.');
  const sci = s.match(/^([\d.]+) × 10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)$/);
  if (sci) {
    const superscripts = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
    return Number(sci[1]) * 10 ** Number([...sci[2]].map(c => superscripts[c]).join(''));
  }
  const fraction = s.match(/^(\d+)\/(\d+)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  if (/^\d+⅓$/.test(s)) return Number(s.slice(0, -1)) + 1 / 3;
  return /^\d+(?:\.\d+)?$/.test(s) ? Number(s) : NaN;
}
function near(a, b) { return Number.isFinite(a) && Math.abs(a - b) <= Math.max(Math.abs(b), 1e-40) * 1e-10; }
function oneNumericAnswer(id, key, stage, expected, unit) {
  const q = item(id, key, stage);
  const correct = q.options.flatMap((o, i) => near(numeric(o, unit), expected) ? [i] : []);
  assert.deepEqual(correct, [q.answer], `${id}/${key}/${stage}: exactly one option has the calculated value and correct unit`);
}
function both(id, key, simple, application, unit = '') {
  oneNumericAnswer(id, key, 'simple', simple, unit);
  oneNumericAnswer(id, key, 'application', application, unit);
}

test('all original teaching, sources, questions and keys are preserved', () => {
  const original = structuredClone(content);
  for (const bank of Object.values(original.subjects)) for (const topic of bank.topics) {
    delete topic.followupVersion;
    delete topic.followups;
    topic.questions = topic.questions.slice(0, 6);
  }
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex'),
    '4ea413baeef1ff073f0b09c7b23ac300d83bab018775fefb34f9dc5d947aed89');
});

test('all original distinct skills have complete, exact-skill follow-ups', () => {
  let routeCount = 0, addedCount = 0;
  const reused = [];
  for (const t of Object.values(topics)) {
    assert.equal(t.followupVersion, 1);
    const expectedKeys = [...new Set(t.questions.slice(0, 6).map(q => q.skill))]
      .map(skill => String(t.questions.findIndex(q => q.skill === skill))).sort();
    assert.deepEqual(Object.keys(t.followups).sort(), expectedKeys);
    const used = new Set();
    for (const [key, r] of Object.entries(t.followups)) {
      routeCount++;
      assert.equal(r.skill, t.questions[key].skill);
      assert.ok(r.title && r.explanation.length && r.explanation.every(x => typeof x === 'string' && x.trim()));
      assert.ok(r.worked.prompt && r.worked.steps.length && r.worked.answer);
      assert.notEqual(r.simpleIndex, r.applicationIndex);
      const examples = [t.questions[key], t.questions[r.simpleIndex], t.questions[r.applicationIndex]];
      assert.equal(new Set(examples.map(q => q.options[q.answer])).size, 3,
        'the fresh checks must not repeat the initial or each other’s exact answer');
      for (const index of [r.simpleIndex, r.applicationIndex]) {
        assert.ok(Number.isInteger(index) && index >= 0 && index < t.questions.length);
        assert.notEqual(index, Number(key), 'a first question cannot follow itself');
        assert.equal(t.questions[index].skill, r.skill);
        assert.notEqual(t.questions[index].prompt, r.worked.prompt);
        used.add(index);
        if (index < 6) reused.push(`${t.id}:${key}->${index}`);
      }
    }
    for (let index = 6; index < t.questions.length; index++) {
      addedCount++;
      assert.ok(used.has(index), 'every new item is required by a route');
      const q = t.questions[index];
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
      assert.ok(q.explanation && q.skill);
      assert.equal(t.questions.filter(other => other.prompt === q.prompt).length, 1);
    }
  }
  assert.equal(routeCount, 56);
  assert.equal(addedCount, 108);
  assert.deepEqual(reused.sort(), ['electricity:0->2', 'fractions_percentages:0->2', 'fractions_percentages:0->3', 'pressure:0->2']);
});

test('fraction, percentage and denominator keys agree with independent arithmetic', () => {
  both('fractions_percentages', 0, 9 / 30 * 100, 45 / 60 * 100, '%');
  both('fractions_percentages', 1, .10 * 80, .15 * 240);
  both('fractions_percentages', 4, 30 - 10, 72 - 64, 'protsendipunkti');
  both('fractions_percentages', 5, 5 / 10 * 100, 28 / 80 * 100, '%');
  assert.notEqual(28 / 80, 28 / 200, 'the subgroup denominator changes the result');
});

test('direct, inverse and combined scaling keys use the intended factors', () => {
  both('proportions', 0, 4 / 2 * 3, 20 / 5 * 7, 'eurot');
  both('proportions', 1, 12 / 2, 40 * 12 / 16, 'min');
  both('proportions', 2, 2, 3 / 12);
  both('proportions', 3, 1 / 3, .6 / .2);
  both('proportions', 4, 2 / 2, 3 / .5);
  oneNumericAnswer('proportions', 5, 'simple', 8 / 2, 'min');
  oneNumericAnswer('proportions', 5, 'application', (600 / 20) / (600 / 50), 'korda');
  for (const key of [2, 3, 4]) for (const stage of ['simple', 'application']) {
    assert.match(item('proportions', key, stage).prompt, /(?:püsivad|püsib|ei muutu)/);
  }
});

test('formula substitution and rearrangement keys preserve dimensions', () => {
  both('formulas_units', 0, 6 / 2, 180 / 15, 'm/s');
  both('formulas_units', 2, 12 / 3, 840 / 35, 's');
  both('formulas_units', 3, 4 / 1, 7.2 / .4, 'g/L');
  both('formulas_units', 4, 10 / 2, 1.2 * 10 / .3, 's');
  both('formulas_units', 5, 3 * 2, .8 * 250, 'g');
  const symbolic = [
    ['simple', ['b = a / 2', 'b = 2 / a', 'b = 2 × a', 'b = a − 2'], [a => a / 2, a => 2 / a, a => 2 * a, a => a - 2]],
    ['application', ['m = c / V', 'm = c × V', 'm = V / c', 'm = c + V'], [(c, V) => c / V, (c, V) => c * V, (c, V) => V / c, (c, V) => c + V]]
  ];
  for (const [stage, strings, evaluate] of symbolic) {
    const q = item('formulas_units', 1, stage);
    assert.deepEqual(q.options, strings);
    const valid = evaluate.flatMap((f, i) => [3, 5, 7].every(a => near(stage === 'simple' ? f(a) / 2 : f(a, 4) / 4, a)) ? [i] : []);
    assert.deepEqual(valid, [q.answer], 'substitute several values into the original equation');
  }
});

test('probability keys distinguish conditions, replacement and inheritance', () => {
  both('probability_conditions', 0, 1 / 4, [1,2,3,4,5,6,7,8,9,10].filter(n => n % 3 === 0).length / 10);
  both('probability_conditions', 1, 1 / 4, 12 / 30);
  both('probability_conditions', 2, .5 / 3, (1 / 8) ** 2);
  const offspring = ['B', 'b'].flatMap(a => ['B', 'b'].map(b => a + b));
  both('probability_conditions', 3, 1, offspring.filter(g => g.includes('B')).length / offspring.length);
  both('probability_conditions', 4, 2 / 4 * 1 / 3, 4 / 7 * 3 / 6);
  both('probability_conditions', 5, .5 * .5, 1 / 5 * 1 / 3);
  for (const stage of ['simple', 'application']) {
    assert.match(item('probability_conditions', 4, stage).prompt, /ilma tagasipanekuta/);
    assert.match(item('probability_conditions', 5, stage).prompt, /[Ss]õltumatu/);
  }
});

test('geometry checks retain the whole skill, square units and right-triangle condition', () => {
  for (const [stage, a, b, unit] of [['simple', 3, 2, 'cm'], ['application', 8, 5, 'm']]) {
    const q = item('plane_geometry', 0, stage);
    const answer = `P = ${2 * (a + b)} ${unit}; A = ${a * b} ${unit}²`;
    assert.deepEqual(q.options.flatMap((o, i) => o === answer ? [i] : []), [q.answer]);
  }
  both('plane_geometry', 1, 360 - 90 * 3, 360 - 65 - 105 - 120, '°');
  oneNumericAnswer('plane_geometry', 2, 'simple', 4 * 2, 'cm²');
});

test('remaining geometry applications use the requested unit and correct formulas', () => {
  oneNumericAnswer('plane_geometry', 2, 'application', 9 * 4, 'm²');
  both('plane_geometry', 3, 4 * 2, 12 * 5, 'cm²');
  both('plane_geometry', 4, Math.hypot(3, 4), Math.hypot(5, 12), 'cm');
  both('plane_geometry', 5, 360 / 4, (8 - 2) * 180 / 8, '°');
  assert.match(topics.plane_geometry.followups[4].explanation.join(' '), /täisnurkse/);
  assert.match(topics.plane_geometry.followups[3].explanation.join(' '), /risti/);
});

test('unit conversions use the right powers and do not confuse mass and volume', () => {
  both('units_scale', 0, 10 / 1000, 75 / 1000, 'L');
  both('units_scale', 1, 1000 / 1000, 650 / 1000, 'mm');
  both('units_scale', 2, 1 * 1000, .025 * 1000, 'mA');
  both('units_scale', 3, 1 * 1000, .35 * 1000, 'J');
  both('units_scale', 4, (1000 / 1000) ** 2, 300 / 1000 * (400 / 1000), 'mm²');
  both('units_scale', 5, 1, 12.5, 'mL');
  assert.match(topics.units_scale.followups[5].explanation.join(' '), /Tihedust.*mass/i);
});

test('pressure keys use the intended force, area or hydrostatic relation', () => {
  both('pressure', 0, 90 / .03, 140 / .04, 'Pa');
  oneNumericAnswer('pressure', 1, 'application', .06 / .02, '');
  const simple = item('pressure', 1, 'simple');
  assert.equal(1 / .5, 2);
  assert.equal(simple.options[simple.answer], 'Rõhk kahekordistub.');
  both('pressure', 3, 1000 * 10 * .1, 800 * 10 * .6, 'Pa');
  assert.match(topics.pressure.followups[3].explanation.join(' '), /muutus.*pinnale/s);
  assert.match(item('pressure', 3, 'application').prompt, /Paigalseisva ühtlase/);
});

test('bulk flow and partial-pressure diffusion remain distinct', () => {
  for (const key of [4, 5]) {
    const simple = item('pressure', key, 'simple');
    const application = item('pressure', key, 'application');
    assert.match(simple.options[simple.answer], /Vasakult paremale/);
    assert.match(application.options[application.answer], /B-st A-sse/);
  }
  assert.match(item('pressure', 4, 'application').prompt, /avatud ventiil/);
  assert.match(item('pressure', 5, 'application').prompt, /kogurõhk sama.*osarõhk.*3 kPa.*7 kPa/);
  assert.match(topics.pressure.followups[5].explanation.join(' '), /ei eelda kogu gaasisegu/);
  assert.ok(102 > 100 && 101 > 98 && 6 > 2 && 7 > 3);
});

test('power, work and efficiency use independent arithmetic and energy conservation', () => {
  both('energy_power', 0, 10 / 2, 420 / 12, 'W');
  both('energy_power', 2, 2 * 3, 35 * 2.4, 'J');
  both('energy_power', 3, 12 / 2, 675 / 15, 'W');
  both('energy_power', 4, 50 / 100 * 100, 180 / 600 * 100, '%');
  both('energy_power', 5, 8 / 4, (360 / 12) / (360 / 9));
  assert.equal(180 + 420, 600);
  assert.match(item('energy_power', 4, 'application').prompt, /600 J.*180 J.*420 J/);
  for (const stage of ['simple', 'application']) assert.match(item('energy_power', 2, stage).prompt, /[Mm]uutumatu.*jõu(?:ga samas)? suunas/);
  assert.match(item('energy_power', 3, 'application').explanation, /kasuliku töö.*mitte kogu sisendi/);
  const simple = item('energy_power', 1, 'simple'), application = item('energy_power', 1, 'application');
  assert.equal(simple.options[simple.answer], 'Energia 4 J; võimsus 2 W.');
  assert.match(application.options[application.answer], /7 W.*1 W = 1 J\/s/);
});

test('electrical keys distinguish charge, energy, voltage and resistance', () => {
  both('electricity', 0, 9 / 3, 40 / 8, 'A');
  both('electricity', 1, 5 / 1, 60 / 4, 'V');
  both('electricity', 3, 5 / 5, 12 / 8, 'A');
  oneNumericAnswer('electricity', 4, 'application', 4 / 10);
  const simple = item('electricity', 4, 'simple');
  assert.equal(6 / 3, 2);
  assert.equal(simple.options[simple.answer], 'Kahekordistub.');
  for (const key of [3, 4]) for (const stage of ['simple', 'application']) assert.match(item('electricity', key, stage).prompt, /temperatuur/);
  const ionicSimple = item('electricity', 5, 'simple'), ionicApplication = item('electricity', 5, 'application');
  assert.match(ionicSimple.options[ionicSimple.answer], /Laetud.*suunatud liikumine/);
  assert.match(ionicApplication.options[ionicApplication.answer], /kannavad elektrilaengut/);
});

test('photon conversions, powers and ratios independently agree with SI equations', () => {
  const h = 6.6e-34, c = 3e8;
  both('atomic_photons', 0, 10e-9, 520e-9, 'm');
  both('atomic_photons', 2, h * 1e14, h * 7.5e14, 'J');
  both('atomic_photons', 3, h * c / 1e-6, h * c / 300e-9, 'J');
  both('atomic_photons', 4, 400 / 200, 450 / 750);
  both('atomic_photons', 5, 6.6e-19 / h, 4.62e-19 / h, 'Hz');
  assert.ok(near(2.64e-19 / h, 4e14));
  assert.ok(near(h * 2e14, 1.32e-19));
  assert.ok(near(h * c / 500e-9, 3.96e-19));
  assert.match(topics.atomic_photons.followups[5].worked.answer, /4,0 × 10¹⁴ Hz/);
  assert.match(topics.atomic_photons.followups[2].worked.answer, /1,32 × 10⁻¹⁹ J/);
  assert.match(topics.atomic_photons.followups[3].worked.answer, /3,96 × 10⁻¹⁹ J/);
  for (const stage of ['simple', 'application']) assert.match(item('atomic_photons', 3, stage).prompt, /[Vv]aakumis/);
});

test('orbital follow-ups explain probability rather than fixed classical paths', () => {
  for (const stage of ['simple', 'application']) {
    const q = item('atomic_photons', 1, stage);
    assert.match(q.options[q.answer], /tõenäosus/);
  }
  assert.match(topics.atomic_photons.followups[1].explanation.join(' '), /klassikalist.*diskreetsed/);
  assert.match(topics.atomic_photons.followups[5].explanation.join(' '), /kannab.*energiavahe/);
});
