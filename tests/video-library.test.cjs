const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../src/video-content.js'),L=require('../src/video-links.js'),E=require('../src/video-engine.js');
const T=Date.UTC(2026,10,9,18),find=id=>B.videos.find(v=>v.id===id);
function storage(initial={}){const data=new Map(Object.entries(initial).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]));return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),read:k=>JSON.parse(data.get(k)),raw:k=>data.get(k)};}
function ordinary(concept,index=0,extra={}){return {id:'ordinary-safe',concept,questionIndex:index,answeredAt:T-1000,correct:false,confidence:'sure',...extra};}
function screen(search,initial={}){
 const store=storage(initial),events={},subscribers={},main={innerHTML:'',addEventListener:(k,f)=>events[k]=f,focus(){}};
 class Clock extends Date{static now(){return T;}}
 const c={VIDEO_CONTENT:B,VideoEngine:E,VideoLinks:L,StudySync:{storage:store,subscribe:(k,f)=>subscribers[k]=f},document:{getElementById:()=>main},location:{search},history:{replaceState(){}},navigator:{onLine:true},URLSearchParams,Date:Clock,addEventListener(){}};c.window=c;c.globalThis=c;
 vm.runInNewContext(fs.readFileSync(require.resolve('../src/videos.js'),'utf8'),c);
 return {store,main,change:(name,value)=>events.change({target:{name,value}}),submit:()=>events.submit({preventDefault(){}}),click:action=>events.click({target:{closest:s=>s==='[data-action]'?{dataset:{action}}:null}}),sync:data=>subscribers[E.MODULE_ID](data)};
}
test('curated sources are single original videos, bounded metadata and complete distinct original applications',()=>{
 const ids=new Set(),questions=new Set();assert.equal(B.videos.length,23);
 for(const v of B.videos){assert.ok(!ids.has(v.id));ids.add(v.id);const u=new URL(v.url);assert.equal(u.hostname,'www.youtube.com');assert.equal(u.pathname,'/watch');assert.equal(u.searchParams.get('v'),v.youtubeId);assert.match(v.youtubeId,/^[A-Za-z0-9_-]{11}$/);assert.equal(u.searchParams.has('list'),false);assert.ok(v.channel&&v.title&&v.gist);assert.ok(v.durationSeconds>0&&v.durationSeconds<=900);assert.ok(v.uploadYear>=2000&&v.uploadYear<=2026);assert.equal(v.questions.length,2);
  for(const t of v.keyMoments){assert.ok(Number.isInteger(t.seconds)&&t.seconds>=0&&t.seconds<v.durationSeconds);assert.ok(t.label);}
  for(const q of v.questions){assert.ok(!questions.has(q.id));questions.add(q.id);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.prompt&&q.explanation);}
 }
 assert.equal(questions.size,46);
});
test('biology metadata exactly matches primary-source research, including original-player durations',()=>{
 const source=JSON.parse(fs.readFileSync(require.resolve('../../plans/i12-biology-videos.json'),'utf8'));
 for(const v of source.readyVideos){const actual=find(v.id);for(const field of ['youtubeId','title','channel','durationSeconds'])assert.equal(actual[field],v[field]);assert.equal(actual.uploadYear,v.year);assert.ok(v.verificationSources.every(s=>s.checked==='2026-11-09'&&/^https:\/\//.test(s.url)));}
 assert.equal(find('bio-chromosome-count').durationSeconds,477);
});
test('new biology applications have independently derived counts, conditional probability and rate outcomes',()=>{
 const q=(id,i)=>find(id).questions[i],choice=(id,i)=>q(id,i).options[q(id,i).answer];
 assert.equal(14*2,28);assert.equal(30*2,60);assert.equal(choice('bio-chromosome-count',0),'14 chromosomes; 60 fluorescence units');
 assert.equal(10/2,5);assert.equal(choice('bio-chromosome-count',1),'5 duplicated chromosomes containing 10 DNA molecules');
 assert.equal(choice('bio-monohybrid-probability',0),'1/2');assert.equal((2/3)*(2/3),4/9);assert.equal(choice('bio-monohybrid-probability',1),'4/9');
 assert.equal(1.5/3,0.5);assert.equal(choice('bio-gas-diffusion',0),'Half');
 assert.match(choice('bio-gas-diffusion',1),/maintains a larger oxygen partial-pressure difference/);
 assert.match(choice('bio-nephron-cotransport',0),/uptake.*decreases/);assert.match(choice('bio-nephron-cotransport',1),/secondary active transport/);
 assert.match(choice('bio-membrane-transport',0),/Facilitated diffusion/);assert.match(choice('bio-membrane-transport',1),/reverses/);
});
test('contextual recommendations require known submitted subskills, not broad topics or trial identities',()=>{
 for(const i of [0,3])assert.equal(L.contextual(B,'biology','nephron-filtration',ordinary('nephron-filtration',i)),null);
 for(const i of [0,1,2,4,7])assert.equal(L.contextual(B,'biology','division',ordinary('division',i)),null);
 for(const i of [3,5,6,8,9,10,11,12])assert.equal(L.contextual(B,'biology','division',ordinary('division',i)).id,'bio-chromosome-count');
 for(const i of [1,2,4,5,9])assert.equal(L.contextual(B,'biology','gas-exchange',ordinary('gas-exchange',i)).id,'bio-gas-diffusion');
 assert.equal(L.contextual(B,'biology','gas-exchange',ordinary('gas-exchange',6)),null);
 assert.equal(L.contextual(B,'physics','energy_power',ordinary('energy_power',0)),null);
 assert.equal(L.contextual(B,'physics','atomic_photons',ordinary('atomic_photons',1)),null);
 assert.equal(L.contextual(B,'physics','atomic_photons',ordinary('atomic_photons',2)).id,'i12-physics-photon-energy');
 for(const bad of [{questionIndex:undefined},{questionIndex:999},{questionIndex:'3'},{answeredAt:0},{correct:undefined},{participant:'guest'},{participant:'unknown'},{id:'trial-55bc072e-c425-49c5-b007-62e90c5c4dc2'},{paper:'imat-2025'},{concept:'other'}])assert.equal(L.contextual(B,'biology','division',ordinary('division',3,bad)),null);
 assert.equal(L.contextual(B,'biology','division',ordinary('division',3,{correct:true,confidence:'sure'})),null);
 assert.equal(L.contextual(B,'biology','division',ordinary('division',3,{correct:true,confidence:'unsure'})).id,'bio-chromosome-count');
 assert.equal((L.slot(B,'biology','division',ordinary('division',3)).match(/href=/g)||[]).length,1);
});
test('all exact historical trigger indices exist in the live ordinary bank and the chromosome trigger tests counting',()=>{
 const c={};c.globalThis=c;vm.createContext(c);for(const p of ['imat-content.js','imat-english.js'])vm.runInContext(fs.readFileSync(require.resolve('../src/'+p),'utf8'),c);
 for(const concept of c.IMAT_CONTENT.concepts)for(let i=0;i<concept.questions.length;i++){const v=L.contextual(B,'biology',concept.id,ordinary(concept.id,i));if(v)assert.ok(B.videos.includes(v));}
 const division=c.IMAT_CONTENT.concepts.find(x=>x.id==='division');assert.match(division.questions[10].prompt,/chromosomes.*G1.*replication/);assert.match(division.questions[11].prompt,/two matching DNA copies/);
 const nephron=c.IMAT_CONTENT.concepts.find(x=>x.id==='nephron-filtration');assert.match(nephron.questions[0].prompt,/Which process/);assert.match(nephron.questions[3].prompt,/which direction/);
});
test('support crosses relevant module boundaries and affects every unfinished related session without rewriting submitted work',()=>{
 const finished={id:'old',concept:'gas-exchange',answeredAt:T-2*E.DAY,completedAt:T-2*E.DAY+1,correct:true,assisted:false,delayedProbe:true};
 const biology={cards:{'gas-exchange':{lastExposure:T-2*E.DAY}},sessions:[finished,{id:'a',concept:'gas-exchange',answeredAt:0},{id:'b',concept:'gas-exchange',answeredAt:0}],activeId:'a'};
 const maths={cards:{proportions:{lastExposure:1}},sessions:[{id:'m',concept:'proportions',answeredAt:0}],activeId:'m'},physics={cards:{pressure:{lastExposure:1}},sessions:[],activeId:null};
 const st=storage({'hendrik-imat-bio-v1':biology,'hendrik-maths-v1':maths,'hendrik-physics-v1':physics});
 L.markRelatedExposure(st,find('bio-gas-diffusion'),T);
 const b=st.read('hendrik-imat-bio-v1');assert.deepEqual(b.sessions[0],finished);assert.ok(b.sessions.slice(1).every(a=>a.assisted&&a.delayedEligibleAtStart===false));assert.equal(b.cards['gas-exchange'].lastExposure,T);assert.equal(st.read('hendrik-maths-v1').cards.proportions.lastExposure,T);assert.equal(st.read('hendrik-physics-v1').cards.pressure.lastExposure,T);
 assert.equal(st.getItem('hendrik-ielts-v1'),null);
});
test('related video support also invalidates immediate independent attribution without inventing answers',()=>{
 const s=E.fresh();const a=E.start(s,B,T,'bio-membrane-transport');a.selected=2;a.confidence='unsure';
 L.markRelatedVideoExposure(s,B,find('bio-nephron-cotransport'),'gist',T+1);
 assert.equal(a.assisted,true);assert.equal(a.selected,2);assert.equal(a.answeredAt,0);assert.equal(a.delayedProbe,false);assert.deepEqual(s.cards,{});assert.deepEqual(E.restore(s,B),s);
});
test('support failures preserve source data, stay visible after successful practice save and never claim independence',()=>{
 const raw='{unreadable',h=screen('?video=bio-gas-diffusion&help=1',{'hendrik-imat-bio-v1':raw});
 assert.equal(h.store.raw('hendrik-imat-bio-v1'),raw);assert.match(h.main.innerHTML,/Seotud aine salvestust ei saanud uuendada/);assert.equal(E.active(h.store.read(E.MODULE_ID)).assisted,true);
});
test('UI submission freezes first answer then records visible feedback and support; no ordinary completion',()=>{
 const h=screen('?video=bio-membrane-transport');h.change('choice','3');h.change('confidence','sure');h.submit();
 const s=h.store.read(E.MODULE_ID),a=E.active(s);assert.equal(a.correct,true);assert.equal(a.independent,true);assert.equal(a.assisted,false);assert.ok(a.exposures.some(x=>x.kind==='explanation'));assert.equal(a.chainCredit,false);assert.equal(a.ordinaryBlockCredit,false);assert.match(h.main.innerHTML,/Üks vastus ei tõesta kogu teema valdamist/);
 const frozen=structuredClone(a);h.click('help');assert.equal(h.store.read(E.MODULE_ID).sessions[0].correct,frozen.correct);
});
test('Maths filter contains the four mathematical SAT clips but no Reading/Writing clips',()=>{
 const h=screen('?subject=maths');for(const id of ['sat-linear-equation','sat-linear-model','sat-area-volume','sat-mean-median'])assert.match(h.main.innerHTML,new RegExp('data-start="'+id+'"'));
 assert.doesNotMatch(h.main.innerHTML,/data-start="sat-inferences"/);assert.doesNotMatch(h.main.innerHTML,/data-start="sat-transitions"/);assert.match(h.main.innerHTML,/mitte lisakohustusena/);
});
