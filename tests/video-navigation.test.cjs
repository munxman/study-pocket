const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const B=require('../src/video-content.js'),E=require('../src/video-engine.js'),L=require('../src/video-links.js'),T=require('../src/today-plan.js');
const now=Date.UTC(2026,10,9,20),id='bio-gas-diffusion';
function screen(search='',initial={}){
 const rows=new Map(Object.entries(initial).map(([k,v])=>[k,JSON.stringify(v)])),events={},main={innerHTML:'',focus(){},addEventListener:(k,f)=>events[k]=f};
 const store={getItem:k=>rows.get(k)||null,setItem:(k,v)=>rows.set(k,v)};class Clock extends Date{static now(){return now;}}
 const c={VIDEO_CONTENT:B,VideoEngine:E,VideoLinks:L,StudySync:{storage:store,subscribe(){}},document:{getElementById:()=>main},location:{search},history:{replaceState(){}},navigator:{onLine:true},URLSearchParams,Date:Clock,addEventListener(){}};c.window=c;vm.runInNewContext(fs.readFileSync(require.resolve('../src/videos.js'),'utf8'),c);
 return {main,state:()=>JSON.parse(store.getItem(E.MODULE_ID)),start:videoId=>events.click({target:{closest:s=>s==='[data-start]'?{dataset:{start:videoId}}:null}})};
}
test('a deliberate library explanation choice opens help, without opening external video or recording an answer',()=>{
 const h=screen();assert.match(h.main.innerHTML,/Vaatan selgitust ja videot/);h.start(id);const a=E.active(h.state());assert.equal(a.assisted,true);assert.equal(a.answeredAt,0);assert.equal(a.openedAt,0);assert.match(h.main.innerHTML,/Avan video YouTube/);assert.match(h.main.innerHTML,/Teen|Kontrollin mõtet/);
});
test('a due library return keeps the fresh later question before help',()=>{
 const s=E.fresh(),a=E.start(s,B,now-2*E.DAY,id);a.selected=0;a.confidence='sure';E.submit(s,B,now-2*E.DAY);const h=screen('',{[E.MODULE_ID]:s});h.start(id);const next=E.active(h.state());assert.equal(next.assisted,false);assert.equal(next.delayedEligibleAtStart,true);assert.notEqual(next.questionId,a.questionId);assert.doesNotMatch(h.main.innerHTML,/data-video-open/);
});
test('return resumes the saved quantitative concept only when it is still unfinished',()=>{
 const key='hendrik-physics-v1',search='?video=i12-physics-photon-energy&help=1&from=physics&concept=atomic_photons';
 const h=screen(search,{[key]:{sessions:[{concept:'atomic_photons',stage:'check',completedAt:0}],cards:{}}});assert.match(h.main.innerHTML,/href="\.\/quant.html\?subject=physics&concept=atomic_photons"/);
 const done=screen(search,{[key]:{sessions:[{concept:'atomic_photons',stage:'done',completedAt:now-1}],cards:{}}});assert.match(done.main.innerHTML,/href="\.\/quant.html\?subject=physics"/);assert.doesNotMatch(done.main.innerHTML,/subject=physics&concept=/);
});
test('Later snoozes only that evidence, with expiry and no learning mutation',()=>{
 const h={videoId:id,evidenceAt:now-100},prefs={deferVideo:{...h,until:now+E.DAY}},before=structuredClone(prefs);
 assert.equal(T.visibleHelp(h,prefs,now),null);assert.deepEqual(T.visibleHelp(h,prefs,now+E.DAY),h);assert.deepEqual(T.visibleHelp({...h,evidenceAt:now},prefs,now),{...h,evidenceAt:now});assert.deepEqual(prefs,before);
});
