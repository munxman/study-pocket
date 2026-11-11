const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const Chemistry = require('../src/chemistry-content.js');

const topic = id => Chemistry.topics.find(item => item.id === id);
const answer = (id, index) => {
  const question = topic(id).questions[index];
  return question.options[question.answer];
};

test('chemistry is a separate compatible subject with four preserved topics with complete matched follow-ups', () => {
  assert.equal(Chemistry.key, 'hendrik-chemistry-v1');
  assert.equal(Chemistry.title, 'Keemia · Chemistry');
  assert.equal(Chemistry.version, 1);
  assert.equal(Chemistry.topics.length, 4);
  assert.equal(new Set(Chemistry.topics.map(t => t.id)).size, 4);
  const prompts = new Set();
  for (const t of Chemistry.topics) {
    for (const key of ['id', 'title', 'english', 'why']) assert.ok(t[key].trim());
    assert.ok(t.explanation.length >= 3);
    assert.ok(t.explanation.every(line => line.trim()));
    assert.ok(t.worked.prompt && t.worked.answer && t.worked.steps.length >= 3);
    assert.ok(t.sources.length >= 2);
    assert.ok(t.sources.every(source => source.title && new URL(source.url).protocol === 'https:'));
    assert.ok(t.questions.length >= 6);
    for (const q of t.questions) {
      assert.ok(q.prompt && q.explanation && q.skill);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
      assert.ok(!prompts.has(q.prompt), 'each question must be distinct');
      prompts.add(q.prompt);
    }
  }
  assert.equal(prompts.size, Chemistry.topics.reduce((n,t)=>n+t.questions.length,0));
});

test('browser UMD exposes the same subject contract without CommonJS', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/chemistry-content.js'), 'utf8'), context);
  assert.equal(context.ChemistryContent.key, Chemistry.key);
  assert.equal(context.ChemistryContent.topics.length, 4);
});

test('ion and isotope keys conserve protons and account for charge', () => {
  const counts = (z, a, charge) => `${z} protons, ${a - z} neutrons, ${z - charge} electrons`;
  assert.equal(answer('atomic_structure_ions', 0), counts(11, 23, 1));
  assert.equal(answer('atomic_structure_ions', 1), 'The number of neutrons only');
  assert.equal(Number(answer('atomic_structure_ions', 2)), 12 - 2);
  assert.equal(answer('atomic_structure_ions', 3), `${35 - 17} neutrons and ${17 - (-1)} electrons`);
  assert.equal(answer('atomic_structure_ions', 4), `It has 20 protons and ${20 - 2} electrons.`);
  assert.equal(answer('atomic_structure_ions', 5), '6 protons, 8 neutrons and 6 electrons');
});

test('bonding keys distinguish intramolecular bonding, ionic lattices and net polarity', () => {
  assert.equal(answer('bonding_polarity', 0), 'A polar covalent bond');
  assert.equal(answer('bonding_polarity', 1), 'Electrostatic attraction between oppositely charged ions');
  assert.equal(answer('bonding_polarity', 2), 'They are attracted more strongly towards one bonded atom.');
  assert.equal(answer('bonding_polarity', 3), 'The bond dipoles do not cancel in the bent shape.');
  assert.equal(answer('bonding_polarity', 4), 'Its equal, opposite bond dipoles cancel, so it is nonpolar overall.');
  assert.equal(answer('bonding_polarity', 5), 'An intermolecular hydrogen bond');
});

test('mole and stoichiometry answer values follow mass conservation and coefficients', () => {
  const expected = [9 / 180, 0.30 * 2, 36 / 18, 0.020 * 6, 0.40 * 2, (4.8 / 24) / 2 * 32];
  expected.forEach((value, index) => {
    const actual = Number.parseFloat(answer('moles_stoichiometry', index));
    assert.ok(Math.abs(actual - value) < 1e-12, `question ${index}: ${actual} vs ${value}`);
  });
  assert.match(topic('moles_stoichiometry').questions[1].prompt, /excess H₂/);
  assert.match(topic('moles_stoichiometry').questions[3].prompt, /sufficient oxygen/);
  assert.match(topic('moles_stoichiometry').questions[5].prompt, /M\(Mg\) = 24 g\/mol and M\(O₂\) = 32 g\/mol/);
});

test('concentration calculations use final solution volume and conserve solute on dilution', () => {
  const expected = [0.15 / 0.50, 0.20 * (250 / 1000), 0.10 / 1, 0.80 * 25 / 100, 0.15 * 200 / 0.60];
  expected.forEach((value, index) => {
    const actual = Number.parseFloat(answer('concentration_dilution', index));
    assert.ok(Math.abs(actual - value) < 1e-12, `question ${index}: ${actual} vs ${value}`);
  });
  const final = answer('concentration_dilution', 5).match(/([\d.]+) mol\/L and ([\d.]+) mol/);
  assert.ok(final);
  const conservedAmount = 0.40 * (75 / 1000);
  assert.ok(Math.abs(Number(final[2]) - conservedAmount) < 1e-12);
  assert.ok(Math.abs(Number(final[1]) - conservedAmount / (300 / 1000)) < 1e-12);
  for (const index of [3, 5]) assert.match(topic('concentration_dilution').questions[index].prompt, /final volume/);
});

test('starter keeps biological boundary conditions explicit', () => {
  const atoms = topic('atomic_structure_ions').explanation.join(' ');
  const moles = topic('moles_stoichiometry').explanation.join(' ');
  const dilution = topic('concentration_dilution').explanation.join(' ');
  assert.match(atoms, /kontsentratsiooni- kui ka elektriline/);
  assert.match(moles, /ei ütle.*ATP/);
  assert.match(dilution, /ei reageeri ega lähe kaduma/);
  assert.match(dilution, /membraani läbitavus/);
  assert.match(dilution, /ei tähenda automaatselt sama osmootset mõju/);
});
