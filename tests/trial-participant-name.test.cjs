const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/imat-trial-engine.js'),S=require('../src/sync-model.js'),B=require('../src/imat-trial-transfer-content.js');
const T=Date.parse('2026-11-06T10:00:00Z');
test('guest nicknames are normalized and bounded; learner names are ignored',()=>{
 const a=E.start(E.fresh(),B,T,{}, {participant:'guest',participantName:'  QA\t külaline\n  '});assert.equal(a.participantName,'QA külaline');
 assert.equal(E.normalizeParticipantName('QA\u200bkülaline'),'QA külaline');assert.equal(E.normalizeParticipantName(' '.repeat(90)),'');assert.equal(E.normalizeParticipantName(null),'');
 assert.equal(E.normalizeParticipantName('Q'.repeat(65)).length,60);assert.equal(E.normalizeParticipantName('Q'.repeat(59)+'😀'),'Q'.repeat(59));
 assert.equal(E.start(E.fresh(),B,T,{}, {participant:'learner',participantName:'QA külaline'}).participantName,undefined);
 const old=E.start(E.fresh(),B,T);assert.equal(old.participantName,undefined);assert.equal(E.restore({version:1,serial:1,cards:{},sessions:[old],activeId:old.id}).sessions[0].participantName,undefined);
});
test('resuming an old attempt never retroactively adds a guest nickname',()=>{
 const state=E.fresh(),old=E.start(state,B,T),before=structuredClone(old);
 assert.deepEqual(E.start(state,B,T+100,{}, {participant:'guest',participantName:'QA külaline'}),before);
});
test('engine and sync merging preserve the original guest name before and after submission',()=>{
 for(const frozen of [false,true]){
  const remote=E.fresh(),a=E.start(remote,B,T,{}, {participant:'guest',participantName:'QA külaline'}),base=E.restore(remote),local=E.restore(remote),draft=E.active(local);
  draft.participantName='QA changed';draft.participant='learner';draft.deadline+=600000;E.answer(draft,B.questions[0].id,0,T+100);if(frozen)E.freeze(draft,B,T+200);
  const viaEngine=E.merge(base,local,remote),viaSync=S.merge(E.KEY,base,local,remote);
  assert.deepEqual(viaEngine,viaSync);assert.equal(E.active(viaSync).participantName,'QA külaline');assert.equal(E.active(viaSync).participant,'guest');assert.equal(E.active(viaSync).deadline,a.deadline);
 }
});
test('missing historical name stays unknown during merge instead of accepting later relabelling',()=>{
 const old=E.fresh();E.start(old,B,T,{}, {participant:'guest'});const incoming=E.restore(old);E.active(incoming).participantName='QA külaline';E.active(incoming).updatedAt=T+100;
 assert.equal(E.active(E.merge(old,incoming,old)).participantName,undefined);assert.equal(E.active(S.merge(E.KEY,old,incoming,old)).participantName,undefined);
});
