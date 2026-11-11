const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../src/sync-model.js');
const T=Date.UTC(2026,10,10,12),keys=['hendrik-maths-v1','hendrik-physics-v1','hendrik-chemistry-v1'];
const state=(...sessions)=>({version:1,serial:sessions.length,cards:{},sessions,activeId:sessions.at(-1)?.id||null});
const draft=(extra={})=>({id:'quant-test',kind:'quantitative',concept:'formula',startedAt:T,stage:'question',questionIndex:0,checkIndex:2,selected:null,checkSelected:null,confidence:null,answeredAt:0,completedAt:0,assisted:false,initialProbe:false,delayedProbe:false,delayedEligibleAtStart:true,repeatedQuestion:false,contentVersion:1,...extra});
const first=(extra={})=>draft({stage:'lesson',selected:1,confidence:'sure',unknown:false,correct:false,answeredAt:T+100,taughtAt:T+100,delayedProbe:true,...extra});
const done=(extra={})=>first({stage:'done',checkSelected:2,checkCorrect:false,checkAnsweredAt:T+200,completedAt:T+200,...extra});
const routed=(extra={})=>draft({routingVersion:1,routeIndex:0,initialSkill:'exact_skill',checkSkill:'exact_skill',contentVersion:2,...extra});
const merge=(key,base,local,remote)=>S.merge(key,base&&state(base),state(local),state(remote)).sessions[0];

test('All three quantitative modules round-trip old questions, lessons, checks and completions without migration',()=>{
 for(const key of keys)for(const row of [draft({selected:2,confidence:'unsure'}),draft({assisted:true,taughtAt:T+1,stage:'lesson'}),first({stage:'check',checkSelected:1}),done()]){
  const before=state(row),saved=JSON.stringify(before),out=S.merge(key,before,structuredClone(before),structuredClone(before));
  assert.deepEqual(out,before);assert.equal(JSON.stringify(before),saved);
  for(const field of ['initialSkill','checkSkill','routingVersion','routeIndex','checkRepeatedQuestion'])assert.equal(Object.hasOwn(out.sessions[0],field),false);
 }
});
test('First submission may choose the provisional follow-up, then freezes its question and route identity',()=>{
 for(const key of keys){
  const before=routed(),submitted={...before,...first(),contentVersion:2,routingVersion:1,routeIndex:0,initialSkill:'exact_skill',checkSkill:'exact_skill',checkIndex:7,checkRepeatedQuestion:false};
  assert.deepEqual(merge(key,before,submitted,before),submitted);
  const changed={...submitted,questionIndex:1,routeIndex:1,initialSkill:'other_skill',stage:'done',checkIndex:8,checkCorrect:true,completedAt:T+300};
  assert.deepEqual(merge(key,submitted,changed,submitted),submitted);
  const switchedCheck={...submitted,stage:'check',checkIndex:8,checkSkill:'other_skill',checkSelected:0};
  assert.deepEqual(merge(key,submitted,switchedCheck,submitted),submitted);
 }
});
test('Concurrent different first answers select one whole branch; later mismatched stages cannot attach',()=>{
 for(const key of keys){
  const before=draft(),earlier=first(),later=done({selected:0,correct:true,checkIndex:3,answeredAt:T+150,checkAnsweredAt:T+250,completedAt:T+250});
  for(const [local,remote] of [[earlier,later],[later,earlier]]){
   const out=merge(key,before,local,remote);assert.deepEqual(out,earlier);assert.equal(out.stage,'lesson');assert.equal(Object.hasOwn(out,'checkCorrect'),false);
  }
 }
});
test('Completed check answers and clocks freeze while continuation and separate unfinished sessions survive',()=>{
 for(const key of keys){
  const before=done(),rewritten={...before,checkSelected:0,checkCorrect:true,checkAnsweredAt:T+400,completedAt:T+400,moreChosen:true};
  assert.deepEqual(merge(key,before,rewritten,before),{...before,moreChosen:true});
  const next=draft({id:'next',concept:'other',startedAt:T+500,selected:3,confidence:'unsure'}),out=S.merge(key,state(before),state(rewritten,next),state(before));
  assert.equal(out.activeId,next.id);assert.equal(out.sessions.length,2);assert.deepEqual(out.sessions[0],{...before,moreChosen:true});assert.deepEqual(out.sessions[1],next);
 }
});
test('Matching first answers retain later progress and choose one entire unsubmitted check draft',()=>{
 for(const key of keys){
  const before=first(),local={...before,stage:'check',checkSelected:1},remote={...before,checkSelected:2};
  assert.deepEqual(merge(key,before,local,remote),local);
  const complete=done();assert.deepEqual(merge(key,before,local,complete),complete);
  const conflict=done({checkSelected:3,checkCorrect:true,checkAnsweredAt:T+300,completedAt:T+300});
  assert.deepEqual(merge(key,before,conflict,complete),complete);
 }
});
test('Earlier help conservatively removes delayed credit without changing first/check facts; later help cannot',()=>{
 for(const key of keys){
  const before=draft(),answer=done(),help=draft({stage:'lesson',assisted:true,helpedAt:T+50,taughtAt:T+50});
  const out=merge(key,before,help,answer);assert.equal(out.assisted,true);assert.equal(out.delayedProbe,false);assert.equal(out.helpedAt,T+50);
  for(const k of ['selected','correct','answeredAt','checkIndex','checkSelected','checkCorrect','checkAnsweredAt','completedAt','stage'])assert.deepEqual(out[k],answer[k],k);
  assert.deepEqual(merge(key,before,{...help,helpedAt:T+150,taughtAt:T+150},answer),answer);
  const legacyHelp={...help};delete legacyHelp.helpedAt;assert.equal(merge(key,before,legacyHelp,answer).delayedProbe,false);
 }
});
test('A saved legacy route cannot acquire modern routing metadata from another device',()=>{
 for(const key of keys){const old=first(),changed={...old,routingVersion:1,routeIndex:0,initialSkill:'invented',checkSkill:'invented',contentVersion:2,stage:'check'};assert.deepEqual(merge(key,old,changed,old),old);}
});
test('Missing snapshots cannot erase a known baseline, and routine progression never rewrites historical flags',()=>{
 for(const key of keys){
  const old=first({assisted:true,delayedProbe:true}),progress={...old,stage:'check',checkSelected:2};
  assert.deepEqual(merge(key,old,progress,old),progress);
  assert.deepEqual(S.merge(key,state(old),state(),state()).sessions,[old]);
  assert.deepEqual(S.merge(key,state(old),state({...old,selected:3,correct:true}),state()).sessions,[old]);
 }
});
test('External teaching exposure survives newer cards from an older offline client',()=>{
 for(const key of keys){
  const before=state(done()),local=structuredClone(before),remote=structuredClone(before);
  before.cards.formula={lastExposure:T+400,lastAt:T+400,lastExternalExposure:T+300,due:T+1000};
  local.cards.formula={lastExposure:T+500,lastAt:T+500,due:T+2000};
  remote.cards.formula={lastExposure:T+600,lastAt:T+600,lastExternalExposure:T+200,due:T+3000};
  const out=S.merge(key,before,local,remote);assert.equal(out.cards.formula.lastExternalExposure,T+300);assert.equal(out.cards.formula.lastAt,T+600);
  local.cards.formula.lastExternalExposure=T+700;assert.equal(S.merge(key,before,local,remote).cards.formula.lastExternalExposure,T+700);
 }
});
test('Merged video exposure only downgrades new routed answers before or during their first response',()=>{
 for(const key of keys){
  const before=routed(),answer={...done(),routingVersion:1,routeIndex:0,initialSkill:before.initialSkill,checkSkill:before.checkSkill,contentVersion:2,checkRepeatedQuestion:false};
  for(const at of [T-1000,T+50,answer.answeredAt,answer.answeredAt+1,answer.answeredAt-86400000]){
   const local=state(answer),remote=state(before);remote.cards.formula={lastExternalExposure:at,lastExposure:at};
   const out=S.merge(key,state(before),local,remote).sessions[0],during=at>=answer.startedAt&&at<=answer.answeredAt,recent=at<=answer.answeredAt&&answer.answeredAt-at<86400000;
   assert.equal(out.delayedProbe,!(during||recent));assert.equal(out.assisted,during);
   if(during)assert.equal(out.helpedAt,at);else assert.equal(Object.hasOwn(out,'helpedAt'),false);
   for(const field of ['selected','correct','confidence','unknown','questionIndex','checkIndex','checkSelected','checkCorrect','answeredAt','checkAnsweredAt','completedAt','startedAt','stage','routingVersion','routeIndex','initialSkill','checkSkill'])assert.deepEqual(out[field],answer[field],field);
   assert.deepEqual(local,state(answer),'merge must not modify either input');
  }
  const alreadyHelped={...answer,assisted:true,delayedProbe:false,helpedAt:T+10},remote=state(before);remote.cards.formula={lastExternalExposure:T+50};
  assert.equal(S.merge(key,state(before),state(alreadyHelped),remote).sessions[0].helpedAt,T+10);
  const old=done(),oldRemote=state(draft());oldRemote.cards.formula={lastExternalExposure:T+50};
  assert.deepEqual(S.merge(key,state(draft()),state(old),oldRemote).sessions[0],old,'legacy saved flags remain unchanged');
 }
});
test('Real new routes and unfinished legacy sessions survive submission, offline merge and engine restore together',()=>{
 const E=require('../src/quant-engine.js'),banks=[...Object.values(require('../src/quant-content.js').subjects),require('../src/chemistry-content.js')];
 for(const b of banks){
  const s=E.fresh(),a=E.start(s,b,T),topic=E.topic(b,a),old=first({id:'legacy-unfinished',concept:topic.id,questionIndex:1,checkIndex:2,stage:'check',checkSelected:2,startedAt:T-1000,answeredAt:T-900,taughtAt:T-900});
  assert.equal(a.routingVersion,1);s.sessions.unshift(old);s.serial++;const baseline=structuredClone(s),savedOld=structuredClone(old);
  a.selected=topic.questions[a.questionIndex].answer;a.confidence='unsure';assert.equal(E.submit(s,b,T+100),true);assert.equal(E.beginCheck(s),true);a.checkSelected=(topic.questions[a.checkIndex].answer+1)%4;
  const paused=E.restore(JSON.stringify(S.merge(b.key,baseline,s,baseline)),b);assert.equal(E.active(paused).stage,'check');assert.equal(E.active(paused).checkSelected,a.checkSelected);
  assert.equal(E.check(paused,b,T+200),true);const restored=E.restore(JSON.stringify(S.merge(b.key,baseline,paused,baseline)),b);
  assert.deepEqual(restored.sessions.find(x=>x.id===old.id),savedOld);assert.equal(E.active(restored).checkCorrect,false);assert.equal(E.active(restored).routingVersion,1);assert.equal(restored.sessions.length,2);
 }
});
test('Reports use exact authored first/check skills and route metadata without exposing answers',async()=>{
 const {eventsFor}=await import('../src/lib/learning-report.js'),banks=[...Object.values(require('../src/quant-content.js').subjects),require('../src/chemistry-content.js')];
 for(const b of banks){
  const topic=b.topics[0],route=topic.followups[0];
  const row=done({concept:topic.id,questionIndex:0,checkIndex:route.simpleIndex,routingVersion:1,routeIndex:0,initialSkill:route.skill,checkSkill:route.skill,checkRepeatedQuestion:true,contentVersion:2,reflection:'PRIVATE WORK'}),saved=JSON.stringify(row);
  const result=eventsFor({[b.key]:state(row)},T+1000),initial=result.events.find(e=>e.kind==='first_answer'),check=result.events.find(e=>e.kind==='immediate_check');
  assert.equal(initial.skill,topic.questions[row.questionIndex].skill);assert.equal(check.skill,topic.questions[row.checkIndex].skill);
  for(const e of [initial,check])for(const field of ['initialSkill','checkSkill','routingVersion','routeIndex','checkRepeatedQuestion','contentVersion'])assert.equal(e[field],row[field],field);
  assert.equal(initial.correct,false);assert.equal(initial.delayedProbe,true);assert.equal(check.independent,false);assert.equal(check.correct,false);
  assert.equal(JSON.stringify(row),saved);assert.doesNotMatch(JSON.stringify(result),/PRIVATE WORK|checkSelected|"selected"|"options"|"answers"/);
  for(const invalid of [{initialSkill:'PRIVATE FORGED SKILL'},{checkSkill:'PRIVATE FORGED SKILL'},{routingVersion:99},{routeIndex:999},{questionIndex:999}]){
   const bad=eventsFor({[b.key]:state({...row,...invalid})},T+1000);
   for(const e of bad.events.filter(e=>['first_answer','immediate_check'].includes(e.kind))){assert.equal(e.skill,null);assert.equal(e.routingVersion,null);assert.equal(e.routeIndex,null);}
   assert.doesNotMatch(JSON.stringify(bad),/PRIVATE/);
  }
 }
});
test('Historical report skills come from the actual authored index; unknown indices and routes remain unknown',async()=>{
 const {eventsFor}=await import('../src/lib/learning-report.js'),banks=[...Object.values(require('../src/quant-content.js').subjects),require('../src/chemistry-content.js')];
 for(const b of banks){
  const topic=b.topics[0],old=done({concept:topic.id,questionIndex:1,checkIndex:3,correct:true,checkCorrect:false,delayedProbe:true}),unknown=done({id:'unknown',concept:topic.id,questionIndex:6,checkIndex:998});
  const input={[b.key]:state(old,unknown)},saved=JSON.stringify(input),events=eventsFor(input,T+1000).events;
  for(const e of events.filter(e=>['first_answer','immediate_check'].includes(e.kind))){assert.equal(e.routingVersion,null);assert.equal(e.routeIndex,null);assert.equal(e.checkRepeatedQuestion,null);if(e.sessionId==='unknown'){assert.equal(e.skill,null);assert.equal(e.initialSkill,null);assert.equal(e.checkSkill,null);}else assert.equal(e.skill,topic.questions[e.kind==='first_answer'?1:3].skill);}
  assert.equal(events.find(e=>e.sessionId===old.id&&e.kind==='first_answer').delayedProbe,true);assert.equal(JSON.stringify(input),saved);
 }
});

test('Overview support needs retain an older wrong skill after another skill succeeds and clears the topic card',async()=>{
 const {summarize}=await import('../src/lib/overview-model.js'),banks=[...Object.values(require('../src/quant-content.js').subjects),require('../src/chemistry-content.js')],DAY=86400000;
 for(const b of banks){
  const topic=b.topics[0],wrong=done({id:'old-wrong',concept:topic.id,startedAt:T-10*DAY,answeredAt:T-10*DAY+100,taughtAt:T-10*DAY+100,checkAnsweredAt:T-10*DAY+200,completedAt:T-10*DAY+200,questionIndex:0,correct:false,checkIndex:2,checkCorrect:true,delayedProbe:false});
  const other=done({id:'recent-other',concept:topic.id,questionIndex:1,correct:true,checkIndex:3,checkCorrect:true}),module=state(wrong,other);module.cards[topic.id]={needsHelp:false,failures:0,due:T+3*DAY};
  const input={[b.key]:module},saved=JSON.stringify(input),report=summarize(input,'1',T+1000).modules.find(m=>m.id===b.key.split('-')[1]),c=report.concepts[0];
  assert.equal(report.attempts,1);assert.equal(report.correct,1);assert.equal(report.delayed,1);assert.equal(report.completed,1);assert.equal(c.needsHelp,true);assert.equal(c.skillEvidenceUnknown,false);
  assert.ok(c.unresolvedSkills.some(x=>x.skill===topic.questions[0].skill));assert.ok(c.unresolvedSkills.every(x=>x.skill!==topic.questions[1].skill));assert.equal(c.unresolvedSkills.find(x=>x.skill===topic.questions[0].skill).title,topic.followups[0].title);
  assert.equal(JSON.stringify(input),saved);
  const unknown=done({id:'unknown-old',concept:topic.id,questionIndex:6,checkIndex:998,correct:false,checkCorrect:false}),uncertain=state(unknown,other);uncertain.cards[topic.id]={needsHelp:false};
  const u=summarize({[b.key]:uncertain},'all',T+1000).modules.find(m=>m.id===b.key.split('-')[1]).concepts[0];
  assert.equal(u.needsHelp,true);assert.equal(u.skillEvidenceUnknown,true);assert.deepEqual(u.unresolvedSkills,[]);
 }
});
