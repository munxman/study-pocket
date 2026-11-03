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
    CustomEvent, document: {dispatchEvent: () => true},
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
    async purgeExpired() {},
    async keepForWeek(id,value){const kept={...value,retention:'week-v1',expiresAt:value.at+604800000};clips.set(id,kept);return kept;},
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

test('Temporary audio is not restored on reload. Explicit retention waits for commit and permits later deletion', async () => {
  const f=setup(), commit=deferred();
  await f.note.load(); f.pending.resolve(f.stream);await f.note.start();
  const recorder=f.note.recorder;
  recorder.ondataavailable({data:new Blob(['voice'],{type:'audio/mp4'})});
  assert.equal(f.root.limit,60000); f.root.timeout();
  await recorder.finished;
  assert.equal(f.track.stopped,true);assert.equal(f.clips.size,0);
  assert.equal(f.note.temporary,true);
  const beforeKeep=new f.Note('session1','Bioloogia');await beforeKeep.load();assert.equal(beforeKeep.clip,undefined);
  const write=f.store.keepForWeek;
  f.store.keepForWeek=async(...args)=>{await commit.promise;return write(...args);};
  const saving=f.note.keep();assert.equal(f.note.phase,'saving');assert.equal(f.clips.size,0);
  commit.resolve();await saving;assert.equal(f.note.phase,'ready');assert.equal(f.note.temporary,false);
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
  f.store.keepForWeek=async()=>{throw Error('quota');};
  f.note.stop();await recorder.finished;await f.note.keep();
  assert.equal(f.clips.get('session1'),before);assert.equal(f.note.unsaved,true);
  assert.equal(f.note.clip.blob.type,'audio/webm'); assert.equal(await f.note.clip.blob.text(),'retry');
  assert.match(f.note.message,/alla laadida/);
  await f.note.remove();assert.equal(f.note.clip,before);assert.equal(f.clips.get('session1'),before);
});

test('Empty capture preserves an existing note', async () => {
  const f=setup(); const before={blob:new Blob(['first']),topic:'Old',at:1}; f.clips.set('session1',before);
  await f.note.load(); f.pending.resolve(f.stream);await f.note.start();
  const recorder=f.note.recorder; f.note.stop();await recorder.finished;
  assert.equal(f.note.clip,before);assert.match(f.note.message,/Heli ei salvestunud/);
});

test('A same-question redraw preserves the temporary clip. Leaving the lesson disposes of it without writing storage',async()=>{
 const fixture=setup(),tags=new Map();let writes=0;
 const node=tag=>({tag,dataset:{},append(){},setAttribute(){},addEventListener(){},insertAdjacentHTML(){}});
 fixture.root.document.createElement=node;
 fixture.root.document.addEventListener=()=>{};
 fixture.root.customElements={get:k=>tags.get(k),define:(k,v)=>tags.set(k,v)};
 fixture.root.HTMLElement=class {constructor(){this.dataset={session:'session1',topic:'biology'};}closest(){return null;} replaceChildren(){}};
 fixture.root.URL={createObjectURL:()=> 'blob:preview',revokeObjectURL(){}};
 fixture.root.addEventListener=()=>{};
 fixture.store.keepForWeek=async()=>{writes++;};
 voice(fixture.root,{createRecordingStore:()=>fixture.store,extension:()=> 'm4a'}).install();
 const Widget=tags.get('reasoning-voice'),first=new Widget();first.connectedCallback();
 await new Promise(resolve=>setImmediate(resolve));
 fixture.pending.resolve(fixture.stream);await first.note.start();
 const recorder=first.note.recorder;recorder.ondataavailable({data:new Blob(['thought'])});
 first.note.stop();await recorder.finished;
 const updated=new Widget();first.disconnectedCallback();updated.connectedCallback();await Promise.resolve();
 assert.equal(updated.note,first.note);assert.equal(await updated.note.clip.blob.text(),'thought');
 updated.disconnectedCallback();await Promise.resolve();
 const fresh=new Widget();fresh.connectedCallback();await new Promise(resolve=>setImmediate(resolve));
 assert.notEqual(fresh.note,updated.note);assert.equal(fresh.note.clip,undefined);assert.equal(writes,0);
});
