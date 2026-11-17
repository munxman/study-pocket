const test=require('node:test'),assert=require('node:assert/strict');
const N=require('../src/medical-next.js'),M=require('../src/medical-plan.js'),Q=require('../src/quant-engine.js'),C=require('../src/chemistry-content.js'),I=require('../src/ielts-engine.js');
const NOW=Date.parse('2026-11-18T10:00:00Z'),DAY=86400000;
const deps={MedicalPlan:M,QuantEngine:Q,ChemistryContent:C};
const english=()=>{const s=I.fresh(),a=I.start(s,{kind:'writing',taskIds:['synthetic'],title:'Synthetic'},NOW-1000);a.texts={synthetic:'My own answer.'};I.submit(s,[],NOW-500);return s;};
const store=(modules,prefs={})=>({getItem:k=>JSON.stringify(k==='opitasku-medical-guidance-v1'?prefs:modules[k]??null),setItem(){throw Error('No write allowed');}});
test('finished IELTS links straight to chemistry, then chemistry links to biology without creating sessions',()=>{
 const en=english(),modules={[I.KEY]:en},s=store(modules),before=structuredClone(modules);
 const next=N.choose(s,I.KEY,en,'en',NOW,deps);assert.match(next.href,/subject=chemistry.*next=1/);assert.equal(next.label,'Next: one chemistry skill');
 const chem=Q.fresh(),a=Q.start(chem,C,NOW-400);let q=Q.topic(C,a).questions[a.questionIndex];a.selected=q.answer;a.confidence='sure';Q.submit(chem,C,NOW-300);Q.beginCheck(chem);q=Q.topic(C,a).questions[a.checkIndex];a.checkSelected=q.answer;Q.check(chem,C,NOW-100);
 const frozen=structuredClone(chem),bio=N.choose(s,C.key,chem,'et',NOW,deps);assert.match(bio.href,/imat\.html\?guided=8/);assert.deepEqual(chem,frozen);assert.deepEqual(modules,before);
});
test('direct continuation respects the same local subject preference as home',()=>{
 const modules={[I.KEY]:english()},s=store(modules),localStorage=store({}, {deferred:{chemistry:NOW+DAY}});
 assert.match(N.choose(s,I.KEY,modules[I.KEY],'en',NOW,{...deps,localStorage}).href,/imat\.html/);
});
test('unreadable newer history falls back to home without writing or deleting work',()=>{
 for(const value of ['broken','{"version":2,"sessions":{}}']){
 const s={getItem:()=>value,setItem(){throw Error('No write');}};
 assert.equal(N.choose(s,I.KEY,english(),'en',NOW,deps).href,'./index.html');
 }
});
