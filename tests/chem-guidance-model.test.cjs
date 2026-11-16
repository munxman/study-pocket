const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../src/quant-engine.js'),B=require('../src/chemistry-content.js'),Q=require('../src/quant-content.js');
const NOW=Date.parse('2026-11-16T23:00:00+02:00'),OLD=NOW-2*E.DAY,CONCEPT='concentration_dilution',SKILL='dilution_amount_conservation';
function first(s,at,correct=false,confidence='sure'){const a=E.active(s),q=E.topic(B,a).questions[a.questionIndex];a.selected=correct?q.answer:(q.answer+1)%q.options.length;a.confidence=confidence;assert.ok(E.submit(s,B,at));return a;}
function finish(s,at,correct=true){E.beginCheck(s);const a=E.active(s),q=E.topic(B,a).questions[a.checkIndex];a.checkSelected=correct?q.answer:(q.answer+1)%q.options.length;assert.ok(E.check(s,B,at));return a;}
function miss(skill=SKILL,concept=CONCEPT){const s=E.fresh();E.startSkill(s,B,OLD,concept,skill);first(s,OLD+1);finish(s,OLD+2);return s;}

test('home recommendation replays the exact unresolved chemistry skill without changing history',()=>{
 const s=miss(),before=structuredClone(s),r=E.recommendSkill(s,B,NOW);
 assert.equal(r.concept,CONCEPT);assert.equal(r.skill,SKILL);assert.equal(r.lastEvidenceAt,OLD+1);assert.equal(r.dueAt,OLD+2+E.DAY);assert.equal(r.eligible,true);assert.equal(r.reason,'unresolved-skill');assert.deepEqual(s,before);
});
test('a supported correct check or another skill success does not clear the original chemistry miss',()=>{
 const s=miss();E.startSkill(s,B,OLD+100,CONCEPT,'stock_volume_transfer');first(s,OLD+101,true);finish(s,OLD+102,true);
 const r=E.recommendSkill(s,B,NOW);assert.equal(r.skill,SKILL);
});
test('wrong matched checks and correct unsure first answers remain eligible needs',()=>{
 for(const kind of ['check','uncertain']){const s=E.fresh();E.startSkill(s,B,OLD,CONCEPT,SKILL);first(s,OLD+1,true,kind==='uncertain'?'unsure':'sure');finish(s,OLD+2,kind!=='check');assert.equal(E.recommendSkill(s,B,NOW).skill,SKILL);}
});
test('a later independent confident success can reduce targeting; supported success cannot',()=>{
 const s=miss();E.startSkill(s,B,NOW,CONCEPT,SKILL);first(s,NOW+1,true);assert.equal(E.active(s).delayedProbe,true);finish(s,NOW+2);assert.equal(E.recommendSkill(s,B,NOW+2*E.DAY),null);
 const helped=miss();E.startSkill(helped,B,NOW,CONCEPT,SKILL);E.help(helped,NOW+1);E.beginCheck(helped);first(helped,NOW+2,true);finish(helped,NOW+3);assert.equal(E.recommendSkill(helped,B,NOW+2*E.DAY).skill,SKILL);
});
test('missing historical support flags cannot clear the original need and are not rewritten',()=>{
 const s=miss();E.startSkill(s,B,NOW,CONCEPT,SKILL);first(s,NOW+1,true);finish(s,NOW+2);delete s.sessions[1].assisted;const before=structuredClone(s);assert.equal(E.recommendSkill(s,B,NOW+2*E.DAY).skill,SKILL);assert.deepEqual(s,before);
});
test('recent teaching and external related exposure postpone the recommendation',()=>{
 const s=miss();assert.equal(E.recommendSkill(s,B,OLD+E.DAY),null);s.cards[CONCEPT].lastExternalExposure=NOW-1000;s.cards[CONCEPT].lastExposure=NOW-1000;assert.equal(E.recommendSkill(s,B,NOW),null);assert.equal(E.recommendSkill(s,B,NOW+E.DAY).skill,SKILL);
});
test('targeted start selects an unseen authored variant of that skill and keeps the check matched',()=>{
 const s=miss(),before=structuredClone(s.sessions),old=s.sessions[0],next=E.startSkill(s,B,NOW,CONCEPT,SKILL);
 assert.equal(next.initialSkill,SKILL);assert.equal(next.repeatedQuestion,false);assert.notEqual(next.questionIndex,old.questionIndex);assert.notEqual(next.questionIndex,old.checkIndex);assert.deepEqual(s.sessions.slice(0,-1),before);first(s,NOW+1,true);assert.equal(next.checkSkill,SKILL);assert.notEqual(next.checkIndex,next.questionIndex);assert.equal(E.restore(s,B).sessions.length,2);
});
test('targeting a different skill never replaces unfinished same-concept work',()=>{
 const s=E.fresh(),a=E.startSkill(s,B,OLD,CONCEPT,'stock_volume_transfer');first(s,OLD+1,false);E.beginCheck(s);a.checkSelected=1;const before=structuredClone(a);
 assert.deepEqual(E.startSkill(s,B,NOW,CONCEPT,SKILL),before);assert.equal(s.sessions.length,1);
});
test('early targeted practice and a question left open overnight cannot gain delayed credit',()=>{
 const s=miss(),a=E.startSkill(s,B,OLD+100,CONCEPT,SKILL);assert.equal(a.delayedEligibleAtStart,false);first(s,NOW,true);assert.equal(a.delayedProbe,false);
});
test('invalid skill and concept requests fall back safely without changing existing records',()=>{
 const s=miss(),before=structuredClone(s.sessions);const a=E.startSkill(s,B,NOW,CONCEPT,'not-a-skill');assert.ok(B.topics.find(t=>t.id===CONCEPT).questions[a.questionIndex]);assert.deepEqual(s.sessions.slice(0,-1),before);assert.equal(E.startSkill(E.fresh(),B,NOW,'unknown',SKILL),null);
});
test('guest, unknown-participant, future, duplicate and unreadable records cannot select personal gaps',()=>{
 for(const participant of ['guest','unknown']){const s=miss();s.sessions[0].participant=participant;assert.equal(E.recommendSkill(s,B,NOW),null);}
 const future=miss();future.sessions[0].startedAt=NOW+1;future.sessions[0].answeredAt=NOW+2;future.sessions[0].completedAt=NOW+3;future.sessions[0].checkAnsweredAt=NOW+3;assert.equal(E.recommendSkill(future,B,NOW),null);
 const duplicate=miss();duplicate.sessions.push(structuredClone(duplicate.sessions[0]));assert.equal(E.recommendSkill(duplicate,B,NOW),null);
 assert.equal(E.recommendSkill('{broken',B,NOW),null);assert.equal(E.recommendSkill(E.fresh(),B,NaN),null);
});
test('legacy mismatched check success cannot repair the first skill and a wrong check targets its own skill',()=>{
 const s=miss(),a=s.sessions[0];delete a.routingVersion;delete a.routeIndex;delete a.initialSkill;delete a.checkSkill;a.contentVersion=1;a.questionIndex=0;a.checkIndex=5;a.correct=true;a.checkCorrect=false;
 const before=structuredClone(a);assert.equal(E.recommendSkill(s,B,NOW).skill,SKILL);assert.deepEqual(a,before);
});

function screen(search,state){
 let saved=state?JSON.stringify(state):null,url='';const main={innerHTML:'',events:{},addEventListener(k,f){this.events[k]=f;},focus(){}};
 const context={QuantEngine:E,QuantContent:Q,ChemistryContent:B,StudySync:{storage:{getItem:()=>saved,setItem:(k,v)=>saved=v},subscribe(){}},document:{getElementById:()=>main},location:{search,hash:''},history:{replaceState(a,b,value){url=value;}},URLSearchParams,Date:class extends Date{static now(){return NOW;}}};context.window=context;
 vm.runInNewContext(fs.readFileSync(require.resolve('../src/quant.js'),'utf8'),context);
 return {state:()=>JSON.parse(saved),main,url};
}
test('targeted chemistry URL starts the intended skill and consumes parameters without losing its saved state',()=>{
 const h=screen('?subject=chemistry&concept='+CONCEPT+'&skill='+SKILL,E.fresh()),a=E.active(h.state());assert.equal(a.initialSkill,SKILL);assert.equal(h.url,'./quant.html?subject=chemistry');assert.equal(a.answeredAt,0);assert.equal(a.assisted,false);assert.match(h.main.innerHTML,/quant-answer/);
 const reload=screen('?subject=chemistry',h.state());assert.equal(E.active(reload.state()).id,a.id);
});
test('targeted chemistry URL resumes a prior check unchanged even when the recommended skill differs',()=>{
 const s=E.fresh(),a=E.startSkill(s,B,OLD,CONCEPT,'stock_volume_transfer');first(s,OLD+1);E.beginCheck(s);a.checkSelected=2;const before=structuredClone(a),h=screen('?subject=chemistry&concept='+CONCEPT+'&skill='+SKILL,s);assert.deepEqual(E.active(h.state()),before);
});
test('plan-origin chemistry keeps the marker and offers the next recommendation after completion',()=>{
 const h=screen('?subject=chemistry&concept='+CONCEPT+'&skill='+SKILL+'&from=plan',E.fresh());assert.equal(h.url,'./quant.html?subject=chemistry&from=plan');
 const done=h.state();first(done,NOW+1,true);finish(done,NOW+2);const saved=structuredClone(done),result=screen('?subject=chemistry&from=plan',done);
 assert.match(result.main.innerHTML,/<a class="backup-primary" href="\.\/index.html">Järgmine soovitus<\/a>/);assert.match(result.main.innerHTML,/class="backup-secondary" data-action="more"/);assert.deepEqual(result.state(),saved);
 const normal=screen('?subject=chemistry',done);assert.doesNotMatch(normal.main.innerHTML,/Järgmine soovitus/);assert.match(normal.main.innerHTML,/class="backup-primary" data-action="more"/);
});
test('an intentional generic guided chemistry link opens one next attempt and consumes that intent',()=>{
 const s=miss(),before=structuredClone(s.sessions[0]),h=screen('?subject=chemistry&from=plan&next=1',s),next=E.active(h.state());
 assert.equal(h.state().sessions.length,2);assert.notEqual(next.id,before.id);assert.equal(next.stage,'question');assert.deepEqual(h.state().sessions[0],before);assert.equal(h.url,'./quant.html?subject=chemistry&from=plan');
 const done=h.state();first(done,NOW+1,true);finish(done,NOW+2);const reload=screen('?subject=chemistry&from=plan',done);assert.equal(reload.state().sessions.length,2);assert.equal(E.active(reload.state()).id,next.id);assert.equal(E.active(reload.state()).stage,'done');assert.match(reload.main.innerHTML,/Järgmine soovitus/);
});
test('generic guided next resumes an active unfinished draft or another saved waiting attempt',()=>{
 const s=miss(),waiting=E.startSkill(s,B,OLD+100,CONCEPT,SKILL);waiting.selected=2;waiting.confidence='unsure';const before=structuredClone(waiting);
 const active=screen('?subject=chemistry&from=plan&next=1',s);assert.deepEqual(E.active(active.state()),before);assert.equal(active.state().sessions.length,2);assert.equal(active.url,'./quant.html?subject=chemistry&from=plan');
 s.activeId=s.sessions[0].id;const resumed=screen('?subject=chemistry&from=plan&next=1',s);assert.deepEqual(E.active(resumed.state()),before);assert.equal(resumed.state().sessions.length,2);
});
test('generic chemistry without the plan next marker keeps its completed result',()=>{
 const s=miss(),before=structuredClone(s);
 for(const query of ['?subject=chemistry','?subject=chemistry&from=plan','?subject=chemistry&next=1','?subject=chemistry&from=plan&next=0']){const h=screen(query,s);assert.deepEqual(h.state(),before);assert.equal(E.active(h.state()).stage,'done');assert.equal(h.url,'');}
});
test('an explicit next request with no eligible ordinary item shows topic choice without duplicating the prior result',()=>{
 const s=E.fresh();let at=NOW-1000;
 for(const t of B.topics)for(const i of E.FIRST){E.startSkill(s,B,at,t.id,t.questions[i].skill);first(s,at+1,true);finish(s,at+2);at+=10;}
 assert.equal(E.candidate(s,B,NOW),null);const before=structuredClone(s.sessions),h=screen('?subject=chemistry&from=plan&next=1',s);assert.equal(E.active(h.state()),null);assert.deepEqual(h.state().sessions,before);assert.match(h.main.innerHTML,/Soovi korral vali harjutamiseks teema/);assert.equal(h.url,'./quant.html?subject=chemistry&from=plan');
});
