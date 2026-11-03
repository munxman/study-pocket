const test = require('node:test');
const assert = require('node:assert/strict');
const voice = require('../src/reasoning-voice.js');

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve=res; reject=rej; });
  return {resolve,reject,promise};
}

function setup() {
  const pending = deferred(), clips = new Map();
  const track = {stop() { this.stopped = true; }};
  const stream = {getTracks: () => [track]};
  const root = {
    Blob, navigator: {mediaDevices: {getUserMedia: () => pending.promise}},
    clearTimeout() { root.cleared = true; },
    setTimeout(fn,ms) { root.timeout=fn; root.limit=ms; return 9; }
  };
  class Recorder {
    constructor(stream) { this.stream=stream; this.mimeType='audio/mp4'; }
    start(){ this.state='recording'; }
    stop(){ this.state='inactive'; this.finished=this.onstop(); }
  }
  root.MediaRecorder = Recorder;
  const store = {
    async record(id,clip) { if(clip) clips.set(id,clip); return clips.get(id); },
    async remove(id) { clips.delete(id); }
  };
  const audioStorage = {createRecordingStore(name) { assert.equal(name,'study-biology-reasoning-audio-v1'); return store; }};
  const {Note} = voice(root,audioStorage);
  const note = new Note('session1','X-linked inheritance');
  note.listeners.add(() => {});
  return {note,store,pending,stream,root,track,clips, Note};
}

test('Reasoning audio asks for mic only on tap; a late grant after leaving releases all tracks', async () => {
  const f=setup(); let requests=0;
  f.root.navigator.mediaDevices.getUserMedia=()=>{requests++;return f.pending.promise;};
  await f.note.load(); assert.equal(requests,0);
  const capture=f.note.start(); assert.equal(requests,1);
  f.note.stop();
  f.pending.resolve(f.stream); await capture;
  assert.equal(f.track.stopped,true); assert.equal(f.note.phase,'ready'); assert.equal(f.clips.size,0);
});

test('Reasoning audio respects permission denial and allows another attempt', async () => {
  const f=setup(); await f.note.load(); f.pending.reject(Error('denied'));
  await f.note.start(); assert.equal(f.note.phase,'ready'); assert.match(f.note.message,/Mikrofoni/);
  assert.equal(f.clips.size,0);
});

test('One-minute limit stops local capture, waits for commit, supports replay after reload and deletion', async () => {
  const f=setup(), commit=deferred();
  await f.note.load(); f.pending.resolve(f.stream);await f.note.start();
  const recorder=f.note.recorder;
  recorder.ondataavailable({data:new Blob(['voice'],{type:'audio/mp4'})});
  const write=f.store.record;
  f.store.record=async(id,value)=>{if(value)await commit.promise;return write(id,value);};
  assert.equal(f.root.limit,60000); f.root.timeout();
  assert.equal(f.note.phase,'saving'); assert.equal(f.track.stopped,true); assert.equal(f.clips.size,0);
  commit.resolve(); await recorder.finished;
  assert.equal(f.note.unsaved,false); assert.match(f.note.message,/Minu töö/);
  const reload = new f.Note('session1','Bioloogia'); await reload.load();
  assert.equal(reload.clip.topic,'X-linked inheritance');
  assert.equal(reload.clip.blob.type,'audio/mp4');
  assert.equal(await reload.clip.blob.text(),'voice');
  await reload.remove(); assert.equal(f.clips.size,0); assert.equal(reload.clip,null);
});

test('Interrupted replacement retains prior saved audio and exposes unsaved audio for download', async () => {
  const f=setup();
  const before={blob:new Blob(['first']),topic:'Old',at:1};f.clips.set('session1',before);
  await f.note.load(); f.pending.resolve(f.stream);await f.note.start(); const recorder=f.note.recorder;
  recorder.ondataavailable({data:new Blob(['retry'],{type:'audio/webm'})});
  f.store.record=async()=>{throw Error('quota');};
  f.note.stop();await recorder.finished;
  assert.equal(f.clips.get('session1'),before);assert.equal(f.note.unsaved,true);
  assert.equal(f.note.clip.blob.type,'audio/webm'); assert.equal(await f.note.clip.blob.text(),'retry');
  assert.match(f.note.message,/Laadi heli alla/);
});

test('Empty capture preserves an existing note', async () => {
  const f=setup(); const before={blob:new Blob(['first']),topic:'Old',at:1}; f.clips.set('session1',before);
  await f.note.load(); f.pending.resolve(f.stream);await f.note.start();
  const recorder=f.note.recorder; f.note.stop();await recorder.finished;
  assert.equal(f.note.clip,before);assert.match(f.note.message,/Heli ei salvestunud/);
});
