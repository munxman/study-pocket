const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/basics-engine.js'),B=require('../src/basics-content.js');
const T=Date.UTC(2026,9,22,9);
function answer(s,mode='sure',now=T+100){const a=E.active(s);a.selected=mode==='wrong'?(E.question(B,a).answer+1)%3:E.question(B,a).answer;a.confidence=mode==='unsure'?'unsure':'sure';assert.equal(E.submit(s,B,now,mode==='unknown'),true);return a;}
function check(s,right=true,now=T+200){E.beginCheck(s);const a=E.active(s);a.checkSelected=(E.checkQuestion(B,a).answer+(right?0:1))%3;assert.equal(E.check(s,B,now),true);return a;}

test('Every current foundation begins before the text and confident answers get a different application',()=>{
 assert.equal(B.questionFirst,true);assert.equal(B.teachFirst,false);
 for(const c of B.concepts){const s=E.fresh(),a=E.start(s,B,T,false,c);assert.equal(a.stage,'question',c.id);assert.equal(a.initialProbe,true);assert.equal(a.answeredAt,0);assert.equal(Object.keys(s.cards).length,0);answer(s);assert.ok((c.targeted?c.transferQuestions:c.followupQuestions).includes(a.checkIndex),c.id);assert.notEqual(a.checkIndex,a.questionIndex);check(s);assert.equal(s.cards[c.id].recalls,0);assert.equal(s.cards[c.id].rememberedAt,0);assert.equal(E.restore(s,B).sessions[0].checkCorrect,true);}
});
test('Unknown, wrong and uncertain initial answers get one simpler check and an early review',()=>{
 for(const mode of ['unknown','wrong','unsure']){const s=E.fresh(),a=E.start(s,B,T);answer(s,mode);assert.equal(a.checkIndex,1);const scheduled=s.cards.cell.due;check(s);assert.equal(s.cards.cell.needsHelp,false);assert.equal(s.cards.cell.due,scheduled);assert.equal(s.cards.cell.recalls,0);assert.equal(a.delayedProbe,false);const next=E.more(s,B,T+300);assert.ok(next);assert.notEqual(next.concept,'cell');assert.equal(a.moreChosen,true);assert.equal(E.recommend(s,B,scheduled).id,'cell');}
});
test('Wrong application check triggers help and immediate continuation remains possible',()=>{
 const s=E.fresh(),a=E.start(s,B,T);answer(s);check(s,false);assert.equal(s.cards.cell.needsHelp,true);assert.equal(s.cards.cell.recalls,0);assert.equal(s.cards.cell.due,T+200+E.HOUR/6);const next=E.more(s,B,T+300);assert.equal(next.concept,'reasoning_data');assert.notEqual(next.extraPractice,true);assert.equal(next.initialProbe,true);assert.equal(s.cards.cell.needsHelp,true);
});
test('A later independent retrieval earns recall while immediate application and extra practice do not',()=>{
 const s=E.fresh();E.start(s,B,T);answer(s);check(s);E.stop(s);E.start(s,B,T+300,true,B.concepts[0]);answer(s,'sure',T+400);check(s,true,T+500);assert.equal(s.cards.cell.recalls,0);E.stop(s);
 const now=T+2*E.DAY;const a=E.topicStart(s,B,'cell',now);assert.equal(a.concept,'cell');answer(s,'sure',now+100);assert.equal(a.delayedProbe,true);assert.equal(s.cards.cell.recalls,1);check(s,true,now+200);assert.equal(s.cards.cell.recalls,1);
});
test('A weak review does not lose its support status just because an immediate check was right',()=>{
 const s=E.fresh();E.start(s,B,T);answer(s);check(s);E.stop(s);const now=T+2*E.DAY;E.start(s,B,now);answer(s,'unknown',now+100);check(s,true,now+200);assert.equal(E.active(s).initialProbe,false);assert.equal(s.cards.cell.needsHelp,true);assert.equal(s.cards.cell.recalls,0);
});
test('Application-level prequestion uses another question for its supported follow-up',()=>{
 const s=E.fresh();E.start(s,B,T);answer(s);check(s);E.stop(s);s.cards.cell.recalls=2;s.cards.cell.due=T;
 const a=E.start(s,B,T+2*E.DAY);assert.equal(a.questionIndex,2);answer(s,'sure',T+2*E.DAY+100);assert.notEqual(a.checkIndex,a.questionIndex);assert.ok(B.concepts[0].questions[a.checkIndex]);
});
test('Question-first selections and chosen check survive every saved stage',()=>{
 let s=E.fresh(),a=E.start(s,B,T);a.selected=E.question(B,a).answer;a.confidence='sure';s=E.restore(JSON.parse(JSON.stringify(s)),B);assert.equal(E.active(s).initialProbe,true);assert.equal(E.active(s).selected,a.selected);answer(s);s=E.restore(s,B);assert.equal(E.active(s).stage,'explanation');assert.equal(E.active(s).checkIndex,5);E.beginCheck(s);s=E.restore(s,B);check(s);s=E.restore(s,B);assert.equal(E.active(s).stage,'done');assert.equal(E.active(s).checkIndex,5);
});
test('Unfinished old teaching lessons retain their original stage, question and scheduling',()=>{
 const legacy={...B,teachFirst:true,questionFirst:false},s=E.fresh();E.start(s,legacy,T);let r=E.restore(s,B);assert.equal(E.active(r).stage,'lesson');assert.equal(E.active(r).questionFirst,undefined);E.beginCheck(r);assert.equal(E.active(r).checkIndex,1);check(r);assert.equal(r.cards.cell.attempts,0);assert.equal(r.cards.cell.recalls,0);assert.equal(r.cards.cell.due,T+200+E.DAY);
});
test('Unfinished old question-led lessons keep their original fixed check',()=>{
 const legacy={...B,teachFirst:false,questionFirst:false},s=E.fresh();E.start(s,legacy,T);let r=E.restore(s,B);answer(r);assert.equal(E.active(r).checkIndex,1);assert.equal(E.active(r).initialProbe,undefined);check(r);assert.equal(E.restore(r,B).sessions[0].checkIndex,1);
});
