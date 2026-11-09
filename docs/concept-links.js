(function(root,factory){const api=factory();root.ConceptLinks=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 // Optional connections, not prerequisite diagnoses. Only indexed ordinary IMAT
 // submissions are evidence; trials, card totals and missing old indices are not.
 const DAY=86400000,WINDOW=21*DAY,KEY='hendrik-imat-bio-v1';
 const definitions=[
  {id:'inheritance-denominator',subject:'maths',concept:'probability_conditions',title:'Tõenäosus: millise tingimusega?',reason:'„Poegade hulgas” ja „kõigi laste hulgas” muudavad vaadeldavat rühma. Soovi korral proovi üht seotud matemaatikanäidet ja tule siis pärandumise juurde tagasi.',sources:{xlinked:[0,1,2,3,4,7,8,9,12],autosomal:[9]}},
  {id:'inheritance-independent',subject:'maths',concept:'probability_conditions',title:'Tõenäosus: millise tingimusega?',reason:'Eelmise lapse tulemus ei muuda järgmise sõltumatu pärandumise tõenäosust. Soovi korral vaata sama mõtet teises matemaatikaolukorras.',sources:{mendel:[1],autosomal:[4,12]}},
  {id:'inheritance-fraction',subject:'maths',concept:'fractions_percentages',title:'Osa, tervik ja protsent',reason:'Pärandumise ruudustikus aitab eristada sobivaid tulemusi ja kõiki võrdselt võimalikke tulemusi. Soovi korral proovi osa ja terviku näidet.',sources:{mendel:[0,2],autosomal:[1,3,8]}},
  {id:'gas-area-thickness',subject:'maths',concept:'proportions',title:'Võrdeline ja pöördvõrdeline muutus',reason:'Gaasivahetuse mudelis mõjub suurem pindala ja paksem kiht erinevalt. Soovi korral harjuta suhet A / d ning tule siis bioloogia juurde tagasi.',sources:{'gas-exchange':[1,2,4,5,9]}},
  {id:'gas-pressure-direction',subject:'physics',concept:'pressure',title:'Rõhk ja rõhkude vahe',reason:'Hapnik ja süsihappegaas järgivad kumbki oma osarõhkude vahet. Soovi korral vaata rõhkude vahe füüsikanäidet; gaasi difusioon ja kogu vedeliku vool pole sama protsess.',sources:{'gas-exchange':[0,6,7,8]}},
  {id:'transport-energy',subject:'physics',concept:'energy_power',title:'Energia, töö ja võimsus',reason:'Membraani läbimisel tasub eraldi jälgida liikumise suunda ja energiavajadust. Soovi korral vaata energia ülekande füüsikanäidet; see ei tõesta veel membraanitranspordi mõistmist.',sources:{transport:[0,1,2]}},
  {id:'osmosis-concentration',subject:'chemistry',concept:'concentration_dilution',title:'Kontsentratsioon ja lahjendamine',reason:'Osmoosi kirjelduses tuleb võrrelda lahustunud aine hulka ruumala kohta. Soovi korral vaata kontsentratsiooni keemianäidet, seejärel rakenda mõtet uuesti membraani olukorras.',sources:{osmosis:[0,1,2]}},
  {id:'nerve-ions',subject:'chemistry',concept:'atomic_structure_ions',title:'Aatomi ehitus ja ioonid',reason:'Närviimpulsi kirjelduses liiguvad laetud ioonid. Soovi korral vaata, kuidas iooni laeng tekib; naatriumikanali ja membraani töö tuleb seejärel bioloogias eraldi läbi mõelda.',sources:{'nerve-signals':[0,4]}},
  {id:'nerve-rate',subject:'maths',concept:'formulas_units',title:'Valemist puuduva suuruseni',reason:'Impulsside sagedus tähendab impulsside arvu ajaühikus. Soovi korral proovi valemi ja ühikute näidet ning tule siis närviimpulsi ülesande juurde tagasi.',sources:{'nerve-signals':[5]}}
 ];
 const titles={xlinked:'X-liiteline pärandumine',autosomal:'Autosoomne pärandumine',mendel:'Mendeli pärandumine','gas-exchange':'Gaasivahetus',transport:'Membraanitransport',osmosis:'Osmoos','nerve-signals':'Närviimpulsid'};
 const decode=x=>{if(typeof x==='string'){try{return JSON.parse(x);}catch{return null;}}return x&&typeof x==='object'?x:null;};
 const stamp=x=>typeof x==='number'&&Number.isFinite(x)&&x>0?x:NaN;
 const day=x=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(x);
 const owned=a=>!a.participant||a.participant==='hendrik'||a.participant==='learner';
 function sessions(raw){const s=decode(raw);return Array.isArray(s?.sessions)?s.sessions.filter(a=>a&&typeof a==='object'&&typeof a.id==='string'&&a.id&&owned(a)):[];}
 function recentTarget(modules,d,now){
  const key='hendrik-'+d.subject+'-v1';
  return sessions(modules[key]).some(a=>a.concept===d.concept&&Number.isFinite(stamp(a.completedAt))&&a.completedAt<=now&&now-a.completedAt<DAY);
 }
 function candidates(rawModules,now=Date.now()){
  const modules=decode(rawModules);if(!modules||!Number.isFinite(stamp(now)))return [];
  // A repeated/conflicting copy must never manufacture another attempt. Withhold
  // duplicate IDs entirely rather than guess which saved snapshot is newer.
  const raw=sessions(modules[KEY]),counts=new Map();for(const a of raw)counts.set(a.id,(counts.get(a.id)||0)+1);
  const source=raw.filter(a=>counts.get(a.id)===1),out=[];
  for(const d of definitions){
   if(recentTarget(modules,d,now))continue;
   const events=[];
   for(const a of source){
    const indices=d.sources[a.concept];if(!indices)continue;
    const add=(index,at,kind,correct,independent=false)=>{
     at=stamp(at);if(!Number.isInteger(index)||!indices.includes(index)||!Number.isFinite(at)||at>now||now-at>WINDOW)return;
     if(correct!==true&&correct!==false)return;
     events.push({session:a.id,sourceConcept:a.concept,index,at,kind,correct,independent});
    };
    add(a.questionIndex,a.answeredAt,'first',a.correct,a.delayedProbe===true&&!a.assisted);
    // Explicit checkCorrect is needed: an unanswered retry, a selected option or
    // an old retry with an unknown index is not a submitted wrong check.
    if(a.retrySubmitted===true||a.completedAt)add(a.retryIndex,a.checkAnsweredAt||a.completedAt,'check',a.checkCorrect);
   }
   const ordered=events.sort((a,b)=>a.at-b.at),lastIndependent=ordered.filter(e=>e.kind==='first'&&e.correct&&e.independent).at(-1)?.at||0;
   const misses=ordered.filter(e=>!e.correct&&e.at>lastIndependent);
   if(!misses.length)continue;
   const ids=new Set(misses.map(e=>e.session)),days=new Set(misses.map(e=>day(e.at)));
   const paired=[...ids].some(id=>misses.some(e=>e.session===id&&e.kind==='first')&&misses.some(e=>e.session===id&&e.kind==='check'));
   if(!(ids.size>=2&&days.size>=2)&&!paired)continue;
   const last=misses.at(-1);
   out.push({linkId:d.id,subject:d.subject,concept:d.concept,title:d.title,reason:d.reason,sourceConcept:last.sourceConcept,sourceTitle:titles[last.sourceConcept],href:'./quant.html?subject='+d.subject+'&concept='+d.concept+'&from=biology',returnHref:'./imat.html#learn',evidence:{sessionCount:ids.size,dayCount:days.size,firstMisses:misses.filter(e=>e.kind==='first').length,supportedCheckMisses:misses.filter(e=>e.kind==='check').length,lastAt:last.at}});
  }
  out.sort((a,b)=>b.evidence.lastAt-a.evidence.lastAt||b.evidence.dayCount-a.evidence.dayCount||a.linkId.localeCompare(b.linkId));
  // Different biology contexts can suggest the same maths lesson. Offer it once.
  const seen=new Set();return out.filter(r=>{const key=r.subject+':'+r.concept;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,3);
 }
 const recommend=(modules,now)=>candidates(modules,now)[0]||null;
 const mappings=()=>definitions.map(d=>({id:d.id,subject:d.subject,concept:d.concept,sources:JSON.parse(JSON.stringify(d.sources))}));
 return {KEY,WINDOW,candidates,recommend,mappings};
});
