const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/quant-engine.js');
const NOW=Date.parse('2026-11-11T01:00:00+02:00');
function bank(){
 const questions=['area_vs_perimeter','conditional_group','area_only','depth_pressure','ratio','units'].map((skill,i)=>({skill,prompt:'original '+i,options:['0','1','2','3'],answer:i%4,explanation:'original explanation '+i}));
 const followups={};for(let i=0;i<6;i++){const skill=questions[i].skill,simpleIndex=questions.length;questions.push({skill,prompt:'simple '+i,options:['0','1','2','3'],answer:0,explanation:'matched simple'});const applicationIndex=questions.length;questions.push({skill,prompt:'fresh '+i,options:['0','1','2','3'],answer:1,explanation:'matched fresh'});followups[i]={skill,title:'Skill '+i,explanation:['specific '+i],worked:{prompt:'example '+i,steps:['step'],answer:'value'},simpleIndex,applicationIndex};}
 return {key:'hendrik-maths-v1',topics:[{id:'topic',title:'Broad topic',questions,followupVersion:1,followups,explanation:['broad'],worked:{prompt:'broad example',steps:['broad'],answer:'broad'}}]};
}
function first(s,b,t,correct=true,confidence='sure'){const a=E.active(s),q=E.topic(b,a).questions[a.questionIndex];a.selected=correct?q.answer:(q.answer+1)%4;a.confidence=confidence;assert.ok(E.submit(s,b,t));return a;}
function finish(s,b,t,correct=true){E.beginCheck(s);const a=E.active(s),q=E.topic(b,a).questions[a.checkIndex];a.checkSelected=correct?q.answer:(q.answer+1)%4;assert.ok(E.check(s,b,t));return a;}
function old(b,overrides={}){return {id:'old',kind:'quantitative',concept:'topic',startedAt:NOW-100,stage:'done',questionIndex:0,checkIndex:2,selected:1,checkSelected:2,confidence:'sure',answeredAt:NOW,taughtAt:NOW,correct:false,checkCorrect:true,checkAnsweredAt:NOW+1,completedAt:NOW+1,assisted:false,initialProbe:true,delayedProbe:false,contentVersion:1,...overrides};}
test('wrong/unknown/uncertain and confident success use different checks of exactly the initial skill',()=>{
 for(const outcome of ['wrong','unknown','uncertain','correct']){const b=bank(),s=E.fresh(),a=E.start(s,b,NOW);if(outcome==='unknown')E.submit(s,b,NOW+1);else first(s,b,NOW+1,outcome!=='wrong',outcome==='uncertain'?'unsure':'sure');const r=b.topics[0].followups[0];assert.equal(a.checkIndex,outcome==='correct'?r.applicationIndex:r.simpleIndex);assert.equal(a.initialSkill,a.checkSkill);assert.equal(a.routingVersion,1);assert.equal(E.lesson(b,a).worked.prompt,'example 0');assert.equal(a.delayedProbe,false);finish(s,b,NOW+2,false);assert.equal(a.stage,'done');}
});
test('another successful skill and a supported matched check cannot clear the original difficulty',()=>{
 const b=bank(),s=E.fresh();E.start(s,b,NOW);first(s,b,NOW+1,false);finish(s,b,NOW+2,true);const a=E.start(s,b,NOW+10,'topic');assert.equal(a.questionIndex,1);first(s,b,NOW+11);finish(s,b,NOW+12);const e=E.skillEvidence(s,b,'topic');assert.equal(e.area_vs_perimeter.needsHelp,true);assert.equal(e.conditional_group.needsHelp,false);assert.equal(s.cards.topic.needsHelp,true);
 const review=E.start(s,b,NOW+2*E.DAY,'topic');assert.equal(review.initialSkill,'area_vs_perimeter');assert.notEqual(review.questionIndex,0);first(s,b,NOW+2*E.DAY+1);assert.equal(review.delayedProbe,true);assert.notEqual(review.checkIndex,review.questionIndex);finish(s,b,NOW+2*E.DAY+2);assert.equal(E.skillEvidence(s,b,'topic').area_vs_perimeter.needsHelp,false);
});
test('a previously untested skill is a new baseline even days after another skill was taught',()=>{
 const b=bank(),s=E.fresh();E.start(s,b,NOW);first(s,b,NOW+1);finish(s,b,NOW+2);E.start(s,b,NOW+2*E.DAY,'topic');first(s,b,NOW+2*E.DAY+1);finish(s,b,NOW+2*E.DAY+2);
 const newSkill=E.start(s,b,NOW+2*E.DAY+10,'topic');assert.equal(newSkill.initialSkill,'conditional_group');assert.equal(newSkill.initialProbe,true);first(s,b,NOW+2*E.DAY+11);assert.equal(newSkill.delayedProbe,false);
});
test('historical mismatched success leaves the actual old miss unresolved without rewriting its flags',()=>{
 const b=bank(),s=E.fresh();s.sessions=[old(b)];s.activeId='old';const before=structuredClone(s.sessions[0]);const e=E.skillEvidence(s,b,'topic');assert.equal(e.area_vs_perimeter.needsHelp,true);assert.equal(e.area_only.needsHelp,false);const a=E.start(s,b,NOW+2*E.DAY,'topic');assert.equal(a.initialSkill,'area_vs_perimeter');assert.deepEqual(s.sessions[0],before);
});
test('a wrong historical check with its own skill receives its own due review, not the original first skill',()=>{
 const b=bank(),s=E.fresh();s.sessions=[old(b,{correct:true,selected:0,checkIndex:3,checkCorrect:false,checkSelected:0})];s.activeId='old';const a=E.start(s,b,NOW+2*E.DAY,'topic');assert.equal(a.routeIndex,3);assert.equal(a.initialSkill,'depth_pressure');assert.equal(a.initialProbe,false);first(s,b,NOW+2*E.DAY+1,false);assert.equal(a.checkSkill,'depth_pressure');
});
test('old unfinished work resumes identical stages/indices and retains teaching-first follow-up behaviour',()=>{
 for(const stage of ['question','lesson','check']){const b=bank(),s=E.fresh(),a=old(b,{stage,answeredAt:stage==='question'?0:NOW,completedAt:0,checkCorrect:undefined,checkAnsweredAt:0});s.sessions=[a];s.activeId=a.id;const before=JSON.parse(JSON.stringify(a));const r=E.restore(s,b);assert.deepEqual(E.start(r,b,NOW+100),before);assert.equal(E.lesson(b,E.active(r)).worked.prompt,'broad example');if(stage==='question'){first(r,b,NOW+101);assert.equal(E.active(r).checkIndex,3);}assert.equal(E.active(r).routingVersion,undefined);}
});
test('help exposure survives reload and cannot become delayed independent success',()=>{
 const b=bank(),s=E.fresh();E.start(s,b,NOW);first(s,b,NOW+1,false);finish(s,b,NOW+2);const a=E.start(s,b,NOW+2*E.DAY,'topic');E.help(s,NOW+2*E.DAY+1);const r=E.restore(s,b);E.beginCheck(r);first(r,b,NOW+2*E.DAY+2);finish(r,b,NOW+2*E.DAY+3);assert.equal(E.active(r).helpedAt,NOW+2*E.DAY+1);assert.equal(E.active(r).delayedProbe,false);assert.equal(E.skillEvidence(r,b,'topic').area_vs_perimeter.needsHelp,true);
});
test('an early-opened review cannot gain delayed credit by waiting, and new routing metadata must be coherent',()=>{
 const b=bank(),s=E.fresh();E.start(s,b,NOW);first(s,b,NOW+1);finish(s,b,NOW+2);const a=E.start(s,b,NOW+3,'topic');first(s,b,NOW+3*E.DAY);assert.equal(a.delayedProbe,false);const broken=structuredClone(s);E.active(broken).checkSkill='other';assert.throws(()=>E.restore(broken,b));
});
test('a relevant video exposure postpones new independent skill recall and remains recorded after completion',()=>{
 const L=require('../src/video-links.js'),b=bank(),s=E.fresh();E.start(s,b,NOW);first(s,b,NOW+1,false);finish(s,b,NOW+2);
 // Existing general-video write is a topic exposure, deliberately conservative.
 s.cards.topic.lastExposure=NOW+3*E.DAY;s.cards.topic.lastExternalExposure=NOW+3*E.DAY;
 const a=E.start(s,b,NOW+3*E.DAY+1,'topic');assert.equal(a.delayedEligibleAtStart,false);first(s,b,NOW+3*E.DAY+2);finish(s,b,NOW+3*E.DAY+3);assert.equal(s.cards.topic.lastExternalExposure,NOW+3*E.DAY);assert.equal(a.delayedProbe,false);
 const legacy=E.fresh();legacy.sessions=[old(b)];legacy.cards.topic={lastExposure:NOW+3*E.DAY};const next=E.start(legacy,b,NOW+3*E.DAY+1,'topic');assert.equal(next.delayedEligibleAtStart,false);
});
test('later-uploaded video exposure is replayed before a delayed-labelled answer and cannot clear the miss',()=>{
 const b=bank(),s=E.fresh();E.start(s,b,NOW);first(s,b,NOW+1,false);finish(s,b,NOW+2);E.start(s,b,NOW+2*E.DAY,'topic');first(s,b,NOW+2*E.DAY+1);finish(s,b,NOW+2*E.DAY+2);assert.equal(E.skillEvidence(s,b,'topic').area_vs_perimeter.needsHelp,false);
 s.cards.topic.lastExternalExposure=NOW+2*E.DAY-1000;
 const e=E.skillEvidence(s,b,'topic').area_vs_perimeter;assert.equal(e.needsHelp,true);assert.equal(e.delayedSuccesses,0);
});
