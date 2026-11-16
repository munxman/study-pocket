const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../src/ielts-engine.js'),C=require('../src/ielts-content.js'),L=require('../src/ielts-listening.js');
const NOW=Date.UTC(2026,10,16,21),copy=x=>JSON.parse(JSON.stringify(x));
const SCRIPT=fs.readFileSync(require.resolve('../src/ielts.js'),'utf8');

// Executes the actual IELTS UI handlers and engine with simulated DOM nodes.
// It does not claim physical-device rendering, speech, microphone or browser QA.
async function screen({search='',hash='',initial=null}={}){
 const rows=new Map(initial===null?[]:[[E.KEY,typeof initial==='string'?initial:JSON.stringify(initial)]]),writes=[],events={},subscribers={},nodes=new Map();
 let url=new URL('https://example.test/study-pocket/ielts.html'+search+hash);
 const node=id=>({id,innerHTML:'',textContent:'',events:{},focus(){},scrollIntoView(){},insertAdjacentHTML(){},querySelector(){return null;},querySelectorAll(){return [];},addEventListener(type,fn){this.events[type]=fn;}});
 const main=node('english-main');nodes.set('english-main',main);
 const store={getItem:key=>rows.get(key)||null,setItem(key,value){writes.push(key);rows.set(key,value);}};
 const location={get search(){return url.search;},get hash(){return url.hash;},set hash(value){url.hash=value;events.hashchange?.();}};
 class Clock extends Date{static now(){return NOW;}}
 const engine={...E,start:(s,args)=>E.start(s,args,NOW),resume:(s,id)=>E.resume(s,id,NOW),pause:s=>E.pause(s,NOW),submit:(s,q,now,timed)=>E.submit(s,q,now??NOW,timed),edit:(s,k,v)=>E.edit(s,k,v,NOW)};
 const context={IELTSEngine:engine,IELTS_CONTENT:C,IELTS_LISTENING:L,
  StudySync:{storage:store,subscribe(key,fn){subscribers[key]=fn;}},
  IELTSAudioStorage:{createRecordingStore(){return {purgeExpired:async()=>{},record:async()=>null,keys:async()=>[]};}},
  document:{hidden:false,activeElement:null,getElementById(id){if(!nodes.has(id))nodes.set(id,node(id));return nodes.get(id);},querySelectorAll(){return [];},querySelector(){return null;},addEventListener(){},dispatchEvent(){return true;}},
  location,history:{replaceState(_s,_t,path){url=new URL(path,url);}},navigator:{},Date:Clock,Intl,URL,URLSearchParams,Blob,
  setInterval(){},clearTimeout(){},setTimeout(){return 1;},addEventListener(type,fn){events[type]=fn;},removeEventListener(){}};
 context.window=context;
 await vm.runInNewContext(SCRIPT,context,{filename:'ielts.js'});
 return {main,rows,writes,nodes,state:()=>JSON.parse(rows.get(E.KEY)||'null'),url:()=>url,
  async click(action,data={}){await main.events.click({target:{closest:selector=>selector==='button[data-action]'?{dataset:{action,...data}}:null}});},
  input(taskId,value){main.events.input({target:{dataset:{text:taskId},value}});},
  answer(questionId,value){main.events.input({target:{dataset:{question:questionId},value}});},
  sync(state){subscribers[E.KEY](state);},windowEvent(name){events[name]?.({preventDefault(){},returnValue:''});},active(){const s=this.state();return s?.sessions.find(a=>a.id===s.activeId)||null;}};
}
function attempt(state,kind,extra={}){
 const task=kind==='writing'?C.writing.find(t=>t.kind==='task2'):kind==='speaking'?C.speaking[0]:C.reading[0];
 return E.start(state,{kind,taskIds:[task.id],title:'Synthetic '+kind,minutes:8,mode:'short',...extra},NOW-60000);
}

test('guided Writing opens one original short task without submitting, writing or assigning a band',async()=>{
 const h=await screen({search:'?guided=1&skill=writing'}),s=h.state(),a=h.active();
 assert.equal(s.sessions.length,1);assert.equal(a.kind,'writing');assert.equal(a.mode,'short');assert.equal(a.timed,false);
 assert.deepEqual(a.texts,{});assert.equal(a.completedAt,0);assert.deepEqual(s.evaluations,[]);
 assert.match(h.url().search,/session=/);assert.equal(h.url().hash,'#session');
 assert.match(h.main.innerHTML,/This short block/);assert.match(h.main.innerHTML,/will not establish a Writing band/);
 assert.ok(h.writes.every(k=>k===E.KEY));
});

test('guided Speaking offers a short Part2 response with optional audio and no microphone request',async()=>{
 const h=await screen({search:'?guided=1&skill=speaking'}),a=h.active();
 assert.equal(a.kind,'speaking');assert.equal(a.part,2);assert.equal(a.phase,'prep');assert.equal(a.timed,false);
 assert.equal(a.recorded,undefined);assert.deepEqual(a.texts,{});
 assert.match(h.main.innerHTML,/Optional audio for pronunciation feedback/);assert.match(h.main.innerHTML,/submit it on its own/);
 assert.equal(h.state().sessions.length,1);
});

test('guided Reading and Listening open original short samples without playing audio or submitting answers',async()=>{
 for(const kind of ['reading','listening']){
  const h=await screen({search:'?guided=1&skill='+kind}),a=h.active();
  assert.equal(a.kind,kind);assert.equal(a.mode,'short');assert.equal(a.timed,false);assert.equal(a.completedAt,0);
  assert.deepEqual(a.answers,{});assert.deepEqual(a.audioProgress,{});assert.equal(h.state().sessions.length,1);
  const source=(kind==='reading'?C.reading:L.short).find(t=>t.id===a.taskIds[0]);assert.ok(source);
  h.answer(source.questions[0].id,source.questions[0].answer);await h.click('submit');
  const result=h.state().sessions[0];assert.equal(result.total,source.questions.length);assert.equal(result.score,1);
  assert.equal(result.results.filter(r=>r.blank).length,source.questions.length-1);
  assert.match(h.main.innerHTML,/My next study step/);assert.match(h.main.innerHTML,/not calibrated to IELTS bands/);
  assert.equal(h.state().sessions.length,1);
 }
});

test('guided Reading restores selected answers and guided Listening preserves playback position',async()=>{
 for(const kind of ['reading','listening']){
  const state=E.fresh(),source=(kind==='reading'?C.reading:L.short)[0];
  const a=E.start(state,{kind,taskIds:[source.id],title:'Synthetic '+kind,mode:'short'},NOW-50000);
  E.answer(state,source.questions[0].id,'Own saved answer',NOW-40000);
  if(kind==='listening')a.audioProgress[source.id]={position:45,started:true,ended:false};
  E.pause(state,NOW-30000);
  const h=await screen({search:'?guided=1&skill='+kind,initial:state});
  assert.equal(h.active().id,a.id);assert.deepEqual(h.active().answers,a.answers);assert.deepEqual(h.active().audioProgress,a.audioProgress);
  assert.equal(h.state().sessions.length,1);assert.equal(h.active().completedAt,0);
 }
});

test('guided entry resumes a worked matching draft ahead of a newer untouched task and preserves another skill',async()=>{
 const state=E.fresh(),draft=attempt(state,'writing');draft.texts[draft.taskIds[0]]='My own synthetic draft';E.pause(state,NOW-50000);
 const opened=attempt(state,'writing');opened.updatedAt=NOW-10000;E.pause(state,NOW-9000);
 const other=attempt(state,'speaking');other.texts[other.taskIds[0]]='Separate synthetic speaking response';
 const h=await screen({search:'?guided=1&skill=writing',initial:state});
 assert.equal(h.active().id,draft.id);assert.equal(h.state().sessions.length,3);
 assert.equal(h.active().texts[draft.taskIds[0]],'My own synthetic draft');
 const savedOther=h.state().sessions.find(a=>a.id===other.id);assert.equal(savedOther.status,'paused');assert.deepEqual(savedOther.texts,other.texts);
 assert.equal(h.state().sessions.find(a=>a.id===opened.id).completedAt,0);
});

test('saved selections and submitted result survive exact guided URL reload without another attempt',async()=>{
 const h=await screen({search:'?guided=1&skill=writing'}),a=h.active();
 h.input(a.taskIds[0],'This is a synthetic paragraph in the learner’s own words.');
 const draft=await screen({search:h.url().search,hash:h.url().hash,initial:h.state()});
 assert.equal(draft.state().sessions.length,1);assert.equal(draft.active().id,a.id);assert.equal(draft.active().texts[a.taskIds[0]],h.active().texts[a.taskIds[0]]);
 await draft.click('submit');const submitted=draft.state().sessions[0];assert.ok(submitted.completedAt);assert.equal(submitted.total,0);
 assert.match(draft.main.innerHTML,/My next study step/);assert.match(draft.main.innerHTML,/Copy review prompt/);assert.match(draft.main.innerHTML,/not required to continue/);
 const result=await screen({search:draft.url().search,hash:draft.url().hash,initial:draft.state()});
 assert.equal(result.state().sessions.length,1);assert.deepEqual(result.state().sessions[0],submitted);assert.equal(result.writes.length,0);
 assert.match(result.main.innerHTML,/No automatic band has been assigned/);assert.match(result.main.innerHTML,/My next study step/);
});

test('submitting an empty guided response neither creates completion nor requires a recording',async()=>{
 const h=await screen({search:'?guided=1&skill=speaking'});await h.click('submit');
 assert.equal(h.active().completedAt,0);assert.equal(h.state().sessions.length,1);
 assert.match(h.nodes.get('english-message').textContent,/Write a response or save a recording/);
 h.input(h.active().taskIds[0],'A synthetic typed answer, without an audio file.');await h.click('submit');
 const a=h.state().sessions[0];assert.ok(a.completedAt);assert.equal(a.recorded,undefined);
 assert.match(h.main.innerHTML,/Short writing or typed speaking/);
});

test('invalid skill and absent opt-in leave history untouched and do not start a fallback task',async()=>{
 for(const search of ['?guided=1&skill=unknown','?skill=writing','?guided=0&skill=speaking']){
  const initial=E.fresh(),h=await screen({search,initial});
  assert.deepEqual(h.state(),initial);assert.deepEqual(h.writes,[]);assert.match(h.main.innerHTML,/Think clearly/);
 }
});

test('malformed or future-version saved history and missing guided sessions are preserved without overwrite',async()=>{
 for(const raw of ['{broken',JSON.stringify({version:2,sessions:[]})]){
  const h=await screen({search:'?guided=1&skill=writing',initial:raw});
  assert.equal(h.rows.get(E.KEY),raw);assert.deepEqual(h.writes,[]);assert.match(h.main.innerHTML,/earlier work is safe/);
 }
 const initial=E.fresh(),h=await screen({search:'?guided=1&session=missing',hash:'#session',initial});
 assert.deepEqual(h.state(),initial);assert.deepEqual(h.writes,[]);assert.match(h.main.innerHTML,/not available here yet/);
});

test('guided short practice neither expires nor changes the deadline of a separate timed Writing attempt',async()=>{
 const state=E.fresh(),full=attempt(state,'writing',{mode:'full'});full.deadline=NOW-1000;full.texts[full.taskIds[0]]='A full timed draft';
 const h=await screen({search:'?guided=1&skill=writing',initial:state});
 assert.equal(h.state().sessions.length,2);assert.equal(h.active().timed,false);
 const kept=h.state().sessions.find(a=>a.id===full.id);assert.equal(kept.deadline,full.deadline);assert.equal(kept.completedAt,0);assert.deepEqual(kept.texts,full.texts);
 const exact=await screen({search:'?guided=1&session='+full.id,hash:'#session',initial:state});
 assert.deepEqual(exact.state(),state);assert.equal(exact.writes.length,0);assert.match(exact.main.innerHTML,/does not start or finish it/);
});

test('incoming sync preserves the guided attempt rather than jumping to another skill and displays submitted result',async()=>{
 const h=await screen({search:'?guided=1&skill=writing'}),id=h.active().id;
 h.input(h.active().taskIds[0],'Saved own draft');const incoming=copy(h.state());
 const other=attempt(incoming,'speaking');h.sync(incoming);
 assert.match(h.main.innerHTML,/Ready to continue/);assert.equal(h.url().searchParams.get('session'),id);await h.click('resume',{id});assert.match(h.main.innerHTML,/Saved own draft/);
 const done=copy(incoming);done.activeId=id;E.submit(done,[],NOW);done.activeId=other.id;h.sync(done);
 assert.match(h.main.innerHTML,/Your response is saved/);assert.equal(h.url().hash,'#result');assert.match(h.main.innerHTML,/My next study step/);
});

test('manual continuation clears the old guided URL and navigation does not reopen a completed task',async()=>{
 const h=await screen({search:'?guided=1&skill=writing'});h.input(h.active().taskIds[0],'Saved own draft');await h.click('submit');
 await h.click('start',{kind:'speaking'});
 assert.equal(h.state().sessions.length,2);assert.equal(h.active().kind,'speaking');assert.equal(h.url().search,'');
 const before=h.state(),home=await screen({search:'?guided=1&session='+before.sessions[0].id,hash:'#home',initial:before});
 assert.deepEqual(home.state(),before);assert.equal(home.writes.length,0);assert.match(home.main.innerHTML,/Think clearly/);
});

test('malformed and future sync updates preserve the typed draft and suspend writes including pagehide',async()=>{
 for(const bad of ['{broken',{version:2,sessions:[]},null,{version:1,sessions:[{id:'broken',kind:'writing'}]}]){
  const h=await screen({search:'?guided=1&skill=writing'}),id=h.active().taskIds[0];
  h.input(id,'My saved synthetic draft');const before=copy(h.state()),writes=h.writes.length,html=h.main.innerHTML;
  assert.doesNotThrow(()=>h.sync(bad));
  assert.deepEqual(h.state(),before);assert.equal(h.main.innerHTML,html);assert.match(h.nodes.get('english-message').textContent,/history needs checking/);
  h.input(id,'My newer synthetic draft while waiting');await h.click('submit');h.windowEvent('pagehide');
  assert.deepEqual(h.state(),before);assert.equal(h.writes.length,writes);
  h.sync(JSON.stringify(before));
  assert.match(h.main.innerHTML,/My newer synthetic draft while waiting/);
  h.input(id,'My final recovered synthetic draft');
  assert.equal(h.active().texts[id],'My final recovered synthetic draft');assert.equal(h.state().sessions.length,1);
 }
});

test('a sync missing the exact guided session cannot replace it with a fresh history',async()=>{
 const h=await screen({search:'?guided=1&skill=reading'}),a=h.active(),q=C.reading.find(t=>t.id===a.taskIds[0]).questions[0];
 h.answer(q.id,'A saved choice');const before=copy(h.state()),writes=h.writes.length;
 h.sync(E.fresh());h.windowEvent('pagehide');
 assert.deepEqual(h.state(),before);assert.equal(h.writes.length,writes);assert.equal(h.url().searchParams.get('session'),a.id);
 h.sync(before);await h.click('submit');
 assert.ok(h.state().sessions[0].completedAt);assert.equal(h.state().sessions.length,1);
});

test('sync cannot rewrite a frozen submitted response but legitimate external feedback remains readable',async()=>{
 const h=await screen({search:'?guided=1&skill=writing'}),id=h.active().taskIds[0];
 h.input(id,'My original completed response');await h.click('submit');const before=copy(h.state()),writes=h.writes.length;
 const tampered=copy(before);tampered.sessions[0].texts[id]='A different replacement answer';tampered.sessions[0].updatedAt=NOW+100;
 h.sync(tampered);h.windowEvent('pagehide');
 assert.deepEqual(h.state(),before);assert.equal(h.writes.length,writes);assert.match(h.main.innerHTML,/My original completed response/);
 const reviewed=copy(before);E.addEvaluation(reviewed,{sessionId:reviewed.sessions[0].id,source:'Teacher',band:'',feedback:'Explain one example more precisely.'},NOW+100);
 h.sync(reviewed);
 assert.match(h.main.innerHTML,/Explain one example more precisely/);assert.doesNotMatch(h.main.innerHTML,/A different replacement answer/);
 h.windowEvent('pagehide');assert.equal(h.state().sessions[0].texts[id],'My original completed response');assert.equal(h.state().evaluations.length,1);
});
