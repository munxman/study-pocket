const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../src/imat-english.js')(require('../src/imat-content.js')),E=require('../src/imat-engine.js');
function screen(){
 const s=E.fresh(),now=Date.now();
 for(const days of [7,4]){
   const a=E.start(s,B,now-days*E.DAY,'xlinked');a.selected=(E.question(B,a).answer+1)%5;a.confidence='sure';E.submit(s,B,now-days*E.DAY+1);E.beginRetry(s);a.retrySelected=(E.retryQuestion(B,a).answer+1)%5;E.retry(s,B,now-days*E.DAY+2);E.stop(s);
 }
 E.start(s,B,now,'enzyme');
 const data=new Map([[E.KEY,JSON.stringify(s)]]),events={},main={innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[]};
 let url=new URL('https://example.test/imat.html?guided=8#learn');
 const location={get search(){return url.search;},get href(){return url.href;},get hash(){return url.hash;},set hash(value){url.hash=value;(events.hashchange||[]).forEach(fn=>fn());}};
 const ctx={IMAT_CONTENT:B,ImatEngine:E,URL,URLSearchParams,location,
   document:{activeElement:null,getElementById:()=>main,addEventListener:(name,fn)=>(events[name]??=[]).push(fn)},
   localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},history:{replaceState(_a,_b,path){url=new URL(path,url);}},
   addEventListener:(name,fn)=>(events[name]??=[]).push(fn),scrollTo(){}};
 ctx.window=ctx;vm.createContext(ctx);
 for(const file of ['guided-session-model.js','guided-session.js','imat.js'])vm.runInContext(fs.readFileSync('src/'+file,'utf8'),ctx);
 return {main,read:()=>JSON.parse(data.get(E.KEY)),click(action,value,kind='coach'){
   const el={dataset:{[kind]:action,value},disabled:false};const ev={target:{closest:selector=>selector===`[data-${kind}]`?el:null}};
   for(const fn of events.click||[])fn(ev);
 },get url(){return url;}};
}
function complete(h){let a=E.active(h.read());if(a.stage==='lesson')h.click('begin');a=E.active(h.read());h.click('select',String(E.question(B,a).answer));h.click('confidence','sure');h.click('submit');h.click('retry');a=E.active(h.read());h.click('retry-select',String(E.retryQuestion(B,a).answer));h.click('retry-submit');}
test('guided UI offers help before the focus question and reaches a finite summary without auto-starting',()=>{
 const h=screen();assert.match(h.main.innerHTML,/1\. plokk kolmest/);assert.match(h.main.innerHTML,/umbes 8 minutit/);
 complete(h);assert.match(h.main.innerHTML,/data-guided="next"/);assert.equal(h.read().sessions.length,3);
 h.click('next',undefined,'guided');assert.equal(E.active(h.read()).concept,'xlinked');
 assert.ok(h.main.innerHTML.indexOf('Vaatan läbimõeldud näidet')<h.main.innerHTML.indexOf('<h1 class="imat-question"'));
 assert.equal(E.active(h.read()).assisted,false);h.click('help',undefined,'guided');assert.equal(E.active(h.read()).assisted,true);
 assert.match(h.main.innerHTML,/selgituse toel harjutamine/);complete(h);h.click('next',undefined,'guided');
 assert.match(h.main.innerHTML,/3\. plokk kolmest/);complete(h);
 assert.match(h.main.innerHTML,/Kolm mõtet läbi töötatud/);assert.doesNotMatch(h.main.innerHTML,/data-guided="next"/);
 assert.match(h.main.innerHTML,/Meenutus oli õige/,'last answer explanation remains visible');assert.equal(h.read().sessions.length,5);
 h.click('free',undefined,'guided');assert.equal(h.url.search,'');assert.doesNotMatch(h.main.innerHTML,/guided-summary/);assert.equal(h.read().sessions.length,6);assert.match(h.main.innerHTML,/data-coach="pause"/,'ordinary free study can still pause');
});
test('pausing preserves the selected response and 12-minute aim is learner-chosen',()=>{
 const h=screen();h.click('begin');h.click('select','2');const a=E.active(h.read());
 h.click('aim-12',undefined,'guided');assert.match(h.main.innerHTML,/umbes 12 minutit/);h.click('pause');
 assert.match(h.main.innerHTML,/Võid siit hiljem jätkata/);h.click('resume');assert.equal(E.active(h.read()).id,a.id);assert.equal(E.active(h.read()).selected,2);assert.match(h.main.innerHTML,/umbes 12 minutit/);
});
