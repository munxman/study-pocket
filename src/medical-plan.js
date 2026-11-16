(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.MedicalPlan=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const DAY=86400000,IELTS='hendrik-ielts-v1',CHEM='hendrik-chemistry-v1',BIO='hendrik-imat-bio-v1',BASICS='hendrik-bio-basics-v1';
 const satParts={maths:['sat-linear-equation','sat-linear-model','sat-area-volume','sat-mean-median'],english:['sat-inferences','sat-quantitative-evidence','sat-transitions','sat-sentence-boundaries']};
 const stamp=t=>Number.isSafeInteger(t)&&t>0;
 const day=t=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(t);
 const allowed=a=>a&&(a.participant==null||['learner','hendrik'].includes(a.participant))&&!a.paper&&!String(a.id||'').startsWith('trial-');
 function rows(module,now){
  const raw=Array.isArray(module?.sessions)?module.sessions:[],counts=new Map();
  for(const a of raw)if(a?.id)counts.set(a.id,(counts.get(a.id)||0)+1);
  return raw.filter(a=>allowed(a)&&typeof a.id==='string'&&a.id&&counts.get(a.id)===1&&
   ['startedAt','answeredAt','checkAnsweredAt','completedAt'].every(k=>a[k]==null||a[k]===0||stamp(a[k])&&a[k]<=now)&&
   (!a.startedAt||!a.completedAt||a.completedAt>=a.startedAt));
 }
 const productive=a=>['writing','speaking'].includes(a.kind)&&
  (Number.isFinite(a.wordCount)&&a.wordCount>0||a.recorded===true||Object.values(a.texts||{}).some(x=>typeof x==='string'&&x.trim()));
 function completed(a,isEnglish=false){return stamp(a.completedAt)&&a.status!=='empty'&&(isEnglish?
  productive(a)||['reading','listening','drill'].includes(a.kind)&&(Object.values(a.answers||{}).some(x=>String(x??'').trim())||(a.results||[]).some(x=>x.blank===false)):
  typeof a.correct==='boolean'||typeof a.checkCorrect==='boolean');}
 const max=items=>Math.max(0,...items);
 const last=(items,kind)=>max(items.filter(a=>!kind||a.kind===kind).map(a=>a.completedAt));
 const worked=a=>stamp(a.answeredAt)||stamp(a.taughtAt)||Number.isInteger(a.selected)||Object.values(a.answers||{}).some(x=>String(x??'').trim())||Object.values(a.texts||{}).some(x=>typeof x==='string'&&x.trim())||a.recorded===true;
 const workTime=a=>max(['answeredAt','checkAnsweredAt','taughtAt','updatedAt','startedAt'].map(k=>stamp(a[k])?a[k]:0));
 const deferred=(prefs,key,now)=>stamp(prefs?.deferred?.[key])&&prefs.deferred[key]>now;
 function resumeChoices(modules,now){
  const config={
   [BIO]:{subject:'biology',title:'Jätkan pooleli bioloogiat',href:'./imat.html#learn'},
   [BASICS]:{subject:'biology',title:'Jätkan pooleli bioloogia alust',href:'./basics.html'},
   [CHEM]:{subject:'chemistry',title:'Jätkan pooleli keemiat',href:'./quant.html?subject=chemistry&from=plan'},
   [IELTS]:{subject:'ielts',title:'Jätkan IELTS-i vastust',href:'./ielts.html?guided=1'},
   'hendrik-physics-v1':{subject:'physics',title:'Jätkan pooleli füüsikat',href:'./quant.html?subject=physics&from=plan'},
   'hendrik-maths-v1':{subject:'maths',title:'Jätkan pooleli matemaatikat',href:'./quant.html?subject=maths&from=plan'}
  },result=[];
  for(const [key,c]of Object.entries(config))for(const a of rows(modules[key],now)){
   if(a.closed||a.completedAt||a.stage==='done'||a.status==='empty'||!worked(a)||workTime(a)>now)continue;
   if([BIO,BASICS].includes(key)&&modules[key]?.activeId!==a.id)continue;
   if(key===IELTS&&!['writing','speaking','reading','listening'].includes(a.kind))continue;
   let href=c.href;
   if(key===IELTS)href+='&skill='+a.kind;
   else if(['chemistry','physics','maths'].includes(c.subject)){
    if(typeof a.concept!=='string'||!/^[a-z0-9_-]+$/.test(a.concept))continue;
    href+='&concept='+encodeURIComponent(a.concept);
   }
   result.push({...c,key:'resume:'+key+':'+a.id,module:key,sessionId:a.id,concept:a.concept,skill:a.kind,kind:'resume',href,at:workTime(a),reason:'Sinu pooleli vastus on alles. Jätka sellest sammust; võid ka valida teise aine.'});
  }
  return result.sort((a,b)=>b.at-a.at||a.key.localeCompare(b.key));
 }
 function satPrompt(modules,bank,now,prefs={}){
  if(stamp(prefs.satUntil)&&prefs.satUntil>now||stamp(prefs.satDoneAt)&&prefs.satDoneAt<=now)return null;
  const valid=rows(modules['hendrik-video-practice-v1'],now),dates=new Set(),items={maths:new Set(),english:new Set()};
  for(const a of valid){
   const part=Object.keys(satParts).find(k=>satParts[k].includes(a.videoId)),v=bank?.videos?.find(v=>v.id===a.videoId&&v.domain==='sat');
   if(!part||!v||a.kind!=='video-practice'||a.stage!=='done'||!stamp(a.answeredAt)||a.completedAt!==a.answeredAt||typeof a.correct!=='boolean'||!Number.isInteger(a.questionIndex)||v.questions?.[a.questionIndex]?.id!==a.questionId)continue;
   dates.add(day(a.answeredAt));items[part].add(a.questionId);
  }
  // A modest navigation heuristic, not an ability/readiness threshold. Answers
  // with help count as familiarity; accuracy never gates access to a baseline.
  if(dates.size<3||items.maths.size<2||items.english.size<2)return null;
  return {kind:'sat-baseline',title:'Leia rahulik aeg ametlikuks SAT-i prooviks',href:'https://satsuite.collegeboard.org/practice/practice-tests/bluebook',deviceHref:'https://bluebook.collegeboard.org/students/prepare-your-device/approved-devices',reason:'Oled proovinud mõlema SAT-i osa ülesandeid mitmel päeval. Ametlik pikem proov aitab valida edasist harjutamist; see soovitus ei tähenda eksamivalmidust. Vali varem lahendamata ja läbi vaatamata test.',deviceNote:'Planeeri pikem katkestusteta aeg toetatud arvutis või sobivas iPadis. iPhone’is saad jätkata Õpitasku lühiharjutustega.'};
 }
 function build(modules={},now=Date.now(),{chemistry=null,prefs={},fallback=null,bank=null}={}){
  if(!stamp(now))return {primary:null,resumes:[],sat:null};
  const today=day(now),resumes=resumeChoices(modules,now),english=rows(modules[IELTS],now).filter(a=>completed(a,true)),chem=rows(modules[CHEM],now).filter(a=>completed(a)),bio=[...rows(modules[BIO],now),...rows(modules[BASICS],now)].filter(a=>completed(a));
  const production=english.filter(productive),productionToday=production.some(a=>day(a.completedAt)===today),missingProduction=['writing','speaking'].some(k=>!last(production,k));
  const urgentEnglish=!productionToday&&(missingProduction||!last(production)||now-last(production)>=3*DAY);
  const kinds=urgentEnglish?['writing','speaking']:['writing','speaking','reading','listening'];
  const englishKind=kinds.slice().sort((a,b)=>last(english,a)-last(english,b)||kinds.indexOf(a)-kinds.indexOf(b))[0];
  const candidates=[
   {subject:'ielts',kind:'ielts-sample',key:'ielts:'+englishKind,title:englishKind==='writing'?'Üks oma vastus · IELTS Writing':englishKind==='speaking'?'Üks mõte oma sõnadega · IELTS Speaking':englishKind==='reading'?'Leian tekstist tõendi · IELTS Reading':'Kuulan ja kontrollin · IELTS Listening',href:'./ielts.html?guided=1&skill='+englishKind,skill:englishKind,last:last(english),reason:urgentEnglish?'Võtame ühe väikese kirjutamis- või rääkimisnäite. See hoiab sinu IELTS-i eesmärgi plaanis; vastuse kirjutad või ütled ise.':'Järgmine IELTS-i oskus valitakse sinu salvestatud töö järgi. See on lühike harjutus, mitte tasemehinnang.'},
   {subject:'chemistry',kind:chemistry?.eligible?'chemistry-skill':'chemistry-practice',key:chemistry?.eligible?'chemistry:'+chemistry.concept+':'+chemistry.skill:'chemistry',title:chemistry?.eligible?'Proovin keerulisemat keemiaseost uuesti':'Üks keemia alusmõte',href:'./quant.html?subject=chemistry&from=plan'+(chemistry?.eligible?'&concept='+encodeURIComponent(chemistry.concept)+'&skill='+encodeURIComponent(chemistry.skill):'&next=1'),module:CHEM,concept:chemistry?.concept,skill:chemistry?.skill,last:last(chem),reason:chemistry?.eligible?'Varasem vastus või kontroll jäi selles oskuses valeks või ebakindlaks. Proovi teist ülesannet; selgituse ja kalkulaatori saad vajadusel avada.':'Keemia alused toetavad nii IMAT-i kui ka Tartu ettevalmistust. Alusta ühest küsimusest ja peatu, kui soovid.'},
   {subject:'biology',kind:'biology-practice',key:'biology',title:'Jätkan bioloogia seoste harjutamist',href:'./imat.html?guided=8',last:last(bio),reason:'Bioloogia jääb Itaalia meditsiiniõppe ettevalmistuses kesksele kohale. Meenuta, proovi uut rakendust ja jätka soovi korral.'}
  ];
  for(let i=0;i<candidates.length;i++){
   const c=candidates[i],resume=resumes.find(r=>r.subject===c.subject&&(c.subject!=='ielts'||r.skill===englishKind));
   if(resume)candidates[i]={...c,...resume,last:c.last};
  }
  const available=candidates.filter(c=>!deferred(prefs,c.key,now)&&!deferred(prefs,c.subject,now));
  available.sort((a,b)=>Number(b.subject==='ielts'&&urgentEnglish)-Number(a.subject==='ielts'&&urgentEnglish)||Number(a.last&&day(a.last)===today)-Number(b.last&&day(b.last)===today)||a.last-b.last);
  let primary=available[0]||null;
  const allCoreToday=candidates.every(c=>c.last&&day(c.last)===today);
  if(allCoreToday){const other=resumes.find(r=>!['ielts','biology','chemistry'].includes(r.subject)&&!deferred(prefs,r.key,now)&&!deferred(prefs,r.subject,now));if(other)primary=other;}
  if(!primary)primary={kind:'choice',key:'choice',subject:'choice',title:'Vali praegu endale sobiv samm',href:'./sat.html',reason:'Varasem töö jääb alles. Võid proovida lühikest SAT-i ülesannet, valida allpool teise aine või tänaseks lõpetada.'};
  return {primary,resumes:resumes.filter(r=>r.key!==primary.key),sat:satPrompt(modules,bank,now,prefs)};
 }
 return {DAY,day,rows,completed,build,satPrompt};
});
