const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/concept-links.js');
const B=require('../src/imat-english.js')(require('../src/imat-content.js'));
const Q=require('../src/quant-content.js');
const C=require('../src/chemistry-content.js');
const NOW=Date.parse('2026-11-09T12:00:00Z'),DAY=86400000;
const attempt=(id,concept,questionIndex,at=NOW-DAY,extra={})=>({id,concept,questionIndex,answeredAt:at,correct:false,...extra});
const modules=(sessions,extra={})=>({[M.KEY]:{version:1,sessions,cards:{},activeId:sessions.at(-1)?.id},...extra});
const pair=(concept,first,check)=>modules([attempt('a',concept,first,NOW-DAY,{retryIndex:check,retrySubmitted:true,completedAt:NOW-DAY+100,checkCorrect:false})]);

test('a single wrong answer, an open question and a selected but unsubmitted retry do not diagnose a prerequisite',()=>{
 for(const s of [attempt('a','xlinked',0),attempt('a','xlinked',0,0),attempt('a','xlinked',0,NOW-DAY,{retryIndex:7,retrySelected:0,checkCorrect:false})])assert.equal(M.recommend(modules([s]),NOW),null);
});
test('two indexed misses across Tallinn dates offer an optional connected lesson',()=>{
 const input=modules([attempt('a','xlinked',0,NOW-3*DAY),attempt('b','xlinked',9,NOW-DAY)]),before=JSON.stringify(input);
 const r=M.recommend(input,NOW);assert.equal(r.subject,'maths');assert.equal(r.concept,'probability_conditions');assert.equal(r.sourceConcept,'xlinked');
 assert.deepEqual(r.evidence,{sessionCount:2,dayCount:2,firstMisses:2,supportedCheckMisses:0,lastAt:NOW-DAY});
 assert.match(r.reason,/Soovi korral/);assert.equal(r.returnHref,'./imat.html#learn');assert.equal(new URL(r.href,'https://example.test/').searchParams.get('concept'),'probability_conditions');
 assert.equal(JSON.stringify(input),before,'recommendation cannot edit saved answers, stages or cards');
});
test('first and supported check misses on the same mapped subskill can offer help immediately',()=>{
 const r=M.recommend(pair('gas-exchange',5,9),NOW);assert.equal(r.concept,'proportions');assert.equal(r.evidence.firstMisses,1);assert.equal(r.evidence.supportedCheckMisses,1);assert.equal(r.evidence.dayCount,1);
 assert.equal(M.recommend(pair('gas-exchange',5,8),NOW),null,'different subskills do not manufacture repeated evidence');
});
test('same-day repeated sessions alone are insufficient and Tallinn dates are used',()=>{
 assert.equal(M.recommend(modules([attempt('a','xlinked',0,NOW-10000),attempt('b','xlinked',9,NOW-100)]),NOW),null);
 const first=Date.parse('2026-11-07T21:59:00Z'),second=Date.parse('2026-11-07T22:01:00Z');
 assert.equal(M.recommend(modules([attempt('a','xlinked',0,first),attempt('b','xlinked',9,second)]),NOW).evidence.dayCount,2);
});
test('guest trials and unknown old question indices never contribute',()=>{
 const visitor=modules([],{ 'hendrik-imat-trial-v1':{sessions:[attempt('trial-55bc072e-c425-49c5-b007-62e90c5c4dc2','xlinked',0,NOW-3*DAY),attempt('unknown-trial','xlinked',9)]}});
 assert.equal(M.recommend(visitor,NOW),null);
 assert.equal(M.recommend(modules([attempt('a','xlinked',0,NOW-3*DAY,{participant:'guest'}),attempt('b','xlinked',9)]),NOW),null);
 assert.equal(M.recommend(modules([attempt('a','xlinked',undefined,NOW-3*DAY),attempt('b','xlinked',undefined)]),NOW),null);
 assert.equal(M.recommend(modules([attempt('a','xlinked',0,NOW-3*DAY,{participant:'unknown'}),attempt('b','xlinked',9)]),NOW),null);
 assert.ok(M.recommend(modules([attempt('a','xlinked',0,NOW-3*DAY,{participant:'learner'}),attempt('b','xlinked',9,NOW-DAY,{participant:'hendrik'})]),NOW),'both current explicit learner markers are eligible');
});
test('duplicate IDs, corrupt data, future and stale times cannot manufacture evidence',()=>{
 const a=attempt('same','xlinked',0,NOW-3*DAY),b=attempt('same','xlinked',9);
 for(const data of [modules([a,b]),modules([attempt('a','xlinked',0,NOW-M.WINDOW-1),attempt('b','xlinked',9)]),modules([attempt('a','xlinked',0,NOW+1),attempt('b','xlinked',9)]),modules([attempt('a','xlinked',0,NaN),attempt('b','xlinked',9)]),{[M.KEY]:'{bad'},null])assert.equal(M.recommend(data,NOW),null);
});
test('exact subskill mapping avoids turning every inheritance or gas miss into maths',()=>{
 assert.equal(M.recommend(pair('autosomal',0,7),NOW),null,'carrier genotype is not a denominator calculation');
 assert.equal(M.recommend(pair('xlinked',10,11),NOW),null,'chromosome source is not a conditional probability calculation');
 assert.equal(M.recommend(pair('gas-exchange',0,8),NOW).subject,'physics');
 assert.equal(M.recommend(pair('osmosis',0,2),NOW).concept,'concentration_dilution');
 assert.equal(M.recommend(pair('nerve-signals',0,4),NOW).concept,'atomic_structure_ions');
 assert.equal(M.recommend(pair('transport',0,2),NOW).concept,'energy_power');
});
test('newer independent delayed success resets an older suggestion, supported success does not',()=>{
 const base=[attempt('a','gas-exchange',5,NOW-4*DAY),attempt('b','gas-exchange',9,NOW-3*DAY)];
 assert.equal(M.recommend(modules([...base,attempt('c','gas-exchange',5,NOW-DAY,{correct:true,delayedProbe:true,assisted:false})]),NOW),null);
 assert.ok(M.recommend(modules([...base,attempt('c','gas-exchange',5,NOW-DAY,{correct:true,delayedProbe:false,assisted:true})]),NOW));
 assert.ok(M.recommend(modules([...base,attempt('c','gas-exchange',0,NOW-DAY,{correct:true,delayedProbe:true,assisted:false})]),NOW),'different subskill success does not clear this evidence');
});
test('recent completed connected practice pauses the invitation; opening it does not',()=>{
 const bio=pair('gas-exchange',5,9);
 bio['hendrik-maths-v1']={sessions:[{id:'m',concept:'proportions',startedAt:NOW-10000,completedAt:0}]};assert.ok(M.recommend(bio,NOW));
 bio['hendrik-maths-v1'].sessions[0].completedAt=NOW-10000;assert.equal(M.recommend(bio,NOW),null);
 assert.ok(M.recommend(bio,NOW+DAY),'this is a cooldown, not a mastery judgement');
});
test('shortlist is bounded, recent first and does not repeat the same target',()=>{
 const input=modules([
  attempt('a','xlinked',0,NOW-5*DAY),attempt('b','xlinked',9,NOW-4*DAY),
  attempt('c','mendel',1,NOW-3*DAY),attempt('d','mendel',1,NOW-2*DAY),
  attempt('e','gas-exchange',0,NOW-3*DAY),attempt('f','gas-exchange',8,NOW-DAY),
  attempt('g','osmosis',0,NOW-3*DAY),attempt('h','osmosis',2,NOW-1000)
 ]);
 const list=M.candidates(input,NOW);assert.equal(list.length,3);assert.equal(list[0].subject,'chemistry');assert.equal(new Set(list.map(x=>x.subject+':'+x.concept)).size,3);
 assert.deepEqual(M.candidates(JSON.stringify(input),NOW),list);
});
test('question map stays tied to stable authored identities and selectable target concepts',()=>{
 const identities={
  xlinked:['xlinked-basic','xlinked-application','xlinked-retry','xlinked-focused-0','xlinked-focused-1','xlinked-focused-2','xlinked-focused-3','xlinked-focused-4','xlinked-focused-5','xlinked-focused-6','xlinked-nov06-probe','xlinked-nov06-support','xlinked-nov06-transfer'],
  autosomal:['autosomal-basic','autosomal-application','autosomal-retry','autosomal-focused-0','autosomal-focused-1','autosomal-focused-2','autosomal-focused-3','autosomal-focused-4','autosomal-focused-5','autosomal-focused-6','autosomal-nov06-probe','autosomal-nov06-support','autosomal-nov06-transfer'],
  mendel:['mendel-basic','mendel-application','mendel-retry'],transport:['transport-basic','transport-application','transport-retry'],osmosis:['osmosis-basic','osmosis-application','osmosis-retry'],
  'gas-exchange':[...Array.from({length:7},(_,i)=>'gas-exchange-v1-'+i),'gas-exchange-nov06-probe','gas-exchange-nov06-support','gas-exchange-nov06-transfer'],
  'nerve-signals':Array.from({length:7},(_,i)=>'nerve-signals-v1-'+i)
 };
 for(const d of M.mappings()){
  for(const [id,indices] of Object.entries(d.sources)){const c=B.concepts.find(c=>c.id===id);for(const i of indices)assert.equal(c.questions[i].id,identities[id][i]);}
  assert.ok((d.subject==='chemistry'?C:Q.subjects[d.subject]).topics.some(t=>t.id===d.concept));
 }
 const map=M.mappings();map[0].sources.xlinked.length=0;assert.ok(M.mappings()[0].sources.xlinked.length,'mapping accessor does not expose mutable configuration');
});
