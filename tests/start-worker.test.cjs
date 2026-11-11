const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const SOURCE=fs.readFileSync('src/backup-sw.js','utf8'),BASE='https://example.test/study-pocket/',RELEASE='2222222222222222';
async function guarded({other=[],source={id:'entry',type:'window',url:BASE+'start.html'},live=source,complete=true,release=RELEASE,includesSource=true,type='activate-from-start',natural=false,activateAfterMessage=false,lateOther=[],lateLive}={}){
 let activations=0,claims=0,claimsAfterNatural=null,enumeration=null;const events={},responses=[];
 const clients={get:async id=>id===source?.id?live:null,matchAll:async options=>{enumeration=options;return [...includesSource&&live?[live]:[],...other];},claim:async()=>{claims++;}};
 const context={URL,Response,self:{registration:{scope:BASE},clients,skipWaiting:async()=>{activations++;},addEventListener:(name,fn)=>events[name]=fn},caches:{open:async()=>({match:async url=>complete&&url===BASE+'__complete__'?new Response(RELEASE):undefined})}};
 vm.createContext(context);vm.runInContext(SOURCE.replace('__RELEASE__',JSON.stringify(RELEASE)).replace('__PACK__','[]'),context);
 if(natural){let pending;events.activate({waitUntil:promise=>pending=promise});await pending;claimsAfterNatural=claims;}
 const pending=[];events.message({data:{type,release},source,ports:[{postMessage:value=>responses.push(value)}],waitUntil:promise=>pending.push(promise)});await Promise.all(pending);
 if(activateAfterMessage){other=[...other,...lateOther];if(lateLive!==undefined)live=lateLive;let pending;events.activate({waitUntil:promise=>pending=promise});await pending;}
 return {activations,claims,claimsAfterNatural,response:responses[0],enumeration};
}
test('only a live sole start window can activate its verified complete release',async()=>{
 const h=await guarded();assert.equal(h.activations,1);assert.equal(h.response.ok,true);assert.equal(h.response.release,RELEASE);assert.equal(h.enumeration.type,'window');assert.equal(h.enumeration.includeUncontrolled,true);
});
test('any other app-scope window blocks automatic activation, including another entry or hidden uncontrolled tab',async()=>{
 for(const path of ['index.html','imat.html?guided=8','start.html','geometry-sprint.html','']){
  const h=await guarded({other:[{id:'other',type:'window',url:BASE+path,visibilityState:'hidden',controlled:false}]});assert.equal(h.activations,0);assert.equal(h.response.error,'other_windows');
 }
});
test('unrelated origin and out-of-scope pages do not block the sole study entry',async()=>{
 const h=await guarded({other:[{id:'main',type:'window',url:'https://example.test/'},{id:'elsewhere',type:'window',url:'https://other.test/study-pocket/index.html'}]});assert.equal(h.activations,1);
});
test('a lesson, nonwindow source, query-bearing entry, missing or changed client cannot request cold activation',async()=>{
 for(const options of [
  {source:{id:'entry',type:'window',url:BASE+'index.html'}},
  {source:{id:'entry',type:'worker',url:BASE+'start.html'}},
  {source:{id:'entry',type:'window',url:BASE+'start.html?private=1'}},
  {source:null},{live:null},{live:{id:'entry',type:'window',url:BASE+'index.html'}},{includesSource:false}
 ]){const h=await guarded(options);assert.equal(h.activations,0);assert.equal(h.response.error,'invalid_entry');}
});
test('incomplete packs and wrong requested releases cannot be activated from entry',async()=>{
 for(const options of [{complete:false},{release:'1111111111111111'}]){const h=await guarded(options);assert.equal(h.activations,0);assert.equal(h.response.error,'release_mismatch');}
});
test('the existing explicit manual activation message remains unchanged',async()=>{
 const h=await guarded({type:'activate',source:null,complete:false,other:[{id:'study',url:BASE+'index.html'}]});assert.equal(h.activations,1);assert.equal(h.response.ok,true);assert.equal(h.enumeration,null);
});
test('natural first activation leaves all clients alone when a start entry exists and another app tab blocks its claim',async()=>{
 const h=await guarded({natural:true,type:'claim-from-start',other:[{id:'other',type:'window',url:BASE+'imat.html',controlled:false}]});assert.equal(h.claimsAfterNatural,0);assert.equal(h.claims,0);assert.equal(h.activations,0);assert.equal(h.response.error,'other_windows');
});
test('natural first activation defers ownership until the sole entry passes its guarded claim',async()=>{
 const h=await guarded({natural:true,type:'claim-from-start'});assert.equal(h.claimsAfterNatural,0);assert.equal(h.claims,1);assert.equal(h.activations,0);assert.equal(h.response.ok,true);
});
test('ordinary activation without a cold entry preserves existing claim behavior',async()=>{
 const h=await guarded({natural:true,source:null,type:'none',other:[{id:'lesson',type:'window',url:BASE+'imat.html'}]});assert.equal(h.claimsAfterNatural,1);assert.equal(h.claims,1);
});
test('guarded claiming enforces the same source and verified-release checks as guarded activation',async()=>{
 for(const options of [{complete:false},{release:'1111111111111111'},{source:null},{live:null},{source:{id:'entry',type:'window',url:BASE+'start.html?private=1'}}]){const h=await guarded({type:'claim-from-start',...options});assert.equal(h.claims,0);assert.equal(h.activations,0);assert.ok(h.response.error);}
});
test('an older cached bootstrap needs only its accepted activation request to gain control after revalidation',async()=>{
 const h=await guarded({activateAfterMessage:true});assert.equal(h.response.ok,true);assert.equal(h.activations,1);assert.equal(h.claims,1);
});
test('a second app window appearing after accepted activation blocks the compatibility claim',async()=>{
 const h=await guarded({activateAfterMessage:true,lateOther:[{id:'late',type:'window',url:BASE+'imat.html',controlled:false}]});assert.equal(h.response.ok,true);assert.equal(h.activations,1);assert.equal(h.claims,0);
});
test('compatibility claiming rechecks that the accepted entry still exists at its exact URL',async()=>{
 for(const lateLive of [null,{id:'entry',type:'window',url:BASE+'index.html'}]){const h=await guarded({activateAfterMessage:true,lateLive});assert.equal(h.response.ok,true);assert.equal(h.claims,0);}
});
