'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const targets = require('../src/geometry-sprint-targets.js');
const stages = ['practice', 'transfer', 'reserve'];
const q = (skill, stage) => targets.skills[skill][stage];
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);

// Independent geometric calculations check static authored answer keys. These
// helpers are not used in production and do not reproduce a grading engine.
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const area = (points) => Math.abs(points.reduce((sum, p, i) => {
  const next = points[(i + 1) % points.length];
  return sum + p[0] * next[1] - next[0] * p[1];
}, 0)) / 2;
const perimeter = (points) => points.reduce((sum, p, i) => sum + distance(p, points[(i + 1) % points.length]), 0);
const rect = (a, b) => [[0, 0], [a, 0], [a, b], [0, b]];
const rhombus = (d1, d2) => [[-d1 / 2, 0], [0, d2 / 2], [d1 / 2, 0], [0, -d2 / 2]];
const trap = (bottom, top, height) => [[0, 0], [bottom, 0], [top, height], [0, height]];
const para = (a, b, degrees) => {
  const x = b * Math.cos(degrees * Math.PI / 180), y = b * Math.sin(degrees * Math.PI / 180);
  return [[0, 0], [a, 0], [a + x, y], [x, y]];
};
const diagonalPairs = (n) => {
  const pairs = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    if (b !== a + 1 && !(a === 0 && b === n - 1)) pairs.push([a, b]);
  }
  return pairs;
};

test('eight existing diagnostic items map one-to-one; optional foundation does not change the diagnostic', () => {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/geometry-sprint-content.js'), 'utf8'), context);
  const original = context.GeometrySprintContent;
  assert.equal(original.diagnostic.length, 8);
  const mapped = Object.values(targets.skills).filter((skill) => Number.isInteger(skill.diagnosticIndex)).sort((a, b) => a.diagnosticIndex - b.diagnosticIndex);
  assert.deepEqual(mapped.map((s) => s.diagnosticIndex), [0, 1, 2, 3, 4, 5, 6, 7]);
  for (const skill of mapped) assert.equal(skill.topic, original.diagnostic[skill.diagnosticIndex].topic);
  const optional = targets.skills.rectangle_perimeter_area;
  assert.equal(optional.optional, true);
  assert.equal(optional.diagnosticIndex, undefined);
});

test('all stages have unique stable IDs, valid answer/rationale keys, and explicit evidence limits', () => {
  const ids = new Set();
  const prompts = new Set();
  for (const [id, skill] of Object.entries(targets.skills)) {
    assert.equal(skill.id, id);
    assert.ok(skill.rules.length && skill.example.length);
    for (const stage of stages) {
      const item = skill[stage];
      assert.equal(item.skill, id);
      assert.equal(item.stage, stage);
      assert.ok(!ids.has(item.id), `duplicate ID ${item.id}`); ids.add(item.id);
      assert.ok(!prompts.has(item.prompt), `duplicate prompt ${item.id}`); prompts.add(item.prompt);
      if (item.choices) {
        assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.choices.length);
        assert.equal(new Set(item.choices).size, item.choices.length);
      } else assert.ok(Number.isFinite(item.answer));
      assert.ok(item.explanation);
      assert.ok(item.reason.prompt && item.reason.explanation);
      assert.ok(item.reason.choices.length >= 3);
      assert.ok(Number.isInteger(item.reason.answer) && item.reason.answer >= 0 && item.reason.answer < item.reason.choices.length);
      assert.equal(item.evidence, stage === 'practice' ? 'immediate_practice' : stage === 'transfer' ? 'fresh_same_visit' : 'later_reserve');
    }
  }
  assert.equal(ids.size, 27);
  assert.equal(targets.interpretation.reasonAfterSavedAnswer, true);
  assert.equal(targets.interpretation.noMasteryFromImmediateSuccess, true);
  assert.equal(targets.interpretation.reserveIsNotAutomaticallyDelayedRecall, true);
  assert.equal(targets.interpretation.noSchoolGradeConversion, true);
});

test('polygon angle sums use the count of triangles, without requiring regularity', () => {
  for (const [stage, n] of [['practice', 8], ['transfer', 13], ['reserve', 10]]) {
    let triangles = 0;
    // Fan triangles (vertex 0, i, i+1) partition a convex polygon.
    for (let i = 1; i < n - 1; i++) triangles++;
    assert.equal(q('polygon_angle_sum', stage).answer, triangles * 180);
  }
  assert.match(q('polygon_angle_sum', 'transfer').prompt, /ei ole kõik võrdsed/);
});

test('total diagonal keys agree with enumerated non-neighbour vertex pairs', () => {
  for (const [stage, n] of [['practice', 8], ['transfer', 13], ['reserve', 14]]) {
    assert.equal(q('polygon_diagonal_count', stage).answer, diagonalPairs(n).length);
    assert.notEqual(q('polygon_diagonal_count', stage).answer, n - 3);
  }
});

test('regular-polygon answers close one full turn and distinguish interior from exterior', () => {
  for (const [stage, turn] of [['practice', 20], ['transfer', 15], ['reserve', 180 - 162]]) {
    assert.equal(q('regular_polygon_exterior', stage).answer * turn, 360);
  }
  assert.notEqual(q('regular_polygon_exterior', 'reserve').answer * 162, 360);
});

test('missing quadrilateral angles close 360 degrees and remain convex', () => {
  for (const [stage, angles] of [['practice', [68, 109, 117]], ['transfer', [84, 97, 118]], ['reserve', [91, 102, 79]]]) {
    const all = [...angles, q('quadrilateral_missing_angle', stage).answer];
    assert.equal(all.reduce((sum, a) => sum + a, 0), 360);
    assert.ok(all.every((a) => a > 0 && a < 180));
  }
});

test('equal-diagonal inference preserves its parallelogram premise and has valid counterexamples', () => {
  const shape = rect(6, 8);
  near(distance(shape[0], shape[2]), 10);
  near(distance(shape[1], shape[3]), 10);
  assert.notEqual(distance(shape[0], shape[1]), distance(shape[1], shape[2]));
  assert.equal(q('parallelogram_equal_diagonals', 'practice').choices[q('parallelogram_equal_diagonals', 'practice').answer], 'Ristkülik');
  assert.equal(q('parallelogram_equal_diagonals', 'transfer').choices[q('parallelogram_equal_diagonals', 'transfer').answer], 'Kõik neli sisenurka on 90°.');
  // Equal diagonals in a non-rectangular isosceles trapezoid disprove the
  // unrestricted converse: only one pair of opposite sides is parallel.
  const counterexample = [[-5, 0], [5, 0], [3, 4], [-3, 4]];
  near(distance(counterexample[0], counterexample[2]), distance(counterexample[1], counterexample[3]));
  const ab = [10, 0], ad = [2, 4];
  assert.notEqual(ab[0] * ad[0] + ab[1] * ad[1], 0);
  assert.match(q('parallelogram_equal_diagonals', 'reserve').choices[q('parallelogram_equal_diagonals', 'reserve').answer], /^Ei/);
});

test('rhombus area keys agree with shoelace area and distinguish full from half diagonals', () => {
  for (const [stage, d1, d2] of [['practice', 12, 18], ['transfer', 6, 22], ['reserve', 10, 18]]) {
    near(q('rhombus_diagonal_area', stage).answer, area(rhombus(d1, d2)));
  }
  assert.match(q('rhombus_diagonal_area', 'reserve').prompt, /tipust O-ni/);
  assert.notEqual(q('rhombus_diagonal_area', 'reserve').answer, area(rhombus(5, 9)));
});

test('trapezoid area keys agree with coordinates, including the valid 6–8–10 sloping leg', () => {
  near(q('trapezoid_base_height_area', 'practice').answer, area(trap(14, 8, 5)));
  const fresh = trap(17, 11, 8);
  near(q('trapezoid_base_height_area', 'transfer').answer, area(fresh));
  near(distance(fresh[1], fresh[2]), 10);
  assert.notEqual(q('trapezoid_base_height_area', 'transfer').answer, area(trap(17, 11, 10)));
  near(area(trap(17, 13, q('trapezoid_base_height_area', 'reserve').answer)), 105);
});

test('parallelogram areas agree with coordinates for both acute and obtuse included angles', () => {
  for (const [stage, a, b, degrees] of [['practice', 14, 10, 30], ['transfer', 9, 12, 150], ['reserve', 16, 9, 30]]) {
    near(q('parallelogram_included_angle_area', stage).answer, area(para(a, b, degrees)));
    assert.notEqual(q('parallelogram_included_angle_area', stage).answer, a * b);
  }
  near(area(para(9, 12, 30)), area(para(9, 12, 150)));
});

test('optional perimeter/area choices match distinct geometric measures and units', () => {
  for (const [stage, a, b] of [['practice', 9, 4], ['transfer', 8, 5], ['reserve', 11, 3]]) {
    const item = q('rectangle_perimeter_area', stage);
    const correct = item.choices[item.answer];
    assert.ok(correct.includes(`${perimeter(rect(a, b))} cm`));
    assert.ok(correct.includes(`${area(rect(a, b))} cm²`));
    assert.equal((correct.match(/cm²/g) || []).length, 1);
  }
});

test('diagrams are self-contained and accessible; fresh angle-area diagrams do not supply the constructed height', () => {
  for (const skill of Object.values(targets.skills)) for (const stage of stages) {
    const figure = skill[stage].diagram;
    if (!figure) continue;
    assert.ok(figure.description && figure.note);
    assert.match(figure.svg, /^<svg /);
    assert.match(figure.svg, /viewBox="0 0 320 180"/);
    assert.match(figure.svg, /role="img" aria-label=/);
    assert.doesNotMatch(figure.svg, /<script|<foreignObject|<image|<use|href=|\son[a-z]+\s*=/i);
    assert.match(figure.note, /ei ole mõõtkavas/);
  }
  for (const stage of stages) assert.doesNotMatch(q('parallelogram_included_angle_area', stage).diagram.svg, /stroke-dasharray/);
});

test('new question prompts do not duplicate existing diagnostic, practice, mock or warm-up prompts', () => {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/geometry-sprint-content.js'), 'utf8'), context);
  const original = context.GeometrySprintContent;
  const old = new Set([...original.diagnostic, ...original.lessons.flatMap((l) => l.practice), ...original.mock, ...original.warmup].map((item) => item.prompt));
  for (const skill of Object.values(targets.skills)) for (const stage of stages) assert.ok(!old.has(skill[stage].prompt), skill[stage].id);
});
