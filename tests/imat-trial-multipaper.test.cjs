const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/imat-trial-engine.js'),OLD=require('../src/imat-trial-content.js'),NEW=require('../src/imat-trial-transfer-content.js');
const now=Date.parse('2026-11-06T15:00:00Z'),papers=[NEW,OLD];
test('every saved paper resolves by exact identity; a mismatched bank cannot score a trial',()=>{
 const s=E.fresh(),a=E.start(s,OLD,now);E.answer(a,OLD.questions[0].id,OLD.questions[0].answer,now+100);
 assert.equal(E.resolvePaper(papers,a),OLD);assert.equal(E.resolvePaper({old:OLD,new:NEW},a.paper),OLD);
 assert.equal(E.freeze(a,NEW,now+200),false);assert.equal(a.status,'timed');assert.equal(a.timedResult,undefined);
 assert.equal(E.freeze(a,papers,now+300),true);assert.equal(a.timedResult.correct,1);assert.equal(a.results[0].id,OLD.questions[0].id);
 E.second(a,now+400);assert.equal(E.review(a,NEW,now+500),false);assert.equal(a.status,'untimed');assert.ok(E.review(a,papers,now+600));
});
test('requesting the new simulation preserves every stage and original deadline of an unfinished official trial',()=>{
 for(const stage of ['timed','choice','untimed']){
  let s=E.fresh(),a=E.start(s,OLD,now);E.answer(a,OLD.questions[0].id,2,now+100);
  if(stage!=='timed')E.freeze(a,OLD,now+200);if(stage==='untimed')E.second(a,now+300);
  s=E.restore(s);a=E.active(s);const before=structuredClone(a);
  const resumed=E.start(s,NEW,now+1000,{}, {participant:'learner'});
  assert.deepEqual(resumed,before);assert.equal(s.sessions.length,1);assert.equal(resumed.participant,undefined);
  s.activeId=null;assert.equal(E.start(s,NEW,now+2000).id,a.id,'an inactive unfinished trial is recovered, not replaced');
 }
});
test('fresh transfer snapshots freeze at their deadline across reload and optional untimed reconsideration',()=>{
 let s=E.fresh(),a=E.start(s,NEW,now,{}, {participant:'learner'});const q=NEW.questions[0];
 E.answer(a,q.id,(q.answer+1)%5,now+100);const deadline=a.deadline;
 s=E.restore(s);a=E.active(s);assert.equal(E.answer(a,q.id,q.answer,deadline),false);E.freeze(a,papers,deadline+600000);
 assert.equal(a.timedSubmittedAt,deadline);assert.equal(a.timedResult.wrong,1);assert.equal(a.expired,true);assert.equal(a.participant,'learner');
 E.second(a,deadline+600001);E.answer(a,q.id,q.answer,deadline+600002);E.review(a,papers,deadline+600003);
 assert.equal(a.secondResult.correct,1);assert.equal(a.timedResult.wrong,1);assert.equal(a.completedAt,deadline);
});
test('the old and new papers coexist through merging; frozen identity and attribution survive stale drafts',()=>{
 const old=E.fresh(),a=E.start(old,OLD,now);E.answer(a,OLD.questions[0].id,OLD.questions[0].answer,now+1);E.freeze(a,OLD,now+2);E.review(a,OLD,now+3);old.activeId=null;
 const local=E.restore(old),fresh=E.start(local,NEW,now+1000,{}, {participant:'guest'}),draft=E.restore(local);
 E.answer(fresh,NEW.questions[0].id,NEW.questions[0].answer,now+1100);E.freeze(fresh,NEW,now+1200);
 const stale=draft.sessions.find(x=>x.id===fresh.id);stale.paper=OLD.id;stale.participant='learner';stale.updatedAt=now+99999;
 const merged=E.merge(old,draft,local),saved=merged.sessions.find(x=>x.id===fresh.id);
 assert.equal(merged.sessions.length,2);assert.deepEqual(merged.sessions.find(x=>x.id===a.id),a);assert.equal(saved.paper,NEW.id);assert.equal(saved.participant,'guest');assert.equal(saved.paperOrigin,'original');assert.equal(saved.timedResult.correct,1);
});
test('new participant metadata is explicit and absent from unchanged old records',()=>{
 const old=E.start(E.fresh(),OLD,now);assert.equal(old.participant,undefined);
 for(const participant of ['learner','guest'])assert.equal(E.start(E.fresh(),NEW,now,{}, {participant}).participant,participant);
 assert.equal(E.start(E.fresh(),NEW,now,{}, {participant:'invented'}).participant,undefined);
});
test('repeat labels are paper-specific and preserve uncertainty about the human answering',()=>{
 const s=E.fresh(),a=E.start(s,OLD,now);E.freeze(a,OLD,now+1);E.review(a,OLD,now+2);s.activeId=null;
 const b=E.start(s,NEW,now+3,{}, {participant:'guest'});assert.equal(b.repeated,false);E.freeze(b,NEW,now+4);E.review(b,NEW,now+5);s.activeId=null;
 const c=E.start(s,NEW,now+6,{}, {participant:'learner'});assert.equal(c.repeated,true);assert.equal(c.participant,'learner');
});
test('unknown paper records are retained and never silently assigned to the newest bank',()=>{
 const s=E.fresh(),a=E.start(s,OLD,now);a.paper='unknown-future-paper';const restored=E.restore(s),copy=structuredClone(restored);
 assert.equal(E.resolvePaper(papers,E.active(restored)),null);assert.equal(E.freeze(E.active(restored),papers,now+1),false);assert.deepEqual(restored,copy);
});
