const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const calculator = require('../src/geometry-calculator-engine.js');

function close(expression, expected, tolerance = 1e-12) {
  const actual = calculator.calculate(expression);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${expression}: expected ${expected}, got ${actual}`);
}

function rejects(expression, code) {
  assert.throws(() => calculator.calculate(expression), (error) => {
    assert.equal(error.name, 'GeometryCalculatorError');
    if (code) assert.equal(error.code, code, String(expression));
    assert.ok(typeof error.message === 'string' && error.message.length > 0);
    return true;
  }, String(expression));
}

test('Geometry reference calculations work with degrees and preserve numeric precision', () => {
  close('sqrt(8^2+5^2-2*8*5*cos(60))', 7);
  close('11*8*sin(60)', 44 * Math.sqrt(3));
  close('acos(0.5)', 60);
  close('sqrt(3^2+4^2)', 5);
  close('(12+8)*5/2', 50);
  close('pi*4^2', 16 * Math.PI);
  close('2*π*7', 14 * Math.PI);
  close('6*8*sin(30)/2', 12);
  close('atan(3/4)', Math.atan(3 / 4) * 180 / Math.PI);
  assert.equal(calculator.calculate('1/3'), 1 / 3);
  assert.equal(calculator.calculate('pi'), Math.PI);
});

test('Arithmetic follows precedence, right-associated powers and conventional unary signs', () => {
  const cases = {
    '2+3*4': 14,
    '(2+3)*4': 20,
    '18/3/2': 3,
    '10-3-2': 5,
    '2^3^2': 512,
    '(2^3)^2': 64,
    '-2^2': -4,
    '(-2)^2': 4,
    '2^-2': 0.25,
    '2^-2^2': 0.0625,
    '-2^-2': -0.25,
    '(-2)^3': -8,
    '3*-2': -6,
    '2--3': 5,
    '2+-3': -1,
    '--2': 2,
    '+-+2': -2,
    '√9+√(16)': 7,
    '√(3^2+4^2)': 5,
    '√9^2': 9,
    '-sqrt(9)^2': -9
  };
  for (const [expression, expected] of Object.entries(cases)) assert.equal(calculator.calculate(expression), expected, expression);
});

test('Localized operators, decimal separators, whitespace and scientific notation are accepted', () => {
  const cases = {
    ' 2,5 × 4 ÷ 2 ': 5,
    '.5 + ,25': 0.75,
    '2. + 3,': 5,
    '1e-3 + 2E-3': 0.003,
    '1,2e+3 / 2': 600,
    '2−5': -3,
    '\t(2\n+3)\u00a0*4': 20,
    'SQRT(9)': 3,
    'PI/pi': 1
  };
  for (const [expression, expected] of Object.entries(cases)) assert.equal(calculator.calculate(expression), expected, expression);
});

test('Trigonometry uses degrees, including exact cardinal and negative angles', () => {
  close('sin(30)', 0.5);
  close('cos(60)', 0.5);
  close('tan(45)', 1);
  close('asin(0.5)', 30);
  close('asin(0,5)', 30);
  close('acos(-1)', 180);
  close('asin(-1)', -90);
  close('atan(-1)', -45);
  for (const [expression, expected] of [
    ['sin(180)', 0], ['sin(360)', 0], ['sin(-90)', -1],
    ['sin(450)', 1], ['cos(90)', 0], ['cos(270)', 0],
    ['cos(-180)', -1], ['cos(360)', 1], ['tan(180)', 0]
  ]) assert.equal(calculator.calculate(expression), expected, expression);
  const nearPole = calculator.calculate('tan(89.999999999)');
  assert.ok(Number.isFinite(nearPole) && nearPole > 1e9);
  const tinyAngle = calculator.calculate('sin(1e-20)');
  assert.ok(tinyAngle > 0 && tinyAngle < 1e-20);
  assert.ok(Number.isFinite(calculator.calculate('sin(1e308)')));
});

test('Domain errors and singularities reject invalid real-number calculations', () => {
  for (const expression of ['sqrt(-1)', '√(-9)', '(-4)^0.5', 'asin(1.0001)', 'asin(-2)', 'acos(2)', 'acos(-1.0001)', 'tan(90)', 'tan(-90)', 'tan(270)', 'tan(450)', 'tan(-270)', 'tan(90+180*1000000)']) rejects(expression, 'DOMAIN');
  for (const expression of ['1/0', '0/0', '1/(2-2)', '5÷-0', '0^-1', '1/cos(90)', '1/sin(180)']) rejects(expression, 'DIVISION_BY_ZERO');
  for (const expression of ['1e309', '1e308*2', '1e308+1e308', '10^1000', '1/1e-320']) rejects(expression, 'NON_FINITE');
});

test('Malformed and executable-looking inputs are rejected without evaluation', () => {
  const invalid = [
    '', '   ', null, undefined, 3, {}, [],
    '2+', '*2', '2**3', '2//3', '2^^3', '()', '(2+3', '2+3)',
    '1..2', '1,2,3', '1.2,3', '.', ',', '1e', '1e+', '1e--3',
    '2 3', '2π', '2(3)', '(2)(3)', 'pi(2)', 'sqrt 4', 'sin()', 'sin(30, 60)',
    'abs(2)', 'e', 'Infinity', 'NaN', '0x10', 'Math.PI', 'Math.sin(1)',
    'constructor(1)', '__proto__', 'process.exit()', 'alert(1)',
    'globalThis.__calculatorExecuted = 1', '1;globalThis.__calculatorExecuted=1',
    '(()=>1)()', 'eval("1+1")', 'new Function("return 1")()',
    '2/*comment*/+3', '<script>alert(1)</script>', '1%2', '1=1', '1&&2'
  ];
  delete globalThis.__calculatorExecuted;
  for (const expression of invalid) rejects(expression, 'SYNTAX');
  assert.equal(globalThis.__calculatorExecuted, undefined);
});

test('Limits reject excessive length and recursive nesting without a stack overflow', () => {
  for (const expression of ['1'.repeat(1025), ' '.repeat(1025) + '1', '('.repeat(80) + '1' + ')'.repeat(80), '-'.repeat(80) + '1', '2^'.repeat(80) + '1', 'sqrt('.repeat(80) + '1' + ')'.repeat(80)]) rejects(expression, 'LIMIT');
  assert.equal(calculator.calculate('('.repeat(20) + '7' + ')'.repeat(20)), 7);
  assert.equal(calculator.calculate(Array(200).fill('1').join('+')), 200);
});

test('Display formatting removes floating artifacts and remains valid calculator input', () => {
  const cases = [
    [0, '0'], [-0, '0'], [0.1 + 0.2, '0.3'], [1 / 3, '0.333333333333'],
    [Math.PI, '3.14159265359'], [Math.sqrt(3), '1.73205080757'],
    [1e-20, '1e-20'], [1e25, '1e+25'], [1200, '1200']
  ];
  for (const [value, expected] of cases) {
    assert.equal(calculator.format(value), expected);
    assert.equal(calculator.calculate(expected), Number(expected));
  }
  for (const value of [Number.MIN_VALUE, Number.MAX_VALUE, -1e200, 1e-300, 100000000000.5]) {
    const formatted = calculator.format(value);
    assert.equal(calculator.calculate(formatted), Number(formatted));
    assert.ok(Number.isFinite(calculator.calculate(formatted)));
  }
  for (const value of [Infinity, -Infinity, NaN, '2', null, undefined]) assert.throws(() => calculator.format(value), { name: 'GeometryCalculatorError' });
});

test('Standalone browser API works without network, DOM or storage dependencies', () => {
  const context = vm.createContext({});
  vm.runInContext('window = globalThis; Object.defineProperty(globalThis, "localStorage", {get() {throw Error("Unexpected storage access");}}); Object.defineProperty(globalThis, "fetch", {get() {throw Error("Unexpected network access");}});', context);
  vm.runInContext(fs.readFileSync(require.resolve('../src/geometry-calculator-engine.js'), 'utf8'), context);
  assert.equal(vm.runInContext('window.GeometryCalculator.calculate("sqrt(9)+2^3")', context), 11);
  assert.equal(vm.runInContext('window.GeometryCalculator.format(1/3)', context), '0.333333333333');
  assert.deepEqual(Object.keys(context.GeometryCalculator), ['calculate', 'format']);
});
