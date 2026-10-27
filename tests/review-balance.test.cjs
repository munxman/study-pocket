const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/basics-engine.js'),B=require('../src/basics-content.js');
const T=Date.UTC(2026,9,25,12);
function finish(s,now,mode='sure',right=true){const a=E.active(s);a.selected=E.question(B,a).answer;a.confidence=mode;E.submit(s,B,now+1);E.beginCheck(s);a.checkSelected=(E.checkQuestion(B,a).answer+(right?0:1))%3;E.check(s,B,now+2);return a;}
function introduce(s,id,now){E.topicStart(s,B,id,now);finish(s,now);E.stop(s);}
test('A backlog of due reviews cannot crowd out a ready new concept, including across visits',()=>{
 const s=E.fresh();for(const id of ['cell','tissue','organ','nucleus','dna_structure','inheritance'])introduce(s,id,T-4*E.DAY+s.sessions.length*100);
 const dueBefore=Object.values(s.cards).filter(c=>c.due<=T).length;assert.ok(dueBefore>=5);
 let a=E.start(s,B,T);finish(s,T);E.stop(s);
 // The last two genetics blocks may have selected a new family immediately.
 if(a.initialProbe){a=E.start(s,B,T+100);assert.equal(a.initialProbe,false);finish(s,T+100);E.stop(s);}
 const restored=E.restore(JSON.parse(JSON.stringify(s)),B),next=E.start(restored,B,T+E.DAY);
 assert.equal(next.initialProbe,true);assert.ok(Object.values(restored.cards).some(c=>c.due<=T));
});
test('Continue after uncertainty does not immediately recycle a not-yet-due weak card',()=>{
 const s=E.fresh();introduce(s,'cell',T-2*E.DAY);E.topicStart(s,B,'cell',T);finish(s,T,'unsure');const due=s.cards.cell.due;
 const next=E.more(s,B,T+100);assert.notEqual(next.concept,'cell');assert.equal(next.initialProbe,true);assert.equal(s.cards.cell.due,due);assert.equal(s.cards.cell.needsHelp,true);assert.equal(s.cards.cell.recalls,0);
});
test('Two genetics blocks yield to ready other biology while dependency gaps remain protected',()=>{
 const s=E.fresh();for(const id of ['cell','tissue','organ','nucleus','dna_structure'])introduce(s,id,T+s.sessions.length*100);
 const next=E.start(s,B,T+1000);assert.ok(!B.geneticsPath.includes(next.concept));assert.equal(next.initialProbe,true);
 const c=B.concepts.find(c=>c.id===next.concept);assert.ok(c.requires.every(id=>s.cards[id]&&!s.cards[id].needsHelp));
});
test('Choosing a different new topic preserves partial answers and due reviews without fake completion',()=>{
 const s=E.fresh();introduce(s,'cell',T-2*E.DAY);const a=E.start(s,B,T);a.selected=1;a.confidence='unsure';const due=s.cards.cell.due;
 const next=E.newTopic(s,B,T+100);assert.notEqual(next.concept,a.concept);assert.equal(next.initialProbe,true);assert.equal(a.selected,1);assert.equal(a.completedAt,0);assert.equal(a.closed,true);assert.equal(s.cards.cell.due,due);assert.doesNotThrow(()=>E.restore(JSON.parse(JSON.stringify(s)),B));
});
test('Established concepts rotate initial and follow-up variants instead of repeating one application forever',()=>{
 const s=E.fresh();introduce(s,'cell',T);const indices=[],checks=[];
 for(let n=1;n<=6;n++){const now=T+n*40*E.DAY;E.topicStart(s,B,'cell',now);indices.push(E.active(s).questionIndex);finish(s,now);checks.push(E.active(s).checkIndex);E.stop(s);}
 assert.ok(new Set(indices).size>=4);assert.ok(new Set(checks).size>=3);assert.equal(s.cards.cell.recalls,6);
});
test('All concepts remain reachable with balanced introductions and no mandatory extra block',()=>{
 const s=E.fresh();for(let n=0;n<B.concepts.length;n++){const a=E.start(s,B,T+n*100);assert.ok(a);assert.equal(a.initialProbe,true);finish(s,T+n*100);const serial=s.serial;assert.equal(E.start(s,B,T+n*100+5).id,a.id);assert.equal(s.serial,serial);E.stop(s);}
 assert.equal(Object.keys(s.cards).length,B.concepts.length);assert.equal(E.nextNew(s,B),null);
});
