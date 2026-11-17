const test=require('node:test'),assert=require('node:assert/strict');
const O=require('../src/official-practice.js'),M=require('../src/medical-plan.js'),I=require('../src/ielts-engine.js'),E=require('../src/exam-plan.js');
const NOW=Date.parse('2026-11-18T10:00:00Z'),DAY=86400000;
function modules(){const en=I.fresh(),a=I.start(en,{kind:'writing',taskIds:['synthetic'],title:'Synthetic'},NOW-2000);a.texts={synthetic:'My own response.'};I.submit(en,[],NOW-1000);return {[I.KEY]:en,'hendrik-chemistry-v1':{sessions:[{id:'chem-synthetic',completedAt:NOW-500,correct:false,checkCorrect:false}]}};}
test('recent self-authored IELTS work suggests one authentic sample, no accuracy threshold or history write',()=>{
 const m=modules(),before=structuredClone(m);assert.equal(O.suggest(m,NOW,{model:M}).id,'ielts');assert.deepEqual(m,before);
 for(const mutation of [a=>a.participant='guest',a=>a.completedAt=NOW+DAY,a=>a.status='empty',a=>{a.texts={};a.wordCount=0;}]){const m=modules();mutation(m[I.KEY].sessions[0]);assert.equal(O.suggest(m,NOW,{model:M}),null);}
});
test('local preferences rotate to UT only after current English and chemistry participation; recent Later does not pile up another invitation',()=>{
 const m=modules(),before=structuredClone(m),prefs={official:{ielts:{doneAt:NOW-100}},officialUntil:NOW+DAY};
 assert.equal(O.suggest(m,NOW,{model:M,prefs}),null);
 prefs.officialUntil=NOW-1;assert.equal(O.suggest(m,NOW,{model:M,prefs}).id,'academic');
 delete m['hendrik-chemistry-v1'];assert.equal(O.suggest(m,NOW,{model:M,prefs}),null);
 assert.equal(before[I.KEY].sessions[0].completedAt,m[I.KEY].sessions[0].completedAt);
});
test('all official routes stay available without eligibility and answers remain behind a deliberate review disclosure',()=>{
 assert.equal(O.suggest({},NOW,{model:M}),null);
 const html=E.renderOfficial(O.resources);
 for(const r of O.resources)assert.ok(html.includes(r.href));
 assert.match(html,/Pärast lahendamist: vastused/);assert.match(html,/ei salvesta tulemust/);
 assert.doesNotMatch(html,/disabled|onclick|autoplay/);
});
