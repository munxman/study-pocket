const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const Chemistry = require('../src/chemistry-content.js');

const initialIndices = [0, 1, 4, 5];
const topic = id => Chemistry.topics.find(item => item.id === id);
const selected = (id, index) => {
  const question = topic(id).questions[index];
  return question.options[question.answer];
};
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const originals = {
  atomic_structure_ions: ['dcb461d32fb86c0295b57cbea4294ae296c418aede53964aa49edb7a5bf9d87a', '6b4ec30d3de3c17ae46d25016f5461afed4a3d77ab5c207b19de82d03ba6091e'],
  bonding_polarity: ['9c4766f9b739ad841cc341e3fca71dd8e97af3e15c86b2e9e5a7d6be5accbaf2', '414c2d5628b8a095ae2b88211dedb5b51fa542df2098f2c5db1be627ec8c14ce'],
  moles_stoichiometry: ['16238d32ace89f8c27e82925a288c3b6d9b286fe29a03545305c478f90d5703f', '6fcbd8cb879a27529bcebcb1c9e85e5c26a0266b58d007a4f8012db87ca6464d'],
  concentration_dilution: ['a9a4b7b69d9f7771525321625a76f5dbf8ab6b15ad921a24508069a48238fca3', '26d40fd30c711bb14a88dd67aac067c77226c8d79e9997aab50c09bb3c1422c3']
};

test('existing chemistry question identities, options, keys and broad lessons are unchanged', () => {
  assert.equal(Chemistry.version, 1);
  assert.equal(Chemistry.key, 'hendrik-chemistry-v1');
  for (const t of Chemistry.topics) {
    assert.equal(hash(t.questions.slice(0, 6)), originals[t.id][0], `${t.id}: original questions`);
    const {title, english, why, explanation, worked, sources} = t;
    assert.equal(hash({title, english, why, explanation, worked, sources}), originals[t.id][1], `${t.id}: lesson`);
  }
});

test('each distinct original chemistry skill has a supported pair without repurposing first questions', () => {
  let routeCount = 0;
  let questionCount = 0;
  const reused = [];
  const prompts = new Set();
  for (const t of Chemistry.topics) {
    assert.equal(t.followupVersion, 1);
    const routes = Object.entries(t.followups);
    assert.equal(routes.length, new Set(t.questions.slice(0, 6).map(q => q.skill)).size);
    assert.equal(new Set(routes.map(([, route]) => route.skill)).size, routes.length);
    for (const index of initialIndices) assert.ok(t.followups[index], `${t.id}: first ${index}`);
    for (const original of t.questions.slice(0, 6)) {
      assert.ok(routes.some(([, route]) => route.skill === original.skill), `${t.id}: legacy ${original.skill}`);
    }
    for (const [key, route] of routes) {
      assert.ok(Number(key) >= 0 && Number(key) < 6);
      assert.equal(route.skill, t.questions[Number(key)].skill);
      assert.ok(route.title.trim());
      assert.ok(route.explanation.length && route.explanation.every(line => line.trim()));
      assert.ok(route.worked.prompt.trim() && route.worked.answer.trim());
      assert.ok(route.worked.steps.length >= 2 && route.worked.steps.every(line => line.trim()));
      assert.notEqual(route.simpleIndex, route.applicationIndex);
      for (const index of [route.simpleIndex, route.applicationIndex]) {
        assert.ok(Number.isInteger(index) && index >= 0 && index < t.questions.length);
        assert.ok(!initialIndices.includes(index), 'follow-up must not consume a first-stage question');
        assert.notEqual(index, Number(key), 'legacy miss must not repeat itself');
        assert.equal(t.questions[index].skill, route.skill, `${t.id}/${key}: exact skill`);
        assert.notEqual(route.worked.prompt, t.questions[index].prompt);
        if (index < 6) reused.push(`${t.id}:${index}`);
      }
      routeCount++;
    }
    for (const q of t.questions) {
      assert.ok(q.prompt && q.explanation && q.skill);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
      assert.ok(!prompts.has(q.prompt), `duplicate prompt: ${q.prompt}`);
      prompts.add(q.prompt);
      questionCount++;
    }
  }
  assert.equal(routeCount, 22);
  assert.equal(questionCount, 66);
  assert.deepEqual(reused.sort(), ['concentration_dilution:2', 'moles_stoichiometry:2']);
});

test('new ion, neutron and isotope keys follow independent particle accounting', () => {
  const id = 'atomic_structure_ions';
  const counts = (z, a, charge) => `${z} protons, ${a - z} neutrons, ${z - charge} electron${z - charge === 1 ? '' : 's'}`;
  for (const [index, z, a, charge] of [[6, 2, 4, 1], [7, 13, 27, 3], [12, 7, 15, 0], [13, 8, 18, 0]]) {
    assert.equal(selected(id, index), counts(z, a, charge));
  }
  assert.equal(selected(id, 8), 'The number of neutrons only');
  assert.equal(selected(id, 9), 'They are isotopes of the same element with different neutron counts.');
  assert.equal(Number(selected(id, 10)), 19 - 1);
  assert.equal(Number(selected(id, 11).replace('−', '-')), 17 - 18);
  assert.equal(Number(selected(id, 14)), 20 - 2);
  assert.equal(Number(selected(id, 15)), 13 - 3);
  assert.equal(selected(id, 16), `${19 - 9} neutrons and ${9 + 1} electrons`);
  assert.equal(selected(id, 17), `${34 - 16} neutrons and ${16 + 2} electrons`);
});

test('new bonding keys distinguish shared electrons, ionic attraction and intermolecular forces', () => {
  const id = 'bonding_polarity';
  const expected = {
    6: 'A polar covalent bond within the molecule',
    7: 'It is a polar covalent bond inside the molecule.',
    8: 'Electrostatic attraction between opposite charges',
    9: 'Electrostatic attraction between oppositely charged ions',
    10: 'They cancel, so the molecule is nonpolar overall.',
    11: 'It is nonpolar because the equal opposite bond dipoles cancel.',
    12: 'The hydrogen bond between the two molecules',
    13: 'Intermolecular attractions, including hydrogen bonds',
    14: 'Towards atom A',
    15: 'The shared electrons are drawn towards oxygen, giving it a partial negative charge.',
    16: 'The bond dipoles do not cancel in the bent shape.',
    17: 'Its bent shape prevents the bond dipoles from cancelling.'
  };
  for (const [index, answer] of Object.entries(expected)) assert.equal(selected(id, Number(index)), answer);
  assert.match(topic(id).questions[11].prompt, /isolated gaseous.*linear/);
  assert.match(topic(id).questions[13].prompt, /without a chemical reaction/);
  assert.match(topic(id).questions[17].prompt, /bent.*equally polar/);
});

test('new stoichiometry keys use coefficients for moles and molar masses for grams', () => {
  const id = 'moles_stoichiometry';
  const expected = new Map([
    [6, 12 / 60], [7, 1 * 2 / 1], [8, 0.60 * 2 / 3],
    [9, 0.50 * 4], [10, 0.30 * 3], [11, (4 / 2) * (1 / 2) * 32],
    [12, (5.4 / 27) * (3 / 2) * 71], [13, 1 * 6], [14, 0.040 * 6]
  ]);
  for (const [index, value] of expected) assert.ok(Math.abs(Number.parseFloat(selected(id, index)) - value) < 1e-12, `question ${index}`);
  for (const index of [7, 8]) assert.match(topic(id).questions[index].prompt, /reacts completely with excess/);
  for (const index of [13, 14]) assert.match(topic(id).questions[index].prompt, /completely oxidised with sufficient oxygen/);
});

test('new concentration keys independently convert mL/L and conserve amount at final volume', () => {
  const id = 'concentration_dilution';
  const expected = new Map([
    [6, 0.18 / 0.30], [7, 0.10 * (500 / 1000)], [8, 0.75 * (40 / 1000)],
    [9, 0.50 * 100 / 1.0], [10, (0.12 * 0.250 / 1.5) * 1000],
    [13, 0.40 * 100 / 200], [14, 1.5 * (20 / 1000) / 0.250]
  ]);
  for (const [index, value] of expected) assert.ok(Math.abs(Number.parseFloat(selected(id, index)) - value) < 1e-12, `question ${index}`);
  for (const [index, concentration, startMl, finalL] of [[11, 0.20, 100, 0.200], [12, 0.60, 40, 0.300]]) {
    const pair = selected(id, index).match(/^([\d.]+) mol\/L and ([\d.]+) mol$/);
    assert.ok(pair);
    const conservedAmount = concentration * (startMl / 1000);
    assert.ok(Math.abs(Number(pair[2]) - conservedAmount) < 1e-12);
    assert.ok(Math.abs(Number(pair[1]) - conservedAmount / finalL) < 1e-12);
  }
  for (const index of [9, 10, 11, 12, 13, 14]) {
    assert.match(topic(id).questions[index].prompt, /final volume/);
    assert.match(topic(id).questions[index].prompt, /No (glucose|solute) is lost or reacts/);
  }
});
