const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../src/video-content.js'),L=require('../src/video-links.js'),E=require('../src/imat-engine.js'),Q=require('../src/quant-engine.js');
const IB=require('../src/imat-english.js')(require('../src/imat-content.js')),QB=require('../src/quant-content.js').subjects;
const DAY=86400000,T=Date.UTC(2026,10,9,18),BIO='hendrik-imat-bio-v1',MATH='hendrik-maths-v1';
const answer=(id,at=T-1000,extra={})=>({id,concept:'division',questionIndex:3,answeredAt:at,correct:false,confidence:'sure',assisted:false,...extra});
const modules=(...sessions)=>({[BIO]:{sessions}});
test('A correct confident first answer does not hide a known wrong follow-up subskill',()=>{
 const a=answer('followup',T-2000,{correct:true,retryIndex:5,retryAnswers:[0],checkCorrect:false,completedAt:T-1000});
 assert.equal(L.contextual(B,'biology','division',a),null);
 assert.equal(L.contextual(B,'biology','division',a,'check').id,'bio-chromosome-count');
 const help=L.suggestedHelp(modules(a),B,T);assert.equal(help.evidenceAt,a.completedAt);assert.equal(help.concept,'division');assert.match(help.reason,/järelkontrollis/);
 const href=new URL(help.href,'https://study.example/');assert.equal(href.searchParams.get('help'),'1');assert.equal(href.searchParams.get('from'),'biology');assert.equal(href.searchParams.get('concept'),'division');
 for(const patch of [{retryIndex:undefined},{retryIndex:'5'},{retryIndex:999},{retryAnswers:[]},{checkCorrect:undefined},{completedAt:0},{completedAt:NaN}])assert.equal(L.contextual(B,'biology','division',{...a,...patch},'check'),null);
 const q=answer('quant',T-2000,{concept:'formulas_units',questionIndex:1,correct:true,checkIndex:2,checkCorrect:false,checkAnsweredAt:T-500,completedAt:T-500});
 assert.equal(L.contextual(B,'maths',q.concept,q,'check').id,'sat-linear-equation');
 assert.equal(L.contextual(B,'maths',q.concept,{...q,checkIndex:undefined},'check'),null);
});
test('Recent help selects one exact newest ordinary gap without rewriting source data',()=>{
 const m={...modules(answer('old',T-2*DAY)),[MATH]:{sessions:[answer('new',T-100,{concept:'formulas_units',questionIndex:1,confidence:'unsure',correct:true})]}};
 const before=structuredClone(m),r=L.suggestedHelp(m,B,T);assert.equal(r.videoId,'sat-linear-equation');assert.equal(r.domain,'maths');assert.equal(r.evidenceAt,T-100);assert.deepEqual(m,before);assert.match(r.title,/Võrrandi/);
});
test('Guest, trial, duplicate, unknown-index, unfinished, stale and future evidence never recommends personal help',()=>{
 for(const extra of [{participant:'guest'},{participant:'unknown'},{participant:'Hendrik'},{paper:'paper'},{kind:'trial'},{id:'trial-visitor'},{questionIndex:undefined},{questionIndex:999},{answeredAt:0},{answeredAt:NaN},{answeredAt:T+1},{answeredAt:T-7*DAY-1}])assert.equal(L.suggestedHelp(modules(answer('a',T-1000,extra)),B,T),null);
 assert.equal(L.suggestedHelp(modules(answer('duplicate'),answer('duplicate')),B,T),null);
 assert.equal(L.suggestedHelp({'hendrik-imat-trial-v1':{sessions:[answer('a')]}},B,T),null);
 assert.equal(L.suggestedHelp(modules(answer('a',T-7*DAY)),B,T).videoId,'bio-chromosome-count');
 assert.equal(L.suggestedHelp(modules(answer('a',T,{participant:'learner'})),B,T).videoId,'bio-chromosome-count');
});
test('Only later correct confident unaided evidence for the same mapped clip suppresses a suggestion',()=>{
 const weak=answer('weak',T-1000),success=answer('success',T-100,{questionIndex:6,correct:true});
 assert.equal(L.suggestedHelp(modules(weak,success),B,T),null);
 for(const change of [{assisted:true},{assisted:undefined},{scaffold:true},{englishHelp:true},{confidence:'unsure'},{questionIndex:0},{participant:'guest'},{answeredAt:T-2000},{answeredAt:T+1}])assert.ok(L.suggestedHelp(modules(weak,{...success,...change}),B,T));
 // A supported check never erases the need for an independent application.
 assert.ok(L.suggestedHelp(modules(weak,answer('check',T-100,{questionIndex:0,correct:true,retryIndex:5,retryAnswers:[0],checkCorrect:true,completedAt:T-50})),B,T));
});
test('A newer video exposure or answer prevents repeated prompting, but older, future or guest actions do not',()=>{
 const weak=answer('weak',T-1000);
 const state=extra=>({...modules(weak),[L.KEY]:extra});
 for(const field of ['answeredAt','openedAt','helpedAt','lastExposureAt'])assert.equal(L.suggestedHelp(state({sessions:[{id:'v',videoId:'bio-chromosome-count',[field]:T-100}]}),B,T),null);
 assert.equal(L.suggestedHelp(state({sessions:[{id:'v',videoId:'bio-chromosome-count',exposures:[{kind:'gist',at:T-100}]}]}),B,T),null);
 for(const field of ['lastAt','lastExposure'])assert.equal(L.suggestedHelp(state({cards:{'bio-chromosome-count':{[field]:T-100}}}),B,T),null);
 for(const at of [T-2000,T+1,NaN])assert.ok(L.suggestedHelp(state({sessions:[{id:'v',videoId:'bio-chromosome-count',openedAt:at}]}),B,T));
 assert.ok(L.suggestedHelp(state({sessions:[{id:'guest',participant:'guest',videoId:'bio-chromosome-count',answeredAt:T-100}]}),B,T));
 assert.ok(L.suggestedHelp(state({sessions:[{id:'unrelated',videoId:'bio-gas-diffusion',openedAt:T-100}]}),B,T));
});
test('Due review remains a separate priority signal and does not promise an unseen question',()=>{
 const m={...modules(answer('weak')),[L.KEY]:{cards:{'bio-gas-diffusion':{due:T-1000,lastAt:T-2*DAY,lastExposure:T-2*DAY}},sessions:[]}};
 const r=L.recommendation(m,B,T);assert.equal(r.kind,'video-review');assert.match(r.href,/bio-gas-diffusion&review=1/);assert.doesNotMatch(r.title,/uu[se]/);assert.equal(L.suggestedHelp(m,B,T).videoId,'bio-chromosome-count');
});
function renderImat(state,demo=false){let saved=JSON.stringify(state);const events={},main={innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[]};const ctx={Date:class extends Date{static now(){return T;}},IMAT_CONTENT:IB,ImatEngine:{...E,start:(s,b,now=T,...rest)=>E.start(s,b,now,...rest),more:(s,b,now=T)=>E.more(s,b,now)},VIDEO_CONTENT:B,VideoLinks:L,URLSearchParams,location:{search:demo?'?demo=1':'',hash:'#learn'},document:{activeElement:null,getElementById:()=>main,addEventListener:(n,f)=>events[n]=f},localStorage:{getItem:()=>saved,setItem:(_k,v)=>saved=v},addEventListener(){},scrollTo(){}};ctx.window=ctx;vm.runInNewContext(fs.readFileSync(require.resolve('../src/imat.js'),'utf8'),ctx);return {main,read:()=>JSON.parse(saved),click:action=>events.click({target:{closest:()=>({dataset:{coach:action},disabled:false})}})};}
test('IMAT finished wrong-check screen offers exact help and voluntary continuation without changing frozen work',()=>{
 const s=E.fresh(),a=E.start(s,IB,T-1000,'division');a.selected=E.question(IB,a).answer;a.confidence='sure';E.submit(s,IB,T-900);E.beginRetry(s);assert.ok(L.contextual(B,'biology','division',{...a,retryAnswers:[0],checkCorrect:false,completedAt:T-800},'check'));a.retrySelected=(E.retryQuestion(IB,a).answer+1)%5;E.retry(s,IB,T-800);
 const h=renderImat(s),before=structuredClone(h.read());assert.match(h.main.innerHTML,/bio-chromosome-count&help=1&from=biology&concept=division/);assert.match(h.main.innerHTML,/Jätkan õppimist/);assert.match(h.main.innerHTML,/Lõpetan praegu/);assert.deepEqual(h.read(),before);
 h.click('more');assert.notEqual(E.active(h.read()).concept,'division');assert.equal(h.read().sessions[0].checkCorrect,false);
 assert.doesNotMatch(renderImat(s,true).main.innerHTML,/bio-chromosome-count&help/);
});
test('Quantitative finished wrong-check screen offers help while keeping saved answer and continuation',()=>{
 const b=QB.physics,s=Q.fresh(),a=Q.start(s,b,T-1000,'atomic_photons');a.selected=Q.topic(b,a).questions[a.questionIndex].answer;a.confidence='sure';Q.submit(s,b,T-900);Q.beginCheck(s);a.checkSelected=(Q.topic(b,a).questions[a.checkIndex].answer+1)%4;Q.check(s,b,T-800);
 let saved=JSON.stringify(s);const events={},main={innerHTML:'',focus(){},addEventListener:(n,f)=>events[n]=f},ctx={QuantContent:{subjects:QB},ChemistryContent:require('../src/chemistry-content.js'),QuantEngine:Q,VIDEO_CONTENT:B,VideoLinks:L,URLSearchParams,location:{search:'?subject=physics',hash:''},document:{getElementById:()=>main},StudySync:{storage:{getItem:()=>saved,setItem:(_k,v)=>saved=v},subscribe(){}}};ctx.window=ctx;vm.runInNewContext(fs.readFileSync(require.resolve('../src/quant.js'),'utf8'),ctx);
 assert.match(main.innerHTML,/i12-physics-photon-energy&help=1&from=physics&concept=atomic_photons/);assert.match(main.innerHTML,/Veel üks · teine teema/);assert.deepEqual(JSON.parse(saved),s);
 events.click({target:{closest:()=>({dataset:{action:'more'}})}});assert.notEqual(Q.active(JSON.parse(saved)).concept,'atomic_photons');assert.equal(JSON.parse(saved).sessions[0].checkCorrect,false);
});
