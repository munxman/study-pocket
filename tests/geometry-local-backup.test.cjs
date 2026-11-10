const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../src/geometry-local-backup.js');
const E = require('../src/geometry-sprint-engine.js');
require('../src/geometry-sprint-content.js');
const DATA = globalThis.GeometrySprintContent;
const NOW = Date.UTC(2026, 10, 11, 19);

function storage(entries = [], fail = () => false) {
  const map = new Map(entries);
  return { map, get length() { return map.size; }, key: i => [...map.keys()][i] || null, getItem: key => map.get(key) ?? null, setItem(key, raw) { if (fail(key, raw)) throw Error('quota'); map.set(key, raw); }, removeItem: key => map.delete(key) };
}
function coach(answer = '1620') { const state = E.fresh(DATA); state.diagnostic.values[0] = answer; state.diagnostic.working[0] = 'My own method'; return JSON.stringify(state); }
function file(entries) { return {format:B.FORMAT,version:1,exportedAt:NOW,entries}; }
function apply(target, value, options = {}) { const p = B.preview(target, value); return B.restore(target, value, {expected:p.expected,...options,now:NOW}); }

test('Capture includes coach, legacy and recovery data but excludes credentials and other subjects', () => {
  const key = B.COACH + '-recovery-test';
  const source = storage([[B.COACH,coach()],[B.KEYS[1],JSON.stringify(Array(8).fill(''))],[key,'{"format":"geometry-recovery-v1","currentWindow":null}'],['study-pocket:pairing:v1','secret'],['hendrik-maths-v1','unrelated']]);
  const saved = B.capture(source, {now:NOW});
  assert.deepEqual(saved.entries.map(e=>e.key).sort(), [B.COACH,B.KEYS[1],key].sort());
  assert.equal(B.stringify(saved).includes('secret'), false);
  assert.deepEqual(B.parse(B.stringify(saved)), saved);
});

test('Round trip preserves diagnostic drafts, original submitted snapshot and legacy null dates exactly', () => {
  const state = E.fresh(DATA);
  state.diagnostic.submitted = {values:DATA.diagnostic.map(q=>String(q.answer)),working:Array(8).fill(''),at:null,topics:['angles','areas'],reasons:{angles:'transfer',areas:'transfer'}};
  state.diagnostic.values[0] = 'separate later draft';
  state.practice.angles = [{value:'7',working:'First method',help:true,attempts:[{correct:false,value:'7',working:'First method',at:NOW-1000,help:true}],correction:'Later correction'}];
  const raw = JSON.stringify(state), source = storage([[B.COACH,raw]]), target = storage();
  const result = apply(target,B.capture(source,{now:NOW}));
  assert.equal(target.getItem(B.COACH),raw);
  assert.equal(JSON.parse(target.getItem(B.COACH)).diagnostic.submitted.at,null);
  assert.equal(result.answerDatesChanged,false);
});

test('Preview is read-only and differing existing work needs explicit confirmation', () => {
  const target = storage([[B.COACH,coach('44')]]), incoming = file([{key:B.COACH,raw:coach('1620')}]), before = [...target.map];
  const p = B.preview(target,incoming);
  assert.equal(p.requiresConfirmation,true);
  assert.deepEqual(p.conflicts,[B.COACH]);
  assert.deepEqual([...target.map],before);
  assert.throws(()=>B.restore(target,incoming,{expected:p.expected}),{code:'geometry_confirmation_required'});
  assert.deepEqual([...target.map],before);
});

test('Confirmed replacement keeps a discoverable exact prior local copy and other records unchanged', () => {
  const prior = coach('44'), incomingRaw = coach('1620'), target = storage([[B.COACH,prior],['unrelated','stay']]);
  const result = apply(target,file([{key:B.COACH,raw:incomingRaw}]),{confirmConflicts:true});
  assert.equal(target.getItem(B.COACH),incomingRaw);
  assert.equal(target.getItem(result.archives[0]),prior);
  assert.equal(target.getItem('unrelated'),'stay');
  const captured = B.capture(target,{now:NOW});
  assert.ok(captured.entries.some(e=>e.raw===prior&&e.key!==B.COACH));
});

test('A second identical import is idempotent and does not create more archives', () => {
  const target = storage([[B.COACH,coach('44')]]), incoming = file([{key:B.COACH,raw:coach()}]);
  apply(target,incoming,{confirmConflicts:true}); const size = target.length;
  const result = apply(target,incoming);
  assert.deepEqual(result.restored,[]);
  assert.deepEqual(result.identical,[B.COACH]);
  assert.equal(target.length,size);
});

test('Changed storage after preview aborts without overwriting the newer work', () => {
  const target = storage([[B.COACH,coach('44')]]), incoming = file([{key:B.COACH,raw:coach()}]), p = B.preview(target,incoming);
  const newer = coach('96'); target.setItem(B.COACH,newer);
  assert.throws(()=>B.restore(target,incoming,{expected:p.expected,confirmConflicts:true}),{code:'geometry_storage_changed'});
  assert.equal(target.getItem(B.COACH),newer);
  assert.equal(target.length,1);
});

test('Malformed or newer unsupported state is retained as recovery only, never activated', () => {
  for(const raw of ['{"version":1,',JSON.stringify({...E.fresh(DATA),version:2})]){
    const target=storage([[B.COACH,coach('44')]]), incoming=file([{key:B.COACH,raw}]);
    const p=B.preview(target,incoming); assert.equal(p.restorable.length,0); assert.equal(p.unreadable.length,1);
    const result=apply(target,incoming);
    assert.equal(target.getItem(B.COACH),coach('44'));
    assert.equal(target.getItem(result.retained[0]),raw);
    const length=target.length; apply(target,incoming); assert.equal(target.length,length);
  }
});

test('Conflicting recovery key retains both raw copies rather than replacing either', () => {
  const key=B.COACH+'-recovery-conflict', old='{"currentWindow":"older"}', incoming='{"currentWindow":"newer"}', target=storage([[key,old]]);
  const result=apply(target,file([{key,raw:incoming}]));
  assert.equal(target.getItem(key),old);
  assert.equal(target.getItem(result.retained[0]),incoming);
});

test('Failure to save the prior copy blocks replacement', () => {
  const before=coach('44'),target=storage([[B.COACH,before]], key=>key.includes('-before-import-'));
  assert.throws(()=>apply(target,file([{key:B.COACH,raw:coach()}]),{confirmConflicts:true}),{code:'geometry_prior_copy_failed'});
  assert.equal(target.getItem(B.COACH),before);
});

test('A later write failure rolls back earlier exact writes while retaining prior archives', () => {
  const before=coach('44'),legacy=JSON.stringify(Array(8).fill('old'));
  const target=storage([[B.COACH,before],[B.KEYS[1],legacy]],(key,raw)=>key===B.KEYS[1]&&raw!==legacy);
  const incoming=file([{key:B.COACH,raw:coach()},{key:B.KEYS[1],raw:JSON.stringify(Array(8).fill('new'))}]);
  assert.throws(()=>apply(target,incoming,{confirmConflicts:true}),{code:'geometry_restore_failed'});
  assert.equal(target.getItem(B.COACH),before);
  assert.equal(target.getItem(B.KEYS[1]),legacy);
  assert.ok([...target.map.keys()].some(key=>key.includes('-before-import-')));
});

test('Envelope version, unrelated keys, duplicates, excessive size and prototypes are rejected', () => {
  assert.throws(()=>B.parse({...file([]),version:2}),{code:'geometry_backup_format'});
  assert.throws(()=>B.parse(file([{key:'another-key',raw:'{}'}])),{code:'geometry_backup_entry'});
  assert.throws(()=>B.parse(file([{key:B.COACH,raw:coach()},{key:B.COACH,raw:coach()}])),{code:'geometry_backup_entry'});
  assert.throws(()=>B.parse(file([{key:B.COACH,raw:'x'.repeat(B.LIMITS.entryBytes+1)}])),{code:'geometry_backup_entry'});
  assert.throws(()=>B.parse('{"format":"'+B.FORMAT+'","version":1,"exportedAt":0,"entries":[],"__proto__":{}}'),{code:'geometry_backup_unsafe_key'});
  assert.throws(()=>B.parse(file([{key:B.COACH,raw:'{"version":1,"__proto__":{"polluted":true}}'}])),{code:'geometry_backup_unsafe_key'});
  assert.equal({}.polluted,undefined);
});

test('Export fails visibly when storage cannot be fully read rather than returning a partial-looking backup', () => {
  assert.throws(()=>B.capture({length:1,key:()=>B.COACH,getItem(){throw Error('denied');}}),{code:'geometry_storage_unavailable'});
});
