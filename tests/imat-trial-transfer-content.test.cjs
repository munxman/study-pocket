const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const B=require('../src/imat-trial-transfer-content.js');
const old=require('../src/imat-trial-content.js');
const ordinary=require('../src/imat-english.js')(require('../src/imat-content.js'));
const E=require('../src/imat-trial-engine.js');
const key=n=>{const q=B.questions[n-1];return q.options[q.answer];};
const normalise=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('The transfer simulation is a separate original 20-minute biology sample with explicit limits',()=>{
 assert.equal(B.id,'imat-biology-transfer-2026-11-06');assert.notEqual(B.id,old.id);
 assert.equal(B.origin,'original');assert.equal(B.minutes,20);assert.equal(B.questions.length,12);
 assert.match(B.title,/original/i);assert.match(B.label,/not an official or full IMAT/i);
 assert.match(B.description,/uncalibrated/);assert.match(B.description,/cannot establish exam readiness/);
 assert.deepEqual(B.scoring,{correct:1.5,wrong:-0.4,blank:0,maximum:18});
 assert.equal(new Set(B.questions.map(q=>q.id)).size,12);
 assert.deepEqual(B.questions.map(q=>q.number),Array.from({length:12},(_,i)=>i+1));
 for(const q of B.questions){
  assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);assert.ok(q.explanation.length>80);
  assert.equal(q.extension,false);assert.ok(ordinary.concepts.some(c=>c.id===q.concept));
  assert.equal(new URL(q.source).hostname,'openstax.org');
 }
 const frequencies=[0,1,2,3,4].map(i=>B.questions.filter(q=>q.answer===i).length);
 assert.ok(frequencies.every(n=>n>=2&&n<=3));
});

test('New trial questions do not replace or copy existing question IDs or exact prompts',()=>{
 const existing=[...ordinary.concepts.flatMap(c=>c.questions),...old.questions];
 const ids=new Set(existing.map(q=>q.id)),prompts=new Set(existing.map(q=>normalise(q.prompt)));
 for(const q of B.questions){assert.ok(!ids.has(q.id),q.id);assert.ok(!prompts.has(normalise(q.prompt)),q.id);}
 assert.equal(new Set(B.questions.map(q=>normalise(q.prompt))).size,12);
 assert.equal(old.id,'imat-2025-biology-taster-1');assert.equal(old.questions.length,12);
 assert.equal(ordinary.concepts.length,30);assert.equal(ordinary.concepts.reduce((n,c)=>n+c.questions.length,0),147);
});

test('Browser loading exposes a separate bank without replacing the official bank',()=>{
 const existing={id:'preserved-official-bank'},context={window:{IMAT_TRIAL:existing}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/imat-trial-transfer-content.js'),'utf8'),context);
 assert.equal(context.window.IMAT_TRIAL,existing);
 assert.equal(JSON.stringify(context.window.IMAT_TRIAL_TRANSFER),JSON.stringify(B));
});

test('Inheritance keys follow gamete combinations and the requested denominator',()=>{
 const cross=(m,p)=>m.flatMap(a=>p.map(b=>[a,b]));
 const autosomal=cross(['B','b'],['B','B']);
 assert.equal(autosomal.filter(([a,b])=>a==='b'&&b==='b').length,0);
 assert.equal(autosomal.filter(([a,b])=>a!==b).length/autosomal.length,1/2);
 assert.equal(key(3),'0 and 1/2');
 const all=cross(['G','g'],['g','Y']),daughters=all.filter(([,b])=>b!=='Y');
 const affectedDaughters=daughters.filter(([a,b])=>a==='g'&&b==='g');
 assert.equal(affectedDaughters.length/daughters.length,1/2);
 assert.equal(affectedDaughters.length/all.length,1/4);
 assert.equal(key(7),'1/2 and 1/4');
});

test('Quantitative keys use conservation, separate gradients, and area-to-thickness ratios',()=>{
 const filtered=24,excreted=6;assert.equal(filtered-excreted,18);assert.match(key(2),/reabsorbed from the tubule towards the blood/);
 assert.equal(80-80,0);assert.ok(7-5>0);assert.equal(key(4),'Oxygen has no net movement; carbon dioxide has net movement into alveolar air');
 const g1DNA=6,postS=g1DNA*2;assert.equal(postS/2,g1DNA);assert.equal(key(6),'10 chromosomes and 6 pg of DNA');
 const rates={P:8/2,Q:12/4,R:5/1};
 assert.equal(Object.keys(rates).sort((a,b)=>rates[b]-rates[a]).join(' > '),key(9));
 assert.match(B.questions[8].prompt,/non-zero partial-pressure difference/);
});

test('Mechanism keys distinguish energy source, message, selection, absorption and immune specificity',()=>{
 assert.equal(key(1),'A lower peak, with the reactant and product levels unchanged');
 assert.equal(key(5),'Make the polypeptide encoded by the supplied mRNA');
 assert.match(key(8),/ATP can form while proton flow supplies energy/);
 assert.match(key(8),/production falls as the gradient dissipates/);
 assert.match(key(10),/existing heritable variant/);
 assert.equal(key(11),'Chemical digestion occurred, but absorption of those amino acids is impaired');
 assert.match(key(12),/specific to recognised antigens/);
});

test('Scoring retains the eighteen-point denominator, negative marks and blanks',()=>{
 const right=Object.fromEntries(B.questions.map(q=>[q.id,q.answer]));
 const wrong=Object.fromEntries(B.questions.map(q=>[q.id,(q.answer+1)%5]));
 assert.deepEqual(E.score(B,right),{correct:12,wrong:0,blank:0,total:12,points:18});
 assert.deepEqual(E.score(B,wrong),{correct:0,wrong:12,blank:0,total:12,points:-4.8});
 assert.deepEqual(E.score(B,{}),{correct:0,wrong:0,blank:12,total:12,points:0});
 const mixed={[B.questions[0].id]:B.questions[0].answer,[B.questions[1].id]:(B.questions[1].answer+1)%5};
 assert.deepEqual(E.score(B,mixed),{correct:1,wrong:1,blank:10,total:12,points:1.1});
});
