const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../src/return-cue.js'), 'utf8');
function open(storage) {
  const nodes = new Map();
  const document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, {
        textContent: id === 'cue-summary' ? 'Valin õppimiseks sobiva hetke' : '',
        hidden: true,
        addEventListener(name, callback) { this[name] = callback; },
        focus() {},
      });
      return nodes.get(id);
    },
  };
  vm.runInNewContext(script, { document, localStorage: storage });
  return id => nodes.get(id);
}

test('opting in, returning, editing and removing a cue leave learning records alone', () => {
  const records = new Map([['study-progress', 'unchanged']]);
  const storage = {
    getItem: key => records.get(key),
    setItem: (key, value) => records.set(key, value),
    removeItem: key => records.delete(key),
  };
  let node = open(storage);
  assert.equal(records.size, 1);
  for (const cue of ['pärast õhtusööki', 'pärast trenni']) {
    node('cue-input').value = cue;
    node('cue-form').submit({ preventDefault() {} });
    node = open(storage);
    assert.equal(node('cue-summary').textContent, 'Minu õppimishetk: ' + cue);
  }
  node('cue-remove').click();
  assert.deepEqual([...records], [['study-progress', 'unchanged']]);
});

test('storage failure never shows a saved plan', () => {
  const node = open({ getItem: () => '', setItem() { throw Error('unavailable'); } });
  node('cue-input').value = 'pärast õhtusööki';
  node('cue-form').submit({ preventDefault() {} });
  assert.equal(node('cue-summary').textContent, 'Valin õppimiseks sobiva hetke');
  assert.match(node('cue-status').textContent, /ei saanud/);
});
