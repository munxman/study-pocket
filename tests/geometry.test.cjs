const test=require('node:test'),assert=require('node:assert/strict'),C=require('../src/quant-content.js'),E=require('../src/quant-engine.js');
const b=C.subjects.maths,t=b.topics.find(t=>t.id==='plane_geometry');
test('Geometry baseline has distinct original subskills and independently calculated keys',()=>{
 assert.equal(t.questions.length,6);assert.equal(new Set(t.questions.map(q=>q.skill)).size,6);
 const values=[2*(7+4),360-80-95-110,5*3,9*4,Math.sqrt(6**2+8**2),(5-2)*180/5];
 t.questions.forEach((q,i)=>{assert.ok(q.options[q.answer].includes(String(values[i])),q.prompt);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);});
 assert.ok(t.questions[0].options[t.questions[0].answer].includes(String(7*4)));assert.ok(t.sources.some(s=>s.url.includes('opiq.ee')));
});
test('Optional geometry topic preserves old work and records a wrong supported check honestly',()=>{
 const s=E.fresh(),old=E.start(s,b,10000,'formulas_units');old.selected=1;const a=E.start(s,b,11000,'plane_geometry');E.submit(s,b,12000);assert.equal(a.unknown,true);assert.equal(a.delayedProbe,false);E.beginCheck(s);a.checkSelected=(t.questions[a.checkIndex].answer+1)%4;E.check(s,b,13000);assert.equal(a.checkCorrect,false);assert.equal(a.stage,'done');assert.equal(s.sessions.length,2);assert.equal(s.sessions[0].selected,1);assert.equal(E.restore(s,b).sessions.length,2);
});
