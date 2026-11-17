const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const B=require('../src/imat-english.js')(require('../src/imat-content.js')),E=require('../src/imat-engine.js');
const DAY=E.DAY,T=Date.UTC(2026,9,1,12),id='digestion-absorption';
const c=B.concepts.find(c=>c.id===id),r=c.challengeRoutes[0];
function block(s,index,at,{correct=true,confidence='sure',assisted=false,checkCorrect=true,checkIndex}={}){
 E.stop(s);const a=E.start(s,B,at,id);a.questionIndex=index;a.assisted=assisted;
 a.selected=correct?E.question(B,a).answer:(E.question(B,a).answer+1)%5;a.confidence=confidence;E.submit(s,B,at+1);
 if(checkIndex!==undefined)a.retryIndex=checkIndex;
 E.beginRetry(s);a.retrySelected=checkCorrect?E.retryQuestion(B,a).answer:(E.retryQuestion(B,a).answer+1)%5;E.retry(s,B,at+2);E.stop(s);return a;
}
function ready(){const s=E.fresh();block(s,0,T,{assisted:true});block(s,0,T+8*DAY);block(s,0,T+16*DAY);return s;}
const NOW=T+30*DAY;
test('Four bounded routes append 16 original questions; old 147 questions remain byte-for-byte equivalent',()=>{
 const counts={ribosome:3,prokaryote:3,biomolecules:3,transport:3,osmosis:3,enzyme:3,krebs:3,glycolysis:3,photosynthesis:3,'dna-rna':3,translation:3,replication:3,division:13,mendel:3,autosomal:13,xlinked:13,homeostasis:3,neuromuscular:3,circulation:3,adh:3,immunity:3,'glucose-control':3,selection:3,biotech:3,'gas-exchange':10,'digestion-absorption':7,'nephron-filtration':7,'nerve-signals':7,'cell-cycle-control':7,'respiration-coupling':7};
 const old=B.concepts.map(c=>[c.id,c.questions.slice(0,counts[c.id])]);assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),'63054bc8764cfd098632a86b6af61afd45afcc089aa577910b0f8dc3b5fc9b8d');
 assert.equal(B.concepts.reduce((n,c)=>n+c.questions.length,0),163);assert.equal(B.concepts.filter(c=>c.challengeRoutes).length,4);
 for(const topic of B.concepts.filter(c=>c.challengeRoutes))for(const route of topic.challengeRoutes){assert.equal(route.challengeIndices.length,2);const indices=[...route.challengeIndices,route.supportIndex,route.applicationIndex];assert.equal(new Set(indices).size,4);for(const i of indices){const q=topic.questions[i];assert.equal(q.skill,route.skill);assert.equal(q.options.length,5);assert.ok(q.options[q.answer]);assert.ok(q.explanation.length>80);assert.ok(!topic.probeQuestions.includes(i));}assert.notEqual(topic.questions[route.challengeIndices[0]].prompt,topic.questions[route.challengeIndices[1]].prompt);}
});
test('Repeated application of English companion does not append duplicates or shift references',()=>{const old=JSON.stringify(B.concepts.map(c=>c.questions));require('../src/imat-english.js')(B);assert.equal(JSON.stringify(B.concepts.map(c=>c.questions)),old);});
test('Two eligible indexed independent successes on separate visits unlock only the first diagnostic challenge',()=>{const s=ready();assert.equal(E.challengeChoice(s,c,NOW).index,r.challengeIndices[0]);const a=E.start(s,B,NOW,id);assert.equal(a.questionIndex,r.challengeIndices[0]);assert.equal(a.stage,'question');assert.equal(a.assisted,false);assert.equal(a.scaffold,false);assert.equal(a.level,'application');});
test('Unknown old indices, support, uncertainty, duplicate copies and same-visit answers do not create eligibility',()=>{
 for(const mutate of [s=>{s.sessions.forEach(a=>delete a.questionIndex);},s=>{s.sessions.forEach(a=>a.assisted=true);},s=>{s.sessions.at(-1).confidence='unsure';},s=>{s.sessions[2]={...s.sessions[1]};},s=>{s.sessions.at(-1).startedAt=s.sessions[1].startedAt+100;s.sessions.at(-1).answeredAt=s.sessions[1].answeredAt+100;s.sessions.at(-1).completedAt=s.sessions[1].completedAt+100;}]){const s=ready();mutate(s);assert.equal(E.challengeChoice(s,c,NOW),null);}
});
test('A later matched wrong check or unsure first blocks escalation; supported check success cannot erase it',()=>{
 const s=ready();block(s,0,T+24*DAY,{checkCorrect:false,checkIndex:r.applicationIndex});assert.equal(E.challengeChoice(s,c,NOW),null);
 const x=ready();block(x,0,T+24*DAY,{confidence:'unsure',checkIndex:r.supportIndex});assert.equal(E.challengeChoice(x,c,NOW),null);
});
test('Success or failure on a different known facet does not decide this skill',()=>{const s=ready();block(s,2,T+24*DAY,{correct:false,checkIndex:3});assert.equal(E.challengeChoice(s,c,NOW).index,r.challengeIndices[0]);});
test('Recent related teaching, a future due date or malformed future history withholds automatic challenge without blocking ordinary practice',()=>{
 for(const mutate of [s=>s.cards[id].lastExposure=NOW-100,s=>s.cards[id].due=NOW+DAY,s=>s.sessions.at(-1).answeredAt=NOW+1]){const s=ready();mutate(s);assert.equal(E.challengeChoice(s,c,NOW),null);const a=E.start(s,B,NOW,id);assert.ok(a);assert.ok(!r.challengeIndices.includes(a.questionIndex));}
});
test('No new challenge is presented over an existing unfinished route',()=>{const s=ready();const a=E.start(s,B,NOW,id);a.questionIndex=1;assert.equal(E.start(s,B,NOW+2*DAY,id).id,a.id);assert.equal(a.questionIndex,1);});
test('Wrong challenge gets one matched simpler check and can finish even when that check is wrong',()=>{const s=ready();const a=E.start(s,B,NOW,id);a.selected=(E.question(B,a).answer+1)%5;a.confidence='sure';E.submit(s,B,NOW+1);assert.equal(a.retryIndex,r.supportIndex);E.beginRetry(s);a.retrySelected=(E.retryQuestion(B,a).answer+1)%5;E.retry(s,B,NOW+2);assert.equal(a.stage,'done');assert.equal(a.checkCorrect,false);assert.equal(E.restore(s,B).sessions.at(-1).checkCorrect,false);assert.equal(E.challengeChoice(s,c,NOW+8*DAY),null);assert.ok(E.more(s,B,NOW+3));});
test('Correct confident challenge receives a matched application, but second distinct challenge waits for a later due visit',()=>{
 const s=ready();const a=block(s,r.challengeIndices[0],NOW,{checkIndex:r.applicationIndex});assert.equal(a.delayedProbe,true);assert.equal(a.retryIndex,r.applicationIndex);assert.equal(E.challengeChoice(s,c,NOW+1000),null);assert.equal(E.challengeChoice(s,c,NOW+16*DAY).index,r.challengeIndices[1]);
 block(s,r.challengeIndices[1],NOW+16*DAY,{checkIndex:r.applicationIndex});assert.equal(E.challengeChoice(s,c,NOW+40*DAY),null);
});
test('Help before the first answer never promotes to the second fresh challenge',()=>{const s=ready();block(s,r.challengeIndices[0],NOW,{assisted:true,checkIndex:r.applicationIndex});assert.equal(E.challengeChoice(s,c,NOW+16*DAY).index,r.challengeIndices[0]);});
test('An earlier-opened question answered next day cannot establish the cross-visit qualification',()=>{const s=ready();const a=s.sessions.at(-1);a.startedAt=s.sessions[1].completedAt+1;assert.equal(E.challengeChoice(s,c,NOW),null);});
test('Guests and unknown participant sessions do not qualify',()=>{for(const participant of ['guest','unknown']){const s=ready();s.sessions.at(-1).participant=participant;assert.equal(E.challengeChoice(s,c,NOW),null);}});
test('Every new skill uses its own support/application and remains reloadable without adding session fields',()=>{
 for(const topic of B.concepts.filter(c=>c.challengeRoutes))for(const route of topic.challengeRoutes)for(const right of [false,true]){
  const s=E.fresh(),a=E.start(s,B,T,topic.id);a.questionIndex=route.challengeIndices[0];a.selected=right?E.question(B,a).answer:(E.question(B,a).answer+1)%5;a.confidence=right?'sure':'unsure';E.submit(s,B,T+1);
  assert.equal(a.retryIndex,right?route.applicationIndex:route.supportIndex);assert.equal(E.retryQuestion(B,a).skill,route.skill);
  E.beginRetry(s);a.retrySelected=E.retryQuestion(B,a).answer;E.retry(s,B,T+2);const restored=E.restore(s,B);assert.equal(restored.sessions[0].questionIndex,a.questionIndex);assert.equal(restored.sessions[0].retryIndex,a.retryIndex);
 }
});
test('An escaped wrong legacy check without a timestamp withholds matched or unknown challenge promotion',()=>{
 for(const kind of ['matched','unknown','unrelated']){
  const s=ready();E.stop(s);const a=E.start(s,B,T+24*DAY,id);a.questionIndex=1;a.selected=E.question(B,a).answer;a.confidence='sure';E.submit(s,B,T+24*DAY+1);
  // A preserved old route may be left after an unsuccessful retry. It is not
  // a completed block, and its historical retry has no separate timestamp.
  a.targetedPractice=false;a.retryIndex=kind==='unrelated'?3:6;E.beginRetry(s);a.retrySelected=(E.retryQuestion(B,a).answer+1)%5;E.retry(s,B,T+24*DAY+2);E.stop(s);
  assert.equal(a.completedAt,0);assert.equal(a.stage,'retry');assert.equal(a.closed,true);
  if(kind==='unknown')delete a.retryIndex;
  const before=JSON.stringify(s),choice=E.challengeChoice(s,c,NOW);
  if(kind==='unrelated')assert.equal(choice.index,r.challengeIndices[0]);else assert.equal(choice,null);
  assert.equal(JSON.stringify(s),before);assert.equal(a.completedAt,0);assert.equal(a.retryAnswers.length,1);
 }
});
test('Later absorption or ATP-synthase proton-flow misses withhold the related challenge despite supported success',()=>{
 for(const [concept,missIndex] of [['digestion-absorption',1],['respiration-coupling',2]]){
  const topic=B.concepts.find(c=>c.id===concept),route=topic.challengeRoutes[0],s=E.fresh();
  assert.ok(route.relatedIndices.includes(missIndex));assert.ok(!route.baselineIndices.includes(missIndex));
  function finish(index,at,wrong=false,assisted=false){E.stop(s);const a=E.start(s,B,at,concept);a.questionIndex=index;a.assisted=assisted;a.selected=wrong?(E.question(B,a).answer+1)%5:E.question(B,a).answer;a.confidence='sure';E.submit(s,B,at+1);E.beginRetry(s);a.retrySelected=E.retryQuestion(B,a).answer;E.retry(s,B,at+2);E.stop(s);return a;}
  finish(route.baselineIndices[0],T,false,true);finish(route.baselineIndices[0],T+8*DAY);finish(route.baselineIndices[0],T+16*DAY);
  assert.equal(E.challengeChoice(s,topic,NOW).index,route.challengeIndices[0]);
  const miss=finish(missIndex,T+24*DAY,true);assert.equal(miss.checkCorrect,true);assert.equal(E.challengeChoice(s,topic,NOW),null);
 }
});
test('Diffusion application states the material and other controlled conditions',()=>{const topic=B.concepts.find(c=>c.id==='gas-exchange'),q=topic.questions[topic.challengeRoutes[0].applicationIndex];assert.match(q.prompt,/membrane material/);assert.match(q.prompt,/all other conditions are fixed/);});
