const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/basics-engine.js'),B={...require('../src/basics-content.js'),teachFirst:true,questionFirst:false},M=require('../src/sync-model.js');
const T=Date.UTC(2026,9,20,10);
function missed(){const s=E.fresh();E.start(s,B,T);E.beginCheck(s);const a=E.active(s);a.checkSelected=(E.checkQuestion(B,a).answer+1)%3;E.check(s,B,T+1000);return s;}
test('Support is voluntary, one probe per block, survives reload and never awards mastery',()=>{
 let s=missed(),a=E.active(s),due=s.cards.cell.due;
 assert.equal(E.beginSupport(s,B,'concept:cell',T+2000),true);assert.equal(E.answerSupport(s,B,T+2100),false);
 a.support.selected=E.supportDefinition(B,a.support.id).question.answer;s=E.restore(JSON.parse(JSON.stringify(s)),B);a=E.active(s);
 assert.equal(E.answerSupport(s,B,T+3000),true);assert.equal(E.beginSupport(s,B,'concept:cell',T+4000),false);assert.equal(E.answerSupport(s,B,T+4000),false);
 assert.equal(s.cards.cell.attempts,0);assert.equal(s.cards.cell.recalls,0);assert.equal(s.cards.cell.needsHelp,true);assert.equal(s.cards.cell.due,due);assert.equal(s.cards.cell.lastExposure,T+3000);
 assert.deepEqual(E.restore(JSON.parse(JSON.stringify(s)),B),s);
});
test('Unknown or incorrect help stays a single recorded answer and cannot trap continuation',()=>{
 for(const unknown of [true,false]){const s=missed(),a=E.active(s);E.beginSupport(s,B,'concept:cell',T+2000);a.support.selected=(B.concepts[0].questions[0].answer+1)%3;assert.equal(E.answerSupport(s,B,T+3000,unknown),true);assert.equal(a.support.correct,false);assert.equal(E.restore(s,B).sessions[0].support.correct,false);assert.ok(E.more(s,B,T+4000));}
});
test('Choosing unrelated reasoning bypasses a gap; dependent choices start at the missing prerequisite',()=>{
 const s=missed();let a=E.topicStart(s,B,'reasoning_experiment',T+2000);assert.equal(a.concept,'reasoning_experiment');assert.equal(a.stage,'lesson');
 a=E.topicStart(s,B,'translation',T+3000);assert.equal(a.concept,'cell');assert.equal(s.sessions.length,3);assert.equal(s.sessions.filter(x=>!x.closed).length,1);
 assert.equal(E.topicStart(s,B,'unknown',T+4000),null);assert.equal(E.active(s).id,a.id);
});
test('Competing support answers merge atomically, with completed evidence ahead of partial selection',()=>{
 const b=missed();E.beginSupport(b,B,'concept:cell',T+2000);const l=M.clone(b),r=M.clone(b);E.active(l).support.selected=1;E.active(r).support.selected=0;E.answerSupport(r,B,T+3000);
 for(const [x,y]of [[l,r],[r,l]]){const merged=M.merge(E.KEY,b,x,y);assert.deepEqual(E.active(merged).support,E.active(r).support);assert.doesNotThrow(()=>E.restore(merged,B));}
});
test('Reporting keeps support separate even when the original block falls outside the reporting period',async()=>{
 const s=missed();E.beginSupport(s,B,'concept:cell',T+10*E.DAY);E.answerSupport(s,B,T+10*E.DAY+1000,true);
 const {summarize}=await import('../src/lib/overview-model.js'),r=summarize({[E.KEY]:s},'7',T+10*E.DAY+2000),m=r.modules[0];
 assert.equal(m.supportChecks,1);assert.equal(m.supportCorrect,0);assert.equal(m.attempts,0);assert.equal(m.checks,0);assert.equal(m.completed,0);assert.equal(r.activeDays,1);assert.equal(r.lastAnswer,T+10*E.DAY+1000);assert.equal(m.supportHistory[0].unknown,true);
});
test('Specific inheritance probes separate gamete, fraction and independence foundations',()=>{
 const c=B.concepts.find(c=>c.id==='inheritance_probability');assert.deepEqual(c.supports,['one_allele','quarter','independent_birth']);
 for(const id of c.supports){const p=E.supportDefinition(B,id);assert.ok(B.concepts.some(c=>c.id===p.concept));assert.equal(p.question.options.length,3);assert.equal(B.sources[p.source].language,'et');}
});
