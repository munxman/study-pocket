const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const SOURCE=fs.readFileSync('src/backup-sw.js','utf8'),BASE='https://example.test/study-pocket/',RELEASE='2222222222222222';
async function guarded({other=[],source={id:'entry',type:'window',url:BASE+'start.html'},live=source,complete=true,release=RELEASE,includesSource=true,type='activate-from-start'}={}){
 let activations=0,enumeration=null;const events={},responses=[];
 const clients={get:async id=>id===source?.id?live:null,matchAll:async options=>{enumeration=options;return [...includesSource&&live?[live]:[],...other];},claim:async()=>{}};
 const context={URL,Response,self:{registration:{scope:BASE},clients,skipWaiting:async()=>{activations++;},addEventListener:(name,fn)=>events[name]=fn},caches:{open:async()=>({match:async url=>complete&&url===BASE+'__complete__'?new Response(RELEASE):undefined})}};
 vm.createContext(context);vm.runInContext(SOURCE.replace('__RELEASE__',JSON.stringify(RELEASE)).replace('__PACK__','[]'),context);
 const pending=[];events.message({data:{type,release},source,ports:[{postMessage:value=>responses.push(value)}],waitUntil:promise=>pending.push(promise)});await Promise.all(pending);
 return {activations,response:responses[0],enumeration};
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
