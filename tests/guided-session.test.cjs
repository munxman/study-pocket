const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/guided-session-model.js'),G=require('../src/guided-session.js');
const E=require('../src/imat-engine.js'),B=require('../src/imat-english.js')(require('../src/imat-content.js'));
const NOW=Date.UTC(2026,10,6,10);
function store(){const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),data};}
function complete(s,time=NOW,right=true,check=true){
 const a=E.active(s);if(a.stage==='lesson'){E.expose(s,time);a.stage='question';}
 const q=E.question(B,a);a.selected=right?q.answer:(q.answer+1)%5;a.confidence='sure';E.submit(s,B,time+1);E.beginRetry(s);
 const retry=E.retryQuestion(B,a);a.retrySelected=check?retry.answer:(retry.answer+1)%5;E.retry(s,B,time+2);return a;
}
function fixture(){
 const state=E.fresh(),storage=store();
 for(const ago of [7,4]){E.start(state,B,NOW-ago*E.DAY,'xlinked');complete(state,NOW-ago*E.DAY,false,false);E.stop(state);}
 E.start(state,B,NOW,'enzyme');
 const make=(query='guided=8')=>G.prepare({url:new URL('https://example.test/imat.html?'+query),storage,engine:E,bank:B,state:()=>state,now:()=>NOW});
 return {state,storage,make};
}
test('a guided route preserves unfinished selections and needs a click between all three blocks',()=>{
 const h=fixture(),first=E.active(h.state);first.selected=2;first.confidence='unsure';const route=h.make();route.ensure();
 assert.equal(E.active(h.state).id,first.id);assert.equal(first.selected,2);assert.equal(first.confidence,'unsure');assert.equal(h.state.sessions.length,3);
 complete(h.state);route.sync();assert.equal(route.plan.sessionIds.length,1);
 const reloaded=h.make();reloaded.ensure();assert.equal(E.active(h.state).id,first.id,'reload must not continue automatically');
 assert.ok(reloaded.next());assert.equal(first.moreChosen,true);assert.equal(E.active(h.state).concept,'xlinked');
 complete(h.state);reloaded.sync();assert.equal(reloaded.plan.sessionIds.length,2);
 assert.ok(reloaded.next());const third=E.active(h.state);assert.notEqual(third.concept,'xlinked');assert.notEqual(third.concept,'enzyme');
 assert.notEqual(B.concepts.find(c=>c.id===third.concept).area,B.concepts.find(c=>c.id==='xlinked').area);
 complete(h.state);reloaded.sync();assert.equal(reloaded.status,'finished');
 const count=h.state.sessions.length;assert.equal(reloaded.next(),false);assert.equal(h.state.sessions.length,count);
 assert.equal(M.summary(reloaded.plan,h.state).completed,3);assert.match(reloaded.finalSummary(),/mitte mõõdetud õppimisaeg/);
 assert.equal(E.restore(h.state,B).sessions.length,count,'all answers retain canonical schema');
});
test('worked help is optional and opening it prevents independent delayed-recall credit',()=>{
 for(const withHelp of [false,true]){
   const h=fixture(),route=h.make();route.ensure();complete(h.state);route.next();const a=E.active(h.state);
   assert.equal(a.concept,'xlinked');assert.equal(a.assisted,false);assert.match(route.help(B.concepts.find(c=>c.id===a.concept),a),/Vaatan läbimõeldud näidet/);
   if(withHelp){assert.ok(route.showHelp());assert.equal(a.assisted,true);assert.equal(h.make().plan.helpSeen.includes(a.id),true);}
   complete(h.state);assert.equal(a.delayedProbe,!withHelp);
 }
});
test('pause and early finish preserve the active stage, with no synthetic block credit',()=>{
 const h=fixture(),route=h.make();route.ensure();const first=E.active(h.state);route.setAim(12);route.pause();
 const restored=h.make();restored.ensure();assert.equal(restored.status,'paused');assert.equal(restored.plan.aim,12);assert.equal(h.state.sessions.length,3);
 assert.ok(restored.resume());assert.equal(E.active(h.state).id,first.id);restored.finish();
 assert.equal(first.closed,false);assert.equal(first.completedAt,0);assert.equal(M.summary(restored.plan,h.state).completed,0);
 assert.equal(h.make().status,'finished');assert.equal(h.state.sessions.length,3);
});
test('a previously completed block is not awarded to a newly started plan',()=>{
 const h=fixture();const old=complete(h.state);const route=h.make();route.ensure();
 assert.notEqual(E.active(h.state).id,old.id);assert.deepEqual(route.plan.sessionIds,[E.active(h.state).id]);assert.equal(M.summary(route.plan,h.state).completed,0);assert.equal(old.moreChosen,false);
});
test('corrupt or stale plans never replace unfinished canonical work',()=>{
 for(const payload of ['{oops',JSON.stringify({...M.create(8,NOW),sessionIds:['missing']})]){
   const h=fixture(),a=E.active(h.state);h.storage.setItem(M.KEY,payload);const route=h.make();route.ensure();assert.equal(E.active(h.state).id,a.id);assert.equal(a.closed,false);assert.deepEqual(route.plan.sessionIds,[a.id]);
 }
});
test('explicit practice and ordinary routes retain priority over a saved guided plan',()=>{
 const h=fixture();h.make().ensure();assert.equal(h.make('practice=xlinked&guided=8'),null);assert.equal(h.make(''),null);assert.equal(h.make('guided=20'),null);
});
test('weak selection counts sessions, respects the one-day cooldown and adds variety',()=>{
 const h=fixture(),route=h.make();route.ensure();complete(h.state);
 assert.equal(M.weaknesses(h.state,B,NOW).find(x=>x.concept.id==='xlinked').misses,2);
 h.state.cards.xlinked.lastExposure=NOW-100;
 route.next();assert.notEqual(E.active(h.state).concept,'xlinked');
});
test('a different active session arriving through sync is preserved and suspends the plan',()=>{
 const h=fixture(),route=h.make();route.ensure();E.stop(h.state);const other=E.start(h.state,B,NOW,'nephron-filtration');
 route.sync();assert.equal(route.conflict,true);assert.equal(route.status,'paused');assert.equal(route.resume(),false);assert.equal(route.next(),false);assert.equal(E.active(h.state).id,other.id);assert.equal(other.closed,false);
});
test('an older unassisted snapshot cannot turn a visibly reopened example into delayed credit',()=>{
 const h=fixture(),route=h.make();route.ensure();complete(h.state);route.next();route.showHelp();
 const a=E.active(h.state);a.assisted=false;h.state.cards[a.concept].lastExposure=NOW-4*E.DAY;
 let saved=0;const restored=G.prepare({url:new URL('https://example.test/imat.html?guided=8'),storage:h.storage,engine:E,bank:B,state:()=>h.state,now:()=>NOW,onExposure:()=>saved++});
 restored.ensure();assert.equal(a.assisted,true);assert.equal(saved,1);complete(h.state);assert.equal(a.delayedProbe,false);
});
