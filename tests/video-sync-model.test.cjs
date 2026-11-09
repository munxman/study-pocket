const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/video-engine.js'),B=require('../src/video-content.js'),S=require('../src/sync-model.js'),M=require('../src/backup-model.js');
const K=E.MODULE_ID,T=Date.parse('2026-11-09T10:00:00Z');
function started(){const s=E.fresh();E.start(s,B,T,B.videos[0].id);return s;}
test('Video backup roundtrip keeps applications separate from completed blocks and requires no raw text',()=>{
 const s=started(),a=E.active(s);a.selected=E.question(B,a).answer;a.confidence='sure';E.submit(s,B,T+10);
 const d=M.fresh(T);d.modules[K]=s;const copy=M.parse(JSON.stringify(d));assert.deepEqual(copy,d);
 const row=M.summary(copy).find(r=>r.key===K);assert.equal(row.completed,0);assert.equal(row.applications,1);assert.equal(row.correct,1);assert.equal(row.opened,0);
});
test('Concurrent video support is retained and submitted evidence beats a stale question draft',()=>{
 const base=started(),local=structuredClone(base),remote=structuredClone(base);
 E.expose(remote,'video',T+1);const a=E.active(local);a.selected=E.question(B,a).answer;a.confidence='sure';E.submit(local,B,T+10);
 const merged=S.merge(K,base,local,remote);E.restore(merged,B);const answer=merged.sessions[0];assert.equal(answer.stage,'done');assert.equal(answer.correct,true);assert.equal(answer.assisted,true);assert.equal(answer.independent,false);assert.equal(answer.exposures.length,1);assert.equal(merged.activeId,answer.id);
 const replay=S.merge(K,null,base,merged);assert.equal(replay.sessions[0].stage,'done');assert.equal(replay.sessions.length,1);
});
test('A reused video session ID never mixes another question with the original answer',()=>{
 const base=started(),local=structuredClone(base),remote=structuredClone(base),a=E.active(local),b=E.active(remote);
 a.questionIndex=1;a.questionId=B.videos[0].questions[1].id;a.selected=E.question(B,a).answer;a.confidence='sure';E.submit(local,B,T+4);
 b.selected=(E.question(B,b).answer+1)%E.question(B,b).options.length;b.confidence='unsure';E.submit(remote,B,T+3);
 const merged=S.merge(K,base,local,remote);E.restore(merged,B);assert.deepEqual(merged.sessions[0],remote.sessions[0]);
});
test('Three-way draft merge retains a new local selection when the server still has the base draft',()=>{
 const base=started(),local=structuredClone(base),remote=structuredClone(base);local.sessions[0].selected=2;local.sessions[0].confidence='sure';
 const merged=S.merge(K,base,local,remote);E.restore(merged,B);assert.equal(merged.sessions[0].selected,2);assert.equal(merged.sessions[0].confidence,'sure');
 const help=structuredClone(base);E.expose(help,'video',T+1);const combined=S.merge(K,base,local,help);E.restore(combined,B);assert.equal(combined.sessions[0].selected,2);assert.equal(combined.sessions[0].confidence,'sure');assert.equal(combined.sessions[0].assisted,true);assert.equal(combined.sessions[0].exposures.length,1);
 const remoteSelection=structuredClone(base);remoteSelection.sessions[0].selected=1;remoteSelection.sessions[0].confidence='unsure';const remoteOnly=S.merge(K,base,base,remoteSelection);assert.equal(remoteOnly.sessions[0].selected,1);assert.equal(remoteOnly.sessions[0].confidence,'unsure');
});
