const {test}=require('node:test'), assert=require('node:assert/strict');
const makeUI=require('../src/study-teachback.js'),model=require('../src/teachback-model.js');
const makeDictation=require('../src/study-dictation.js');
const DAY=86400000;
function testBrowser(){
 const values=new Map(),tags=new Map(),bus=new EventTarget();let rootNode,serial=0,fail=false,recognition;
 class Node extends EventTarget{
  constructor(tag){super();this.tagName=tag?.toUpperCase();this.children=[];this.dataset={};this.attrs={};this.style={};this.parent=null;this.isConnected=false;this.value='';this.maxLength=-1;this.selectionEnd=0;}
  append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);if(this.isConnected)connect(n);}}
  replaceChildren(...nodes){for(const n of this.children)disconnect(n);this.children=[];this.append(...nodes);}
  setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return k==='lang'?(this.lang||null):this.attrs[k]??null;}hasAttribute(k){return k in this.attrs;}
  getRootNode(){return doc;}insertAdjacentHTML(){}focus(){doc.activeElement=this;}
  setRangeText(s,a,b){this.value=this.value.slice(0,a)+s+this.value.slice(b);}
  setSelectionRange(s,e){this.selectionEnd=e;}
 }
 function connect(n){if(n.isConnected)return;n.isConnected=true;n.connectedCallback?.();n.children.forEach(connect);}
 function disconnect(n){if(!n.isConnected)return;n.isConnected=false;n.disconnectedCallback?.();n.children.forEach(disconnect);}
 const flat=n=>n?[n,...n.children.flatMap(flat)]:[];
 const doc={activeElement:null,documentElement:{lang:'et'},
  createElement(tag){const Cls=tags.get(tag);if(!Cls)return new Node(tag);const n=new Cls();n.tagName=tag.toUpperCase();return n;},
  getElementById(id){return flat(rootNode).find(x=>x.id===id);},addEventListener(){},dispatchEvent:()=>true};
 const localStorage={get length(){return values.size;},key:i=>[...values.keys()][i],getItem:k=>values.get(k)??null,
   setItem(k,v){if(fail)throw Error('quota');values.set(k,String(v));},removeItem:k=>values.delete(k)};
 const session={id:'i-1',concept:'xlinked',stage:'question',selected:null,assisted:false,startedAt:Date.now(),closed:false};
 const state={cards:{},sessions:[session]}, other={cards:{},sessions:[]};
 const root={document:doc,HTMLElement:Node,Event,CustomEvent,navigator:{},location:{search:''},crypto:{randomUUID:()=>'test-'+(++serial)},
  localStorage,StudyTeachback:model,customElements:{get:k=>tags.get(k),define:(k,v)=>tags.set(k,v)},StudySync:{storage:{getItem:k=>JSON.stringify(k.includes('imat')?state:other)}},
  dispatchEvent:bus.dispatchEvent.bind(bus),addEventListener:bus.addEventListener.bind(bus),removeEventListener:bus.removeEventListener.bind(bus),
  SpeechRecognition:class{start(){recognition=this;this.onstart?.();}stop(){this.onend?.();}abort(){this.aborted=true;}}};
 const ui=makeUI(root);makeDictation(root).install();ui.install();
 rootNode=new Node('body');rootNode.isConnected=true;
 const args={module:'imat',session,state,otherState:other};
 const mount=(htmlOrTag,archive=false)=>{
   const encoded=htmlOrTag.match(/data-offer="([^"]+)"/)?.[1];const tag=encoded?'study-teachback':htmlOrTag;
   const n=doc.createElement(tag);if(encoded)n.dataset.offer=encoded;if(archive)n.dataset.context='archive';
   rootNode.replaceChildren(n);return n;
 };
 return {ui,root,state,other,session,args,mount,values,setFailure:v=>fail=v,flat:()=>flat(rootNode),get recorder(){return recognition;},
   find:(tag,label)=>flat(rootNode).find(x=>x.tagName===tag.toUpperCase()&&(!label||x.textContent===label)),
   click(label){const n=flat(rootNode).find(x=>x.tagName==='BUTTON'&&x.textContent===label);assert.ok(n,label);n.dispatchEvent(new Event('click'));}};
}
test('Showing an invitation does not count as an answer; redraw preserves live dictation, then freezes one dated entry',async()=>{
 const b=testBrowser(),html=b.ui.slot(b.args);assert.ok(html);assert.equal(b.ui.recordSet().offers.length,0);
 b.mount(html);let {offers,answers}=b.ui.recordSet();assert.equal(offers.length,1);assert.equal(answers.length,0);
 const id=offers[0].id,field=b.find('textarea');b.click('Dikteeri tekstiks');const api=b.recorder;
 api.onresult({resultIndex:0,results:[{isFinal:true,0:{transcript:'First thought'}}]});assert.equal(field.value,'First thought');
 b.mount(b.ui.slot(b.args));await Promise.resolve();
 assert.equal(b.find('textarea').id,field.id);assert.equal(api.aborted,undefined);
 api.onresult({resultIndex:1,results:[{isFinal:true,0:{transcript:'First thought'}},{isFinal:true,0:{transcript:'continued'}}]});
 assert.equal(b.find('textarea').value,'First thought continued');
 b.click('Lõpeta dikteerimine');b.click('Salvesta minu selgitus');
 answers=b.ui.recordSet().answers;assert.equal(answers.length,1);assert.equal(answers[0].entryFresh,true);
 assert.equal(answers[0].text,'First thought continued');assert.equal(b.ui.slot(b.args),'');
 assert.equal(b.ui.finish(id,'attempt to overwrite','en-GB','lesson').text,answers[0].text);
 assert.equal(b.ui.recordSet().answers.length,1);
});
test('Later parks the entry; history re-entry is retrospective even if earlier teaching is unknown',()=>{
 const b=testBrowser(),html=b.ui.slot(b.args);b.mount(html);const id=b.ui.recordSet().offers[0].id;
 b.click('Jätan hilisemaks');assert.equal(b.ui.slot(b.args),'');b.mount('study-teachback-home');
 assert.match(b.find('a').href,/progress\.html\?teachback=/);b.root.location.search='?teachback='+encodeURIComponent(id);
 b.mount('study-teachback-library');assert.equal(b.find('details').open,true);
 const area=b.find('textarea');area.value='Later explanation';area.dispatchEvent(new Event('input'));b.click('Salvesta minu selgitus');
 const [answer]=b.ui.recordSet().answers;assert.equal(answer.entryFresh,false);assert.ok(b.find('a','Soovin seda veel harjutada'));
 assert.match(b.find('a','Soovin seda veel harjutada').href,/imat\.html\?practice=xlinked#learn/);
 b.mount('study-teachback-home');assert.equal(b.find('a'),undefined);
});
test('Exposure before saving or missing other history cannot turn an entry into a pre-teaching baseline',()=>{
 const b=testBrowser();b.mount(b.ui.slot(b.args));const id=b.ui.recordSet().offers[0].id;
 b.session.assisted=true;assert.equal(b.ui.finish(id,'helped answer','en-GB','lesson').entryFresh,false);
});
test('Independent dated answers compare only to a valid, earlier entry of the same field, route and response language',()=>{
 const b=testBrowser();b.mount(b.ui.slot(b.args));const entry=b.ui.recordSet().offers[0];
 const before=b.ui.finish(entry.id,'before','en-GB','lesson',Date.now()-3*DAY);
 const current={...before,id:'other',offerId:'other',stage:'consolidation',at:Date.now()};
 assert.equal(b.ui.prior(current,[before]).id,before.id);
 for(const edit of [{group:'other'},{module:'basics'},{lang:'et-EE'},{entryFresh:false},{at:current.at+1}])assert.equal(b.ui.prior(current,[{...before,...edit}]),null);
 assert.equal(b.ui.practiceLink({...current,concept:'//bad.example'}),null);
});
test('Failed saves keep the editable draft and never create a completed history entry',()=>{
 const b=testBrowser();b.mount(b.ui.slot(b.args));const area=b.find('textarea');
 area.value='Draft';b.setFailure(true);area.dispatchEvent(new Event('input'));b.click('Salvesta minu selgitus');
 assert.equal(area.value,'Draft');assert.equal(b.ui.recordSet().answers.length,0);
 assert.ok(b.flat().some(n=>n.textContent?.includes('Salvestamine ei õnnestunud')));
 b.setFailure(false);b.mount(b.ui.slot(b.args));assert.equal(b.find('textarea').value,'Draft');
});
test('A prior true entry stays concealed in the archive while composing a later repair, then both dated explanations appear',()=>{
 const b=testBrowser(),now=Date.now(),start=now-4*DAY;
 b.session.startedAt=start;b.mount(b.ui.slot({...b.args,now:start}));
 const entry=b.ui.recordSet().offers[0];
 b.ui.finish(entry.id,'Earlier thought as originally written.','en-GB','lesson',start+1000);
 Object.assign(b.session,{stage:'done',correct:false,answeredAt:start+2000,completedAt:start+4000});
 const repairSession={...b.session,id:'i-2',startedAt:now-3000,answeredAt:now-2000,completedAt:now-1000};
 b.state.sessions.push(repairSession);const repair=b.ui.slot({...b.args,session:repairSession,now});
 assert.ok(repair);b.mount(repair);assert.equal(b.ui.recordSet().offers.length,2);
 b.mount('study-teachback-library');
 assert.equal(b.flat().some(n=>n.textContent==='Earlier thought as originally written.'),false);
 const edit=b.find('textarea');edit.value='Later thought in my words.';edit.dispatchEvent(new Event('input'));b.click('Salvesta minu selgitus');
 const set=b.ui.recordSet();assert.equal(set.answers.length,2);
 assert.equal(set.answers.some(a=>a.stage==='repair'&&a.text==='Later thought in my words.'&&a.at>start+DAY),true);
 assert.ok(b.find('p','Earlier thought as originally written.'));assert.ok(b.find('p','Later thought in my words.'));
 assert.ok(b.find('a','Soovin seda veel harjutada'));assert.deepEqual(Object.keys(b.state.cards),[]);
});
test('After saving, a learner can practise an actual related concept on the same route',()=>{
 const b=testBrowser();b.root.IMAT_CONTENT={concepts:[{id:'xlinked',title:'Current topic'},{id:'autosomal',title:'Autosomal inheritance'},{id:'mitosis',title:'Unrelated'},{id:'fake',title:'Unknown'}]};
 const html=b.ui.slot(b.args);b.mount(html);assert.equal(b.find('a','Autosomal inheritance'),undefined);
 const field=b.find('textarea');field.value='My explanation';field.dispatchEvent(new Event('input'));b.click('Salvesta minu selgitus');
 assert.ok(b.find('summary','Mida tahaksid veel harjutada?'));assert.equal(b.find('a','Autosomal inheritance').href,'./imat.html?practice=autosomal#learn');
 assert.equal(b.find('a','Unrelated'),undefined);assert.equal(b.find('a','Unknown'),undefined);
});
function pairedBiologyBrowser(){
 const b=testBrowser(),r=b.root;
 r.ImatEngine=require('../src/imat-engine.js');r.IMAT_CONTENT=require('../src/imat-english.js')(require('../src/imat-content.js'));
 r.BasicsEngine=require('../src/basics-engine.js');r.BASICS_CONTENT=require('../src/basics-content.js');
 const s=r.ImatEngine.fresh(),bs=r.BasicsEngine.fresh(),now=Date.now();
 r.StudySync.storage.getItem=k=>JSON.stringify(k===r.ImatEngine.KEY?s:bs);
 r.PocketSync={diagnostics:()=>({connected:true,lastAcknowledged:now})};
 function check(at,right){
  const E=r.ImatEngine,B=r.IMAT_CONTENT;
  const a=E.start(s,B,at,'xlinked');
  a.selected=E.question(B,a).answer;a.confidence='sure';E.submit(s,B,at+1);E.beginRetry(s);
  const key=E.retryQuestion(B,a).answer;a.retrySelected=right?key:(key+1)%5;
  E.retry(s,B,at+2);E.stop(s);assert.equal(a.checkCorrect,right);
 }
 return {b,r,s,bs,now,check};
}
test('Paired home offers one optional repair from two pre-install misses on different days without touching biology data',()=>{
 const {b,r,s,now,check}=pairedBiologyBrowser();check(now-2*DAY,false);check(now-DAY,false);
 const original=JSON.stringify(s);b.mount('study-teachback-home');
 let set=b.ui.recordSet();assert.equal(set.offers.length,1);const [o]=set.offers;
 assert.deepEqual([o.fromHistory,o.module,o.concept,o.stage],[true,'imat','xlinked','repair']);
 assert.ok(b.find('a').href.includes('progress.html?teachback='));assert.equal(set.answers.length,0);
 r.dispatchEvent(new Event('backup-ready'));r.dispatchEvent(new Event('backup-changed'));assert.equal(b.ui.recordSet().offers.length,1);
 assert.equal(JSON.stringify(s),original);
 // If a newer synced session resolves it before the optional response is started,
 // the stale suggestion quietly disappears and cannot be issued a second time.
 check(now-5000,true);r.dispatchEvent(new Event('backup-changed'));
 set=b.ui.recordSet();assert.equal(set.offers.length,1);assert.equal(set.offers[0].skipped,true);assert.equal(b.find('a'),undefined);
});
test('Home cannot seed a stale, corrected, demo, unpaired or unreadable history',()=>{
 for(const reason of ['stale','corrected','demo','unpaired','unreadable','one-day']){
  const {b,r,now,check}=pairedBiologyBrowser();
  check(now-(reason==='stale'?9:2)*DAY,false);check(now-(reason==='one-day'?2:1)*DAY+1000,false);
  if(reason==='corrected')check(now-5000,true);
  if(reason==='demo')r.location.search='?demo';
  if(reason==='unpaired')r.PocketSync.diagnostics=()=>({connected:false});
  if(reason==='unreadable'){const get=r.StudySync.storage.getItem;r.StudySync.storage.getItem=k=>k===r.BasicsEngine.KEY?'broken':get(k);}
  b.mount('study-teachback-home');assert.equal(b.ui.recordSet().offers.length,0,reason);
 }
});
