(function (root) {
  'use strict';

  const MAX_LENGTH = 1024;
  const MAX_DEPTH = 64;
  const messages = {
    SYNTAX: 'Kontrolli avaldist ja sulgusid. Korrutamiseks kasuta × või *.',
    DIVISION_BY_ZERO: 'Nulliga ei saa jagada.',
    DOMAIN: 'Selle tehte tulemus ei ole reaalarv või tehe pole selle väärtuse korral määratud.',
    NON_FINITE: 'Arv või tulemus on kalkulaatori jaoks liiga suur.',
    LIMIT: 'Avaldis on liiga pikk või sisaldab liiga palju pesastatud tehteid.'
  };

  function fail(code) {
    const error = new Error(messages[code]);
    error.name = 'GeometryCalculatorError';
    error.code = code;
    throw error;
  }

  function finite(value) {
    if (Number.isNaN(value)) fail('DOMAIN');
    if (!Number.isFinite(value)) fail('NON_FINITE');
    return value;
  }

  function applyFunction(name, value) {
    if (name === 'sqrt') {
      if (value < 0) fail('DOMAIN');
      return Math.sqrt(value);
    }
    if (name === 'asin' || name === 'acos') {
      if (Math.abs(value) > 1) fail('DOMAIN');
      return Math[name](value) * 180 / Math.PI;
    }
    if (name === 'atan') return Math.atan(value) * 180 / Math.PI;

    // Reduce degrees before conversion so large finite angles cannot overflow.
    // Cardinal angles are exact, avoiding residues such as sin(180) ≈ 1e-16.
    const angle = value % (name === 'tan' ? 180 : 360);
    if (name === 'tan') {
      if (Math.abs(angle) === 90) fail('DOMAIN');
      return angle === 0 ? 0 : finite(Math.tan(angle * Math.PI / 180));
    }
    if (angle % 90 === 0) {
      const quarter = ((angle / 90) % 4 + 4) % 4;
      return (name === 'sin' ? [0, 1, 0, -1] : [1, 0, -1, 0])[quarter];
    }
    return finite(Math[name](angle * Math.PI / 180));
  }

  function calculate(expression) {
    if (typeof expression !== 'string') fail('SYNTAX');
    if (expression.length > MAX_LENGTH) fail('LIMIT');
    if (!expression.trim()) fail('SYNTAX');
    let index = 0;
    let depth = 0;
    let token;

    function next() {
      while (index < expression.length && /\s/.test(expression[index])) index++;
      if (index === expression.length) { token = { type: 'end' }; return; }
      const rest = expression.slice(index);
      const number = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?/.exec(rest);
      if (number) {
        index += number[0].length;
        token = { type: 'number', value: finite(Number(number[0].replace(',', '.'))) };
        return;
      }
      const name = /^[a-z]+/i.exec(rest);
      if (name) {
        index += name[0].length;
        token = { type: 'name', value: name[0].toLowerCase() };
        return;
      }
      const character = expression[index++];
      const aliases = { '×': '*', '÷': '/', '−': '-' };
      if (character === 'π') token = { type: 'name', value: 'pi' };
      else if ('+-*/^()√×÷−'.includes(character)) token = { type: aliases[character] || character };
      else fail('SYNTAX');
    }

    function take(type) {
      if (token.type !== type) return false;
      next();
      return true;
    }

    function primary() {
      if (token.type === 'number') {
        const value = token.value;
        next();
        return value;
      }
      if (take('(')) {
        const value = sum();
        if (!take(')')) fail('SYNTAX');
        return value;
      }
      if (token.type === 'name') {
        const name = token.value;
        next();
        if (name === 'pi') return Math.PI;
        if (!['sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan'].includes(name) || !take('(')) fail('SYNTAX');
        const value = sum();
        if (!take(')')) fail('SYNTAX');
        return finite(applyFunction(name, value));
      }
      fail('SYNTAX');
    }

    function power() {
      const base = primary();
      if (!take('^')) return base;
      const exponent = unary();
      if (base === 0 && exponent < 0) fail('DIVISION_BY_ZERO');
      return finite(Math.pow(base, exponent));
    }

    function unary() {
      if (++depth > MAX_DEPTH) fail('LIMIT');
      try {
        if (take('+')) return unary();
        if (take('-')) return -unary();
        if (take('√')) return applyFunction('sqrt', unary());
        return power();
      } finally {
        depth--;
      }
    }

    function product() {
      let value = unary();
      while (token.type === '*' || token.type === '/') {
        const operator = token.type;
        next();
        const right = unary();
        if (operator === '/' && right === 0) fail('DIVISION_BY_ZERO');
        value = finite(operator === '*' ? value * right : value / right);
      }
      return value;
    }

    function sum() {
      let value = product();
      while (token.type === '+' || token.type === '-') {
        const operator = token.type;
        next();
        const right = product();
        value = finite(operator === '+' ? value + right : value - right);
      }
      return value;
    }

    // Unary signs bind less tightly than powers; an exponent may itself be signed.
    // Thus -2^2 = -4, 2^-2 = 0.25, and 2^3^2 = 512.
    next();
    const result = sum();
    if (token.type !== 'end') fail('SYNTAX');
    return finite(result);
  }

  function format(value) {
    if (typeof value !== 'number') fail('SYNTAX');
    finite(value);
    // Only presentation is rounded. calculate() keeps the original double precision.
    return value === 0 ? '0' : Number(value.toPrecision(12)).toString();
  }

  const api = Object.freeze({ calculate, format });
  root.GeometryCalculator = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
