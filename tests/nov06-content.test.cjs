const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {createHash}=require('node:crypto');
const E=require('../src/imat-engine.js');

function load(){
 const context={module:{exports:{}}};context.globalThis=context;vm.createContext(context);
 for(const file of ['imat-content.js','imat-english.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),context);
 return {bank:context.IMAT_CONTENT,apply:context.module.exports};
}
const {bank:B}=load();
const added={division:10,autosomal:10,xlinked:10,'gas-exchange':7};
const legacyLengths={ribosome:3,prokaryote:3,biomolecules:3,transport:3,osmosis:3,enzyme:3,krebs:3,glycolysis:3,photosynthesis:3,'dna-rna':3,translation:3,replication:3,division:10,mendel:3,autosomal:10,xlinked:10,homeostasis:3,neuromuscular:3,circulation:3,adh:3,immunity:3,'glucose-control':3,selection:3,biotech:3,'gas-exchange':7,'digestion-absorption':7,'nephron-filtration':7,'nerve-signals':7,'cell-cycle-control':7,'respiration-coupling':7};
const concept=id=>B.concepts.find(c=>c.id===id);
const item=(id,role)=>concept(id).questions.find(q=>q.id===`${id}-nov06-${role}`);
const key=(id,role)=>{const q=item(id,role);return q.options[q.answer].en;};

test('All 135 historical question meanings, option order and keys are preserved at their saved indices',()=>{
 const historical=B.concepts.map(c=>({id:c.id,questions:c.questions.slice(0,legacyLengths[c.id]).map(q=>({id:q.id,prompt:q.prompt,options:q.options.map(o=>o.en),answer:q.answer}))}));
 assert.equal(historical.reduce((n,c)=>n+c.questions.length,0),135);
 assert.equal(createHash('sha256').update(JSON.stringify(historical)).digest('hex'),'4a2702af5a73d49a144808e3f650a6c1497907483782283d0c027b7b040002ed');
});

test('Twelve original English questions append to the four existing topics and role pools once',()=>{
 assert.equal(B.concepts.length,30);
 assert.equal(B.concepts.reduce((n,c)=>n+c.questions.length,0),147);
 const ids=B.concepts.flatMap(c=>c.questions.map(q=>q.id));assert.equal(new Set(ids).size,147);
 for(const [id,base] of Object.entries(added)){
  const c=concept(id);assert.equal(c.questions.length,base+3);
  for(const [i,role] of ['probe','support','transfer'].entries()){
   const q=c.questions[base+i];assert.equal(q.id,`${id}-nov06-${role}`);
   assert.equal(q.practiceRelease,'2026-11-06');assert.equal(q.language,'en');
   assert.equal(q.options.length,5);assert.equal(new Set(q.options.map(o=>o.en)).size,5);assert.ok(q.options[q.answer]);
   assert.ok(c[role+'Questions'].includes(base+i));
   for(const other of ['probe','support','transfer'].filter(r=>r!==role))assert.ok(!c[other+'Questions'].includes(base+i));
  }
 }
 const {bank,apply}=load(),before=JSON.stringify(bank);apply(bank);assert.equal(JSON.stringify(bank),before,'reapplying English support cannot duplicate new questions or pools');
});

test('Worked examples explain the four mechanisms without changing question keys or promising mastery',()=>{
 for(const id of Object.keys(added)){
  const example=concept(id).guidedExample;
  assert.equal(typeof example.title,'string');assert.equal(example.paragraphs.length,3);
  assert.ok(example.paragraphs.every(p=>typeof p==='string'&&p.length>60));
  assert.ok(example.promptToThink.length>20);
  assert.doesNotMatch(JSON.stringify(example),/guarantee|mastered|exam.ready/i);
 }
 assert.match(concept('division').sourceExtra,/10-2-the-cell-cycle$/);
 assert.match(concept('autosomal').sourceExtra,/12-3-laws-of-inheritance$/);
 assert.match(concept('gas-exchange').source,/39-2-gas-exchange-across-respiratory-surfaces$/);
});

function cross(maternal,paternal){return maternal.flatMap(a=>paternal.map(b=>[a,b]));}
test('Inheritance answer keys agree with gamete enumeration and distinct denominators',()=>{
 const recessive=cross(['A','a'],['A','a']);
 const carriers=recessive.filter(([a,b])=>a!==b),unaffected=recessive.filter(([a,b])=>a==='A'||b==='A');
 assert.equal(key('autosomal','probe'),'Aa and aA only');
 assert.equal(carriers.length,2);assert.equal(unaffected.length,3);
 assert.equal(key('autosomal','transfer'),`${carriers.length/4} and ${unaffected.length/4}`.replace('0.5','1/2').replace('0.75','3/4'));
 assert.equal(key('autosomal','support'),'Only Aa can pass the recessive a allele to an offspring');
 const offspring=cross(['r','r'],['R','Y']),sons=offspring.filter(([,b])=>b==='Y'),affected=sons.filter(([a])=>a==='r');
 assert.equal(affected.length/sons.length,1);assert.equal(affected.length/offspring.length,1/2);
 assert.equal(key('xlinked','transfer'),'1 and 1/2');
 assert.equal(key('xlinked','probe'),'Xʳ from the mother and Y from the father');
 assert.equal(key('xlinked','support'),'Y only');
});

test('Division and gas keys distinguish quantity, direction and proportional rate',()=>{
 const beforeS=12,chromatidsPerCopiedChromosome=2,diploidPlant=18;
 assert.equal(key('division','probe'),`${beforeS} chromosomes and ${beforeS*chromatidsPerCopiedChromosome} chromatids`);
 assert.equal(key('division','support'),'Sister chromatids');
 assert.equal(key('division','transfer'),`${diploidPlant} and ${diploidPlant/2}`);
 assert.ok(88>28,'oxygen gradient is from blood into tissue');assert.ok(54>42,'carbon dioxide gradient is from tissue into blood');
 assert.equal(key('gas-exchange','probe'),'Oxygen moves into tissue; carbon dioxide moves into blood');
 assert.ok(46>40,'carbon dioxide gradient is from blood into alveolar air');
 assert.equal(key('gas-exchange','support'),'From blood into alveolar air');
 assert.match(item('gas-exchange','transfer').prompt,/non-zero partial-pressure difference/);
 assert.equal(3/2,1.5);assert.equal(key('gas-exchange','transfer'),'3/2 of the original');
});

test('The adaptive engine reaches every new role and preserves wrong follow-up checks on restore',()=>{
 for(const [id,base] of Object.entries(added)){
  const s=E.fresh(),seen=new Set();
  for(let i=0;i<6;i++){
   const now=Date.UTC(2026,10,6)+i*2*E.DAY,a=E.start(s,B,now,id);
   seen.add(a.questionIndex);a.selected=i<3?E.question(B,a).answer:(E.question(B,a).answer+1)%5;a.confidence=i<3?'sure':'unsure';
   assert.equal(E.submit(s,B,now+1),true);seen.add(a.retryIndex);
   E.beginRetry(s);a.retrySelected=(E.retryQuestion(B,a).answer+1)%5;assert.equal(E.retry(s,B,now+2),true);
   assert.equal(a.stage,'done');assert.equal(a.checkCorrect,false);E.stop(s);
  }
  for(const index of [base,base+1,base+2])assert.ok(seen.has(index),`${id} index ${index} remains reachable`);
  assert.ok(E.restore(s,B).sessions.every(a=>a.checkCorrect===false));
 }
});
