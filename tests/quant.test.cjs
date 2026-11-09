const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const E=require('../src/quant-engine.js'),M=require('../src/backup-model.js'),S=require('../src/sync-model.js');
const now=Date.UTC(2026,10,9,12);
const bank=()=>require('../src/quant-content.js').subjects;
function finish(s,b,t,correct=true){const a=E.active(s),topic=E.topic(b,a);a.selected=correct?topic.questions[a.questionIndex].answer:(topic.questions[a.questionIndex].answer+1)%4;a.confidence='sure';E.submit(s,b,t);E.beginCheck(s);a.checkSelected=correct?topic.questions[a.checkIndex].answer:(topic.questions[a.checkIndex].answer+1)%4;E.check(s,b,t+1);return a;}
test('Maths and physics have five original topics and 30 complete, distinct questions',()=>{
 for(const b of Object.values(bank())){assert.equal(b.topics.length,5);const ids=new Set(),prompts=new Set();for(const t of b.topics){assert.ok(!ids.has(t.id));ids.add(t.id);assert.equal(t.questions.length,6);assert.ok(t.explanation.length&&t.worked.steps.length&&t.sources.length);for(const q of t.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.explanation&&q.skill);assert.ok(!prompts.has(q.prompt));prompts.add(q.prompt);}for(const l of t.sources)assert.match(l.url,/^https:\/\//);}assert.equal(prompts.size,30);}
});
test('Unknown baseline teaches then a wrong check completes; continuation changes topic and never erases work',()=>{
 for(const b of Object.values(bank())){const s=E.fresh(),a=E.start(s,b,now);assert.equal(E.submit(s,b,now+1),true);assert.equal(a.unknown,true);assert.equal(a.delayedProbe,false);assert.equal(a.stage,'lesson');E.beginCheck(s);a.checkSelected=(E.topic(b,a).questions[a.checkIndex].answer+1)%4;assert.equal(E.check(s,b,now+2),true);assert.equal(a.checkCorrect,false);const copy=structuredClone(a);const next=E.more(s,b,now+3);assert.notEqual(next.concept,a.concept);assert.equal(s.sessions.length,2);assert.deepEqual(s.sessions[0],{...copy,moreChosen:true});}
});
test('Help before the first answer is supported, including after reload; never awarded delayed recall',()=>{
 const b=bank().physics,s=E.fresh(),a=E.start(s,b,now);finish(s,b,now+1);const next=E.start(s,b,now+3*E.DAY,a.concept);E.help(s,now+3*E.DAY+1);const r=E.restore(JSON.stringify(s),b);E.beginCheck(r);const done=finish(r,b,now+3*E.DAY+2);assert.equal(done.assisted,true);assert.equal(done.delayedProbe,false);assert.equal(done.initialProbe,false);
});
test('Later eligible unaided retrieval is separate from immediate checks and uses a fresh first question',()=>{
 const b=bank().maths,s=E.fresh(),a=E.start(s,b,now);finish(s,b,now+1);const next=E.start(s,b,now+2*E.DAY,a.concept);assert.notEqual(next.questionIndex,a.questionIndex);finish(s,b,now+2*E.DAY+1);assert.equal(next.delayedProbe,true);assert.equal(next.assisted,false);assert.ok(s.cards[a.concept].due>next.completedAt+E.DAY);assert.equal(E.check(s,b,now+2*E.DAY+5),false);
});
test('Partial selection, explanation and unfinished check survive save/reload and sync conflict merge',()=>{
 for(const b of Object.values(bank())){const s=E.fresh(),a=E.start(s,b,now);a.selected=0;a.confidence='unsure';let r=E.restore(s,b);assert.equal(E.active(r).selected,0);E.submit(r,b,now+1);E.beginCheck(r);let rr=E.restore(r,b);assert.equal(E.active(rr).stage,'check');assert.equal(E.start(rr,b,now+2).id,a.id);const merged=S.merge(b.key,s,rr,s);assert.equal(E.active(merged).stage,'check');const snap=M.fresh();snap.modules[b.key]=merged;assert.equal(M.parse(JSON.stringify(snap)).modules[b.key].sessions.length,1);}
});
test('All first-answer items can be reached without forced same-topic loops; due reviews return across days',()=>{
 for(const b of Object.values(bank())){const s=E.fresh();let a=E.start(s,b,now),previous=null;for(let i=0;i<b.topics.length*4;i++){assert.ok(a);assert.notEqual(a.concept,previous);previous=a.concept;finish(s,b,now+i*10+1);a=E.more(s,b,now+i*10+3);}assert.equal(a,null);assert.equal(s.sessions.length,b.topics.length*4);for(const t of b.topics)assert.equal(E.seen(s,t.id).size,4);assert.ok(E.start(s,b,now+2*E.DAY));}
});
test('Subject completion earns one calendar day and remains distinct from biology',()=>{
 const chain=require('../src/study-chain.js'),b=bank().physics,s=E.fresh();E.start(s,b,now);finish(s,b,now+1);const r=chain.summarize({[b.key]:s},now+100);assert.equal(r.total,1);const d=r.dates.values().next().value;assert.equal(d.physics,1);assert.equal(d.biology,0);assert.equal(d.maths,0);
});
test('An early open cannot acquire delayed credit simply by being left open; support cannot be lost in merge',()=>{
 const b=bank().maths,s=E.fresh(),a=E.start(s,b,now);finish(s,b,now+1);const early=E.start(s,b,now+100,a.concept);const base=structuredClone(s);finish(s,b,now+3*E.DAY);assert.equal(early.delayedProbe,false);
 const x=E.fresh();E.start(x,b,now);const before=structuredClone(x);E.help(x,now+1);let merged=S.merge(b.key,before,x,before);assert.equal(E.active(merged).assisted,true);E.beginCheck(merged);E.active(merged).selected=0;E.active(merged).confidence='sure';E.submit(merged,b,now+2);merged=S.merge(b.key,before,merged,before);assert.equal(E.active(merged).stage,'lesson');assert.ok(E.active(merged).answeredAt);
});
function screen(subject='maths',initial=null,options={}){
 const chemistry=require('../src/chemistry-content.js'),banks={...bank(),chemistry},search=options.search??'?subject='+subject,requested=new URLSearchParams(search).get('subject'),selected=Object.hasOwn(banks,requested)?requested:'maths',b=banks[selected];
 const saved=new Map(Object.entries(options.modules||{}).map(([key,value])=>[key,JSON.stringify(value)])),writes=[];if(initial)saved.set(b.key,JSON.stringify(initial));
 const events={},main={innerHTML:'',focus(){},addEventListener:(n,f)=>events[n]=f},location={search,hash:options.hash||'',href:'https://study.example/quant.html'+search+(options.hash||'')},replaced=[];
 const history={replaceState(_state,_title,value){const next=new URL(value,location.href);replaced.push(next.href);location.href=next.href;location.search=next.search;location.hash=next.hash;}};
 const ctx={QuantContent:{subjects:bank()},ChemistryContent:chemistry,QuantEngine:E,URLSearchParams,location,history,document:{getElementById:()=>main},StudySync:{storage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>{writes.push(key);saved.set(key,value);}},subscribe(){}}};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/quant.js','utf8'),ctx);
 return{main,writes,location,replaced,read:()=>JSON.parse(saved.get(b.key)||'null'),readModule:key=>JSON.parse(saved.get(key)||'null'),change(name,value){events.change({target:{name,value}})},click(action,topic){events.click({target:{closest:()=>({dataset:{action,topic}})}})},submit(){events.submit({preventDefault(){}})}};
}
test('Rendered learner flow supports help, uncertainty, reload, wrong checks and voluntary continuation',()=>{
 for(const subject of ['maths','physics']){let h=screen(subject);assert.match(h.main.innerHTML,/Õpin enne vastamist/);h.click('help');assert.match(h.main.innerHTML,/Üks näide/);h.click('check');h.change('choice','0');h.change('confidence','unsure');h.submit();assert.match(h.main.innerHTML,/Proovin teist ülesannet/);h.click('check');h=screen(subject,h.read());assert.equal(E.active(h.read()).stage,'check');h.change('choice','0');h.submit();assert.match(h.main.innerHTML,/Plokk tehtud/);assert.match(h.main.innerHTML,/Tänaseks piisab/);const before=E.active(h.read()).concept;h.click('more');assert.notEqual(E.active(h.read()).concept,before);assert.equal(h.read().sessions.length,2);}
});

test('Chemistry UI saves and reloads help, first answer and wrong follow-up, then continues in its own module',()=>{
 const b=require('../src/chemistry-content.js'),maths=E.fresh();E.start(maths,bank().maths,now);const existingMaths=structuredClone(maths);
 let h=screen('chemistry',null,{modules:{[bank().maths.key]:maths}});
 assert.match(h.main.innerHTML,/Keemia/);assert.match(h.main.innerHTML,/Sodium has atomic number/);
 const id=E.active(h.read()).id;assert.equal(E.active(h.read()).stage,'question');
 h.click('help');assert.equal(E.active(h.read()).assisted,true);assert.match(h.main.innerHTML,/Üks näide/);
 h=screen('chemistry',h.read(),{modules:{[bank().maths.key]:maths}});assert.equal(E.active(h.read()).id,id);assert.equal(E.active(h.read()).stage,'lesson');
 h.click('check');assert.equal(E.active(h.read()).stage,'question');const first=E.active(h.read()),t=E.topic(b,first);
 h.change('choice',String(t.questions[first.questionIndex].answer));h.change('confidence','unsure');h.submit();
 assert.equal(E.active(h.read()).correct,true);assert.equal(E.active(h.read()).assisted,true);assert.equal(E.active(h.read()).delayedProbe,false);assert.equal(E.active(h.read()).stage,'lesson');
 h.click('check');const check=E.active(h.read()),wrong=(t.questions[check.checkIndex].answer+1)%4;h.change('choice',String(wrong));
 h=screen('chemistry',h.read(),{modules:{[bank().maths.key]:maths}});assert.equal(E.active(h.read()).stage,'check');assert.equal(E.active(h.read()).checkSelected,wrong);
 h.submit();assert.equal(E.active(h.read()).checkCorrect,false);assert.equal(E.active(h.read()).stage,'done');assert.ok(E.active(h.read()).completedAt);assert.match(h.main.innerHTML,/saad ikkagi edasi minna/);
 h.click('more');assert.equal(h.read().sessions.length,2);assert.equal(h.read().sessions[0].moreChosen,true);assert.notEqual(E.active(h.read()).concept,first.concept);assert.equal(E.active(h.read()).stage,'question');
 assert.ok(h.writes.length);assert.ok(h.writes.every(key=>key===b.key));assert.deepEqual(h.readModule(bank().maths.key),existingMaths);
});

test('A chemistry concept link resumes its saved check and preserves another unfinished topic',()=>{
 const b=require('../src/chemistry-content.js'),s=E.fresh(),target=E.start(s,b,now,b.topics[0].id);target.selected=b.topics[0].questions[target.questionIndex].answer;target.confidence='sure';E.submit(s,b,now+1);E.beginCheck(s);target.checkSelected=1;
 const other=E.start(s,b,now+2,b.topics[1].id);other.selected=2;other.confidence='unsure';const otherBefore=structuredClone(other),targetBefore=structuredClone(target);
 const h=screen('chemistry',s,{search:'?subject=chemistry&concept='+target.concept+'&from=biology'});
 assert.equal(E.active(h.read()).id,target.id);assert.equal(E.active(h.read()).stage,'check');assert.equal(h.read().sessions.length,2);
 assert.deepEqual(h.read().sessions.find(a=>a.id===other.id),otherBefore);assert.deepEqual(E.active(h.read()),targetBefore);
 assert.match(h.main.innerHTML,/href="\.\/imat\.html#learn">Tagasi bioloogia juurde/);
 const reloaded=screen('chemistry',h.read(),{search:'?subject=chemistry&concept='+target.concept});assert.equal(E.active(reloaded.read()).id,target.id);assert.equal(reloaded.read().sessions.length,2);
});

test('A valid new concept link opens that concept without overwriting earlier unfinished work',()=>{
 const b=bank().physics,s=E.fresh(),old=E.start(s,b,now,b.topics[0].id);old.selected=1;old.confidence='unsure';const before=structuredClone(old);
 const h=screen('physics',s,{search:'?subject=physics&concept='+b.topics[2].id});
 assert.equal(E.active(h.read()).concept,b.topics[2].id);assert.equal(h.read().sessions.length,2);assert.deepEqual(h.read().sessions.find(a=>a.id===old.id),before);
});

test('A consumed concept link does not start extra work when a completed block is reloaded',()=>{
 for(const [subject,b] of Object.entries({...bank(),chemistry:require('../src/chemistry-content.js')})){
  let h=screen(subject,null,{search:'?subject='+subject+'&concept='+b.topics[2].id+'&from=biology'});
  const first=E.active(h.read());assert.equal(first.concept,b.topics[2].id);assert.equal(h.replaced.length,1);
  assert.equal(new URLSearchParams(h.location.search).has('concept'),false);assert.equal(new URLSearchParams(h.location.search).get('from'),'biology');
  h.click('unknown');h.click('check');const t=E.topic(b,E.active(h.read()));h.change('choice',String(t.questions[E.active(h.read()).checkIndex].answer));h.submit();
  const complete=h.read();assert.equal(E.active(complete).stage,'done');assert.equal(complete.sessions.length,1);
  h=screen(subject,complete,{search:h.location.search,hash:h.location.hash});
  assert.deepEqual(h.read(),complete);assert.equal(h.writes.length,0);assert.equal(h.replaced.length,0);assert.match(h.main.innerHTML,/Plokk tehtud/);
  h.click('more');assert.equal(h.read().sessions.length,2);assert.notEqual(E.active(h.read()).id,first.id);assert.notEqual(E.active(h.read()).concept,first.concept);assert.equal(h.read().sessions[0].moreChosen,true);
  const continued=h.read();h=screen(subject,continued,{search:h.location.search});assert.deepEqual(h.read(),continued);assert.equal(h.read().sessions.length,2);
 }
});

test('Invalid subject and concept parameters are ignored without switching or modifying unrelated records',()=>{
 const chemistry=require('../src/chemistry-content.js'),c=E.fresh();E.start(c,chemistry,now);const cBefore=structuredClone(c);
 for(const subject of ['unknown','__proto__','constructor','']){
  const h=screen(subject,null,{search:'?subject='+encodeURIComponent(subject)+'&concept=atomic_structure_ions',modules:{[chemistry.key]:c}});
  assert.equal(E.active(h.read()).concept,bank().maths.topics[0].id);assert.ok(h.writes.every(key=>key===bank().maths.key));assert.deepEqual(h.readModule(chemistry.key),cBefore);
 }
 const s=E.fresh(),active=E.start(s,chemistry,now,chemistry.topics[1].id);active.selected=1;active.confidence='unsure';const before=structuredClone(s);
 for(const concept of ['missing','__proto__','<script>alert(1)</script>']){
  const h=screen('chemistry',s,{search:'?subject=chemistry&concept='+encodeURIComponent(concept)});
  assert.deepEqual(h.read(),before);assert.equal(h.writes.length,0);assert.doesNotMatch(h.main.innerHTML,/<script>alert/);
 }
});

test('Biology return is an exact fixed local route and ignores arbitrary return URLs',()=>{
 const external='https://example.org/phishing';
 for(const subject of ['maths','physics','chemistry']){
  const h=screen(subject,null,{search:'?subject='+subject+'&from=biology&returnTo='+encodeURIComponent(external)+'&return='+encodeURIComponent('javascript:alert(1)')});
  assert.match(h.main.innerHTML,/href="\.\/imat\.html#learn">Tagasi bioloogia juurde/);assert.doesNotMatch(h.main.innerHTML,/example\.org|javascript:/);
  const other=screen(subject,null,{search:'?subject='+subject+'&from='+encodeURIComponent(external)});assert.doesNotMatch(other.main.innerHTML,/Tagasi bioloogia juurde|example\.org/);
 }
});

test('Chemistry content loads before the shared page starts and retains the existing storage entry point',()=>{
 const html=fs.readFileSync('src/quant.html','utf8');
 assert.ok(html.indexOf('src="./chemistry-content.js"')>=0);assert.ok(html.indexOf('src="./chemistry-content.js"')<html.indexOf('data-study-entry="./quant.js"'));
 assert.match(html,/src="\.\/backup-storage\.js" data-study-entry="\.\/quant\.js"/);
});
