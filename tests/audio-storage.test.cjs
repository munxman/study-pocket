const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../src/ielts-audio-storage.js');
function database(){
 const opening={},request={},tx={objectStore:()=>({put:()=>request,get:()=>request})};let closes=0;
 const db={objectStoreNames:{contains:()=>true},transaction:()=>tx,close:()=>closes++};
 return {opening,request,tx,db,api:{open:()=>opening},opened(){opening.result=db;opening.onsuccess();},get closes(){return closes;}};
}
test('Recording save waits for the storage transaction to commit',async()=>{
 const d=database();let saved=false;const pending=A.record('attempt',new Blob(['audio']),d.api).then(()=>saved=true);
 d.opened();d.request.result='attempt';d.request.onsuccess();await Promise.resolve();assert.equal(saved,false);assert.equal(d.closes,0);
 d.tx.oncomplete();await pending;assert.equal(saved,true);assert.equal(d.closes,1);
});
test('Storage abort after successful recording request rejects instead of claiming saved',async()=>{
 const d=database(),pending=A.record('attempt',new Blob(['audio']),d.api);const rejected=assert.rejects(pending,/interrupted/);
 d.opened();d.request.onsuccess();d.tx.onabort();await rejected;assert.equal(d.closes,1);
});
test('Recording reads resolve only after completion and preserve the actual blob',async()=>{
 const d=database(),blob=new Blob(['saved audio'],{type:'audio/mp4'}),pending=A.record('attempt',undefined,d.api);
 d.opened();d.request.result=blob;d.request.onsuccess();d.tx.oncomplete();assert.equal(await pending,blob);assert.equal(d.closes,1);
});
test('Quota errors reject and close the recording database once',async()=>{
 const d=database(),pending=A.record('attempt',new Blob(['audio']),d.api);const rejected=assert.rejects(pending,/quota/);
 d.opened();d.request.error=Error('quota exceeded');d.request.onerror();d.tx.onerror();d.tx.onabort();await rejected;assert.equal(d.closes,1);
});
test('Blocked storage can offer download fallback and closes any late connection',async()=>{
 const d=database(),pending=A.record('attempt',new Blob(['audio']),d.api),rejected=assert.rejects(pending,/busy/);
 d.opening.onblocked();await rejected;d.opened();assert.equal(d.closes,1);
});
test('Unavailable or synchronously failing storage rejects for download recovery',async()=>{
 await assert.rejects(A.record('attempt',new Blob(['audio']),{open(){throw Error('unavailable');}}),/unavailable/);
 const d=database();d.db.transaction=()=>{throw Error('closed');};const p=A.record('attempt',new Blob(['audio']),d.api),rejected=assert.rejects(p,/closed/);d.opened();await rejected;assert.equal(d.closes,1);
});
test('Emergency downloads retain the recording container extension',()=>{
 assert.equal(A.extension('audio/mp4'),'m4a');assert.equal(A.extension('audio/webm;codecs=opus'),'webm');assert.equal(A.extension('audio/ogg;codecs=opus'),'ogg');
});
function recordingFlow(){
 const vm=require('node:vm'),fs=require('node:fs'),E=require('../src/ielts-engine.js'),source=fs.readFileSync('src/ielts.js','utf8');
 const state=E.fresh();E.start(state,{kind:'speaking',taskIds:['speaking'],title:'QA',mode:'full'});
 const buttons=new Map(),messages=[],recovered=[];let resolveSave,rejectSave,saves=0,stops=0;
 const storage=new Promise((resolve,reject)=>{resolveSave=resolve;rejectSave=reject;});
 const stream={getTracks:()=>[{stop(){stops++;}}]};
 class Capture{static isTypeSupported(){return true;}start(){this.state='recording';}stop(){this.state='inactive';this.pending=this.onstop();}}
 const context={state,E,Date,Blob,Error,CustomEvent,pendingRecovery:null,recordRequest:null,main:{querySelector:()=>null},view:'session',selectedResult:null,recordBusy:false,recorder:null,recordStream:null,pendingTimedSubmission:null,
  navigator:{mediaDevices:{getUserMedia:async()=>stream}},MediaRecorder:Capture,window:{MediaRecorder:Capture},
  document:{dispatchEvent(){return true;},querySelector(selector){if(!buttons.has(selector))buttons.set(selector,{setAttribute(){this.disabled=true;},removeAttribute(){this.disabled=false;}});return buttons.get(selector);},getElementById(){return {}; }},
  current:()=>E.active(context.state),audioRecord:()=>storage,save:()=>saves++,message:t=>messages.push(t),showRecording(){},renderResult(){},go(page){context.view=page;},stopMedia(){},questions:()=>[],recoverRecording:(blob,id)=>recovered.push({blob,id})};
 vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf('function stopRecording()'),source.indexOf('function stopMedia()'))+source.slice(source.indexOf('async function record()'),source.indexOf('async function play()'))+source.slice(source.indexOf('function submit('),source.indexOf('function renderResult(')),context);
 return {context,messages,recovered,resolveSave,rejectSave,buttons,get saves(){return saves;},get stops(){return stops;},async begin(audio=true){await context.record();if(audio)context.recorder.ondataavailable({data:new Blob(['test audio'],{type:'audio/mp4'})});},stop(){context.stopRecording();return context.recorder.pending;}};
}
test('Speaking UI does not mark a recording saved before storage completes and survives a concurrent state refresh',async()=>{
 const f=recordingFlow();await f.begin();const pending=f.stop();assert.equal(f.context.recordBusy,true);assert.equal(f.context.current().recorded,undefined);assert.equal(f.saves,0);
 f.context.state=JSON.parse(JSON.stringify(f.context.state));f.resolveSave();await pending;
 assert.equal(f.context.current().recorded,true);assert.equal(f.context.recordBusy,false);assert.equal(f.saves,1);
});
test('Timed speaking waits for a pending recording save before submitting',async()=>{
 const f=recordingFlow();await f.begin();f.context.submit(true);f.context.submit(true);assert.equal(f.context.current().completedAt,0);
 f.resolveSave();await f.context.recorder.pending;assert.ok(f.context.current().completedAt);assert.equal(f.context.current().timedOut,true);assert.equal(f.context.view,'result');
});
test('Failed recording save exposes the audio for recovery without fabricating saved progress',async()=>{
 const f=recordingFlow();await f.begin();const pending=f.stop();f.context.view='home';f.rejectSave(Error('quota'));await pending;
 assert.equal(f.context.current().recorded,undefined);assert.equal(f.saves,0);assert.equal(f.recovered.length,1);assert.equal(f.recovered[0].blob.type,'audio/mp4');assert.equal(f.context.recordBusy,false);
});
test('An empty recording releases controls and allows another try',async()=>{
 const f=recordingFlow();await f.begin(false);await f.stop();assert.equal(f.context.recordBusy,false);assert.match(f.messages.at(-1),/No audio/);assert.equal(f.saves,0);assert.equal(f.recovered.length,0);assert.equal(f.buttons.get('[data-action="record"]').disabled,false);
});
test('Quota failure at the speaking deadline preserves the transcript and supplies a recovery file',async()=>{
 const f=recordingFlow();await f.begin();const a=f.context.current();a.texts.speaking='Only words actually entered.';
 f.context.submit(true);f.rejectSave(Error('limit reached'));await f.context.recorder.pending;
 assert.equal(f.recovered.length,1);assert.equal(a.recorded,undefined);assert.ok(a.completedAt);assert.equal(a.timedOut,true);
 assert.equal(a.texts.speaking,'Only words actually entered.');assert.equal(f.context.view,'result');
});
test('A silent empty recording at the deadline earns no block',async()=>{
 const f=recordingFlow();await f.begin(false);const a=f.context.current();
 f.context.submit(true);await f.context.recorder.pending;
 assert.equal(a.status,'empty');assert.equal(a.completedAt,0);assert.equal(f.context.view,'result');
});
test('Late microphone permission after the timer cannot add a recording to the completed attempt',async()=>{
 const f=recordingFlow();let grant;let released=0;
 f.context.navigator.mediaDevices.getUserMedia=()=>new Promise(resolve=>{grant=resolve;});
 const a=f.context.current();a.texts.speaking='Earlier transcript';
 const opening=f.context.record();f.context.submit(true);assert.equal(a.timedOut,true);assert.ok(a.completedAt);
 grant({getTracks:()=>[{stop(){released++;}}]});await opening;
 assert.equal(released,1);assert.equal(f.context.recordBusy,false);assert.equal(a.recorded,undefined);
});
test('Historical speaking evidence survives deletion and local availability follows stored bytes',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),src=fs.readFileSync('src/ielts.js','utf8');
 const before={id:'session1',recorded:true,completedAt:123,texts:{speech:'test transcript'}};
 const entries=new Map([['session1',new Blob(['legacy'],{type:'audio/mp4'})]]);
 const holder={},ctx={document:{getElementById:()=>holder},window:{confirm:()=>true,IELTSAudioStorage:A},URL,
  clearTimeout,setTimeout,expiryTimer:null,audioURL:null,audioViewGeneration:0,state:{sessions:[structuredClone(before)]},
  esc:s=>String(s),date:()=>'',button:()=>'<button>Delete</button>',message(){},view:'result',renderResult(){},
  localAudio:{async purgeExpired(){},async record(id){return entries.get(id);},async remove(id){entries.delete(id);}}
 };
 vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('function clearAudioPreview()'),src.indexOf('async function showLocalAudioList()'))+src.slice(src.indexOf('async function showRecording(id,target)'),src.indexOf("document.addEventListener('study-microphone-start'")),ctx);
 await ctx.showRecording('session1','target');assert.match(holder.innerHTML,/Earlier recording on this device/);
 await ctx.deleteLocalAudio('session1');assert.equal(entries.has('session1'),false);
 assert.deepEqual(ctx.state.sessions[0],before);
 await ctx.showRecording('session1','target');assert.match(holder.textContent,/No audio for this attempt is stored in this browser/);
});
