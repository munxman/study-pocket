const test=require('node:test'),assert=require('node:assert/strict'),T=require('../src/today-plan.js');
const now=Date.parse('2026-11-09T12:00:00Z');
test('Today resumes submitted unfinished work before optional bridges and does not alter records',()=>{
 const modules={'hendrik-imat-bio-v1':{activeId:'old',sessions:[{id:'old',concept:'kidney',stage:'retry',answeredAt:now-100,startedAt:now-200}]},'hendrik-chemistry-v1':{sessions:[{id:'open',concept:'atomic_structure_ions',stage:'question',startedAt:now-10}]}};const before=structuredClone(modules),r=T.recommend(modules,{title:'bridge'},now);assert.equal(r.kind,'resume');assert.equal(r.concept,'kidney');assert.equal(r.href,'./imat.html#learn');assert.deepEqual(modules,before);
});
test('Guest and trial records cannot choose a teaching step; empty state offers chemistry',()=>{
 const r=T.recommend({'hendrik-imat-trial-v1':{sessions:[{stage:'question',answeredAt:now-1}]},'hendrik-imat-bio-v1':{sessions:[{participant:'guest',stage:'retry',answeredAt:now-1}]}},null,now);assert.equal(r.kind,'start');assert.match(r.href,/chemistry/);
});
test('Bridge preserves fixed biology return; completed work is never reopened as unfinished',()=>{
 const modules={'hendrik-imat-bio-v1':{sessions:[{stage:'done',answeredAt:now-2,completedAt:now-1}]}};const r=T.recommend(modules,{title:'Suhted',reason:'Üks alusmõte',href:'./quant.html?subject=maths&concept=ratios&from=biology'},now);assert.equal(r.kind,'bridge');assert.match(r.href,/from=biology/);assert.equal(r.returnHref,'./imat.html#learn');
});
test('Recent quantitative unfinished work targets that concept; no module is created by recommendation',()=>{
 const modules={'hendrik-chemistry-v1':{sessions:[{concept:'bonding_polarity',stage:'check',answeredAt:now-1}]}};const r=T.recommend(modules,null,now);assert.equal(r.href,'./quant.html?subject=chemistry&concept=bonding_polarity');assert.equal(Object.keys(modules).length,1);
});

test('Closed and inactive biology attempts cannot recommend an unreachable resume',()=>{const r=T.recommend({'hendrik-imat-bio-v1':{activeId:'current',sessions:[{id:'old',concept:'kidney',answeredAt:now-1,stage:'retry'},{id:'current',concept:'enzyme',stage:'question',startedAt:now-2}]}},null,now);assert.equal(r.kind,'start');});
