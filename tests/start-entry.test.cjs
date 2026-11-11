const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const SOURCE=fs.readFileSync('src/start-entry.js','utf8'),BASE='https://example.test/study-pocket/';
const OLD='1111111111111111',LATEST='2222222222222222',NEWER='3333333333333333';
class Emitter{
 constructor(){this.listeners=new Map();}
 addEventListener(type,fn){const listeners=this.listeners.get(type)||new Set();listeners.add(fn);this.listeners.set(type,listeners);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 emit(type){for(const fn of [...this.listeners.get(type)||[]])fn();}
}
async function run({active=OLD,waiting=LATEST,offline=false,networkFailure=false,refusal=null,replaceWaiting=false,publishedAfter=LATEST,core=true,privateURL=false,fresh=false,registrationFailure=false}={}){
 const sw=new Emitter(),reg=new Emitter(),messages=[],fetches=[],navigations=[],historyCalls=[];
 let registerCalls=0,updateCalls=0,storageAccesses=0;
 class Worker extends Emitter{
  constructor(release,state='activated'){super();this.release=release;this.state=state;}
  postMessage(data,ports){
   messages.push({release:this.release,...data});
   if(data.type==='status')ports[0].postMessage({release:this.release,core});
   if(data.type==='activate-from-start'){
    if(refusal)return ports[0].postMessage({error:refusal});
    reg.active=this;reg.waiting=null;sw.controller=this;this.state='activated';sw.emit('controllerchange');
    ports[0].postMessage({ok:true,release:this.release});
   }
  }
 }
 reg.active=active?new Worker(active):null;reg.waiting=waiting?new Worker(waiting,'installed'):null;reg.installing=null;sw.controller=reg.active;
 reg.update=async()=>{
  updateCalls++;
  if(replaceWaiting){const worker=new Worker(LATEST,'installing');reg.installing=worker;reg.emit('updatefound');setImmediate(()=>{reg.waiting=worker;reg.installing=null;worker.state='installed';worker.emit('statechange');});}
  if(fresh){const worker=new Worker(LATEST,'installing');reg.installing=worker;setImmediate(()=>{reg.active=worker;reg.installing=null;worker.state='activated';worker.emit('statechange');sw.controller=worker;sw.emit('controllerchange');});}
 };
 sw.register=async(url,options)=>{registerCalls++;assert.equal(url,BASE+'backup-sw.js');assert.equal(options.scope,BASE);assert.equal(options.updateViaCache,'none');if(registrationFailure)throw Error('registration_failed');return reg;};
 const nodes={'start-state':{textContent:'Avan õppimist…'},'start-fallback':{hidden:true},'start-recheck':{hidden:true,disabled:false}};
 class Channel{constructor(){this.port1={onmessage:null,close(){}};this.port2={postMessage:data=>this.port1.onmessage?.({data})};}}
 const context={navigator:{serviceWorker:sw,onLine:!offline},document:{getElementById:id=>nodes[id]},location:{href:BASE+'start.html'+(privateURL?'?token=private#pair=private':''),pathname:'/study-pocket/start.html',replace:url=>navigations.push(url)},history:{replaceState:(_state,_title,url)=>historyCalls.push(url)},URL,AbortController,MessageChannel:Channel,setTimeout,clearTimeout,
  fetch:async(url,options)=>{fetches.push({url,options});assert.equal(url,BASE+'release.json');assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');if(networkFailure)throw Error('offline');return {ok:true,redirected:false,url,json:async()=>({release:fetches.length===1?LATEST:publishedAfter})};}};
 for(const key of ['localStorage','sessionStorage','indexedDB','caches'])Object.defineProperty(context,key,{get(){storageAccesses++;throw Error('Entry touched learner storage: '+key);}});
 vm.createContext(context);await vm.runInContext(SOURCE,context);
 return {reg,sw,messages,fetches,navigations,historyCalls,registerCalls,get updateCalls(){return updateCalls;},storageAccesses,nodes,allowActivation(){refusal=null;},recheck:()=>nodes['start-recheck'].onclick()};
}
test('a current complete controller opens study directly without activation or another click',async()=>{
 const h=await run({active:LATEST,waiting:null});assert.deepEqual(h.navigations,[BASE+'index.html']);assert.equal(h.updateCalls,0);assert.equal(h.messages.filter(x=>x.type==='activate-from-start').length,0);assert.equal(h.storageAccesses,0);
});
test('cold entry checks the waiting release and uses only guarded activation before opening',async()=>{
 const h=await run();assert.deepEqual(h.navigations,[BASE+'index.html']);assert.equal(h.fetches.length,2);assert.equal(h.updateCalls,1);assert.deepEqual(h.messages.filter(x=>x.type.startsWith('activate')).map(x=>x.type),['activate-from-start']);assert.equal(h.sw.controller.release,LATEST);assert.equal(h.storageAccesses,0);
});
test('another open study window prevents activation and exposes optional existing study links',async()=>{
 const h=await run({refusal:'other_windows'});assert.deepEqual(h.navigations,[]);assert.equal(h.sw.controller.release,OLD);assert.equal(h.nodes['start-fallback'].hidden,false);assert.match(h.nodes['start-state'].textContent,/teises sakis/);assert.match(h.nodes['start-state'].textContent,/pooleliolev töö/);assert.equal(h.nodes['start-recheck'].hidden,false);assert.equal(h.storageAccesses,0);
});
test('explicit recheck can open after the other tab closes without installing again',async()=>{
 const h=await run({refusal:'other_windows'});assert.equal(h.updateCalls,1);h.allowActivation();await h.recheck();assert.deepEqual(h.navigations,[BASE+'index.html']);assert.equal(h.updateCalls,1);assert.equal(h.messages.filter(x=>x.type==='activate-from-start').length,2);
});
test('an old waiting worker is never activated or accepted as the published current version',async()=>{
 const h=await run({waiting:OLD});assert.deepEqual(h.navigations,[]);assert.equal(h.messages.filter(x=>x.type.startsWith('activate')).length,0);assert.equal(h.nodes['start-fallback'].hidden,false);assert.equal(h.updateCalls,1);
});
test('an old waiting worker can be superseded by a fully installed current worker',async()=>{
 const h=await run({waiting:OLD,replaceWaiting:true});assert.deepEqual(h.navigations,[BASE+'index.html']);assert.equal(h.messages.filter(x=>x.type==='activate-from-start')[0].release,LATEST);
});
test('initial installation waits for controller ownership before opening the verified pack',async()=>{
 const h=await run({active:null,waiting:null,fresh:true});assert.deepEqual(h.navigations,[BASE+'index.html']);assert.equal(h.sw.controller,h.reg.active);assert.equal(h.messages.filter(x=>x.type.startsWith('activate')).length,0);
});
test('offline and network errors offer existing study without automatic navigation or retries',async()=>{
 for(const options of [{offline:true},{networkFailure:true}]){const h=await run(options);assert.deepEqual(h.navigations,[]);assert.equal(h.registerCalls,0);assert.equal(h.nodes['start-fallback'].hidden,false);assert.ok(h.fetches.length<=1);assert.equal(h.storageAccesses,0);}
});
test('incomplete cache, registration failure and a changed publication fail without a retry loop',async()=>{
 for(const options of [{core:false},{registrationFailure:true},{publishedAfter:NEWER}]){const h=await run(options);assert.deepEqual(h.navigations,[]);assert.equal(h.nodes['start-fallback'].hidden,false);assert.ok(h.fetches.length<=2);assert.ok(h.updateCalls<=1);assert.equal(h.storageAccesses,0);}
});
test('private query/hash are removed and never copied to registration, network or study URLs',async()=>{
 const h=await run({privateURL:true});assert.deepEqual(h.historyCalls,['/study-pocket/start.html']);assert.deepEqual(h.navigations,[BASE+'index.html']);assert.ok(h.fetches.every(x=>x.url===BASE+'release.json'));
});
test('entry is self-contained and loads no learner, sync, pairing or lesson scripts',()=>{
 const html=fs.readFileSync('src/start.html','utf8');assert.deepEqual([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]),['./start-entry.js']);assert.match(html,/name="referrer" content="no-referrer"/);assert.match(html,/href="\.\/index.html"/);assert.match(html,/href="\.\/repair.html"/);assert.doesNotMatch(SOURCE,/localStorage|sessionStorage|indexedDB|BackupStore|PocketSync|\.unregister\(|caches\./);
});
