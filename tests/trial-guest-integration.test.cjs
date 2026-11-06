const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../src/imat-trial-engine.js'),P=require('../src/imat-trial-transfer-content.js'),OLD=require('../src/imat-trial-content.js');
const S=require('../src/sync-model.js'),M=require('../src/backup-model.js'),C=require('../src/study-chain.js');
const BANK=require('../src/imat-english.js')(require('../src/imat-content.js'));
const T=Date.parse('2026-11-06T10:00:00Z');
function completed(state,participant,at=T){const a=E.start(state,P,at,{},participant?{participant}:{});E.answer(a,P.questions[0].id,P.questions[0].answer,at+1);E.freeze(a,P,at+2);E.review(a,P,at+3);state.activeId=null;return a;}
test('guest trials stay in private backups but do not count as completed, unfinished or opened learner work',()=>{
 const snapshot=M.fresh(T),s=E.fresh();const guest=completed(s,'guest');completed(s,'learner',T+10);completed(s,undefined,T+20);
 const guestDraft=E.start(s,P,T+30,{}, {participant:'guest'});E.answer(guestDraft,P.questions[0].id,0,T+31);
 snapshot.modules[E.KEY]=s;const before=JSON.stringify(snapshot),summary=M.summary(snapshot).find(x=>x.key===E.KEY);
 assert.deepEqual(summary,{key:E.KEY,completed:2,unfinished:0,opened:0});assert.equal(JSON.stringify(snapshot),before);
 const restored=M.parse(before);assert.equal(restored.modules[E.KEY].sessions.length,4);assert.deepEqual(restored.modules[E.KEY].sessions[0],guest);
});
test('choosing option zero is saved work, not opened-only work',()=>{
 const snapshot=M.fresh(T),s=E.fresh(),a=E.start(s,P,T,{}, {participant:'learner'});E.answer(a,P.questions[0].id,0,T+1);snapshot.modules[E.KEY]=s;
 assert.deepEqual(M.summary(snapshot).find(x=>x.key===E.KEY),{key:E.KEY,completed:0,unfinished:1,opened:0});
});
test('guest-only dates do not extend the learning chain or permit a repaired link',()=>{
 const s=E.fresh();completed(s,'learner',T-2*86400000);const guest=completed(s,'guest',T);const modules={[E.KEY]:s};
 const before=JSON.stringify(modules),summary=C.summarize(modules,T+100);
 assert.deepEqual(summary.days,['2026-11-04']);assert.equal(summary.todayDone,false);assert.equal(summary.repairAvailable,false);assert.equal(JSON.stringify(modules),before);
 const unknownCopy={...guest};delete unknownCopy.participant;s.sessions.push(unknownCopy);
 assert.deepEqual(C.summarize(modules,T+100).days,['2026-11-04'],'an incomplete duplicate cannot count the identified guest session');
});
test('unknown historical participant is not retroactively classified or erased',()=>{
 const s=E.fresh(),a=completed(s,undefined,T);const before=structuredClone(a),summary=C.summarize({[E.KEY]:s},T+100);
 assert.equal(summary.total,1);assert.deepEqual(a,before);assert.equal(a.participant,undefined);
});
test('sync preserves start identity before submission while keeping valid newer answers',()=>{
 const remote=E.fresh(),a=E.start(remote,P,T,{}, {participant:'guest'}),base=E.restore(remote),local=E.restore(remote),draft=E.active(local);
 draft.participant='learner';draft.deadline+=600000;draft.startedAt+=1000;draft.paperTitle='Wrong title';E.answer(draft,P.questions[0].id,0,T+100);
 const merged=S.merge(E.KEY,base,local,remote),saved=E.active(merged);
 assert.equal(saved.participant,'guest');assert.equal(saved.deadline,a.deadline);assert.equal(saved.startedAt,a.startedAt);assert.equal(saved.paperTitle,P.title);assert.equal(saved.answers[P.questions[0].id],0);
 const noTag=E.fresh(),old=E.start(noTag,OLD,T);const newer=E.restore(noTag);E.active(newer).participant='learner';E.active(newer).updatedAt=T+100;
 assert.equal(E.active(S.merge(E.KEY,noTag,newer,noTag)).participant,undefined);assert.equal(old.participant,undefined);
 E.freeze(draft,P,T+200);const submitted=E.active(S.merge(E.KEY,base,local,remote));
 assert.equal(submitted.participant,'guest');assert.equal(submitted.deadline,a.deadline);assert.equal(submitted.startedAt,a.startedAt);
});
test('same-id paper mismatches keep one original coherent record, even if the wrong draft froze',()=>{
 const remote=E.fresh(),original=E.start(remote,OLD,T),local=E.restore(remote),wrong=E.active(local);wrong.paper=P.id;wrong.answers={[P.questions[0].id]:P.questions[0].answer};E.freeze(wrong,P,T+100);
 const merged=S.merge(E.KEY,remote,local,remote);assert.deepEqual(E.active(merged),original);
});
test('frozen results and participant survive newer compatible drafts; distinct papers remain separate',()=>{
 const remote=E.fresh(),a=completed(remote,'guest',T),local=E.restore(remote),copy=local.sessions[0];copy.participant='learner';copy.updatedAt=T+1000;copy.timedResult.points=18;
 const newTrial=E.start(local,OLD,T+2000,{}, {participant:'learner'});const merged=S.merge(E.KEY,null,local,remote);
 assert.equal(merged.sessions.length,2);assert.equal(merged.sessions[0].participant,'guest');assert.deepEqual(merged.sessions[0].timedResult,a.timedResult);assert.equal(merged.sessions[1].paper,newTrial.paper);
});
test('repair diagnostics derive current question totals from the loaded bank',async()=>{
 const nodes=Object.fromEntries(['repair-state','repair-report','repair-update','repair-sync','repair-inventory','repair-copy','repair-copy-state'].map(id=>[id,{textContent:''}]));
 const ctx={IMAT_CONTENT:BANK,BackupModel:M,BackupStore:{snapshot:()=>M.fresh(T)},localStorage:{getItem:()=>null},location:{origin:'https://example.test',pathname:'/repair.html'},navigator:{},document:{getElementById:id=>nodes[id]},addEventListener(){}};ctx.window=ctx;
 vm.createContext(ctx);await vm.runInContext(fs.readFileSync('src/repair-tools.js','utf8'),ctx);
 const count=BANK.concepts.reduce((n,c)=>n+c.questions.length,0);assert.equal(count,147);assert.match(nodes['repair-inventory'].textContent,new RegExp(BANK.concepts.length+' teemat ja '+count+' küsimust'));assert.ok(nodes['repair-report'].textContent.includes(count+' küsimust'));
 const html=fs.readFileSync('src/repair.html','utf8');assert.ok(html.includes('imat-content.js'));assert.ok(html.includes('imat-english.js'));assert.doesNotMatch(fs.readFileSync('src/repair-tools.js','utf8'),/135 küsimust/);
});
test('home distinguishes the fresh original simulation from the old official repeat',()=>{
 const html=fs.readFileSync('src/index.html','utf8');assert.ok(html.includes('imat-trial.html?paper='+P.id));assert.ok(html.includes('imat-trial.html?paper='+OLD.id));assert.match(html,/Uus IMAT-vormis proov · 20 min · 12 küsimust/);assert.match(html,/mitte ametlik eksam/);
});
