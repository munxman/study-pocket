(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TodayPlan=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const routes={
  'hendrik-imat-bio-v1':{title:'Jätkan pooleli IMAT-bioloogiat',href:'./imat.html#learn'},
  'hendrik-bio-basics-v1':{title:'Jätkan pooleli bioloogia alust',href:'./basics.html'},
  'hendrik-maths-v1':{title:'Jätkan pooleli matemaatikat',href:'./quant.html?subject=maths'},
  'hendrik-physics-v1':{title:'Jätkan pooleli füüsikat',href:'./quant.html?subject=physics'},
  'hendrik-chemistry-v1':{title:'Jätkan pooleli keemiat',href:'./quant.html?subject=chemistry'},
  'hendrik-ielts-v1':{title:'Jätkan English-praktikat',href:'./ielts.html'}
 };
 const time=s=>Math.max(...['updatedAt','answeredAt','checkAnsweredAt','startedAt'].map(k=>Number.isFinite(s[k])?s[k]:0));
 const worked=s=>!!(s.answeredAt||s.taughtAt||s.assisted||Number.isInteger(s.selected)||Object.keys(s.answers||{}).length||Object.values(s.texts||{}).some(x=>String(x).trim()));
 function recommend(modules={},bridge=null,now=Date.now(),video=null){
  const unfinished=[];
  for(const [key,route] of Object.entries(routes))for(const s of modules[key]?.sessions||[]){
   if(!s||s.closed||(s.participant&&!['learner','hendrik'].includes(s.participant))||s.completedAt||s.stage==='done'||!worked(s)||time(s)>now)continue;
   if(['hendrik-imat-bio-v1','hendrik-bio-basics-v1','hendrik-ielts-v1'].includes(key)&&modules[key].activeId!==s.id)continue;
   unfinished.push({key,s,route});
  }
  unfinished.sort((a,b)=>time(b.s)-time(a.s)||a.key.localeCompare(b.key));
  if(unfinished.length){const {key,s,route}=unfinished[0];return {kind:'resume',title:route.title,href:route.href+(key.includes('maths')||key.includes('physics')||key.includes('chemistry')?'&concept='+encodeURIComponent(s.concept):''),reason:'Sinu varasem samm on alles. Jätka sealt või vali allpool teine aine.',module:key,concept:s.concept};}
  if(video)return video;
  if(bridge){return {kind:'bridge',title:bridge.title,href:bridge.href,reason:bridge.reason,returnHref:'./imat.html#learn'};}
  if(!(modules['hendrik-chemistry-v1']?.sessions||[]).some(s=>s.answeredAt||s.completedAt))return {kind:'start',title:'Proovin keemia esimest alusplokki',href:'./quant.html?subject=chemistry',reason:'Aatomid ja ioonid aitavad mõista nii bioloogiat kui ka mõlema ülikooli keemiaülesandeid. Selgituse võid avada kohe.'};
  return {kind:'practice',title:'Jätkan IMAT-i kolme lühikese sammuga',href:'./imat.html?guided=8',reason:'Meenutan, harjutan üht keerukamat mõtet ja vahetan teemat. Peatuda võib igal ajal.'};
 }
 function visibleHelp(help,prefs={},now=Date.now()){
  if(!help)return null;const d=prefs.deferVideo;
  return d&&d.videoId===help.videoId&&d.evidenceAt===help.evidenceAt&&Number.isFinite(d.until)&&d.until>now?null:help;
 }
 return {recommend,visibleHelp};
});
if(typeof window!=='undefined'&&window.document){(()=>{
 const target=document.getElementById('today-plan');if(!target)return;
 const welcome=document.getElementById('video-welcome'),prefKey='opitasku-video-guidance-v1';let prefs={};
 const planKey='opitasku-medical-guidance-v1';let planPrefs={};
 try{const raw=JSON.parse(localStorage.getItem(prefKey)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))prefs=raw;}catch{}
 try{const raw=JSON.parse(localStorage.getItem(planKey)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))planPrefs=raw;}catch{}
 const element=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
 const savePrefs=()=>{try{localStorage.setItem(prefKey,JSON.stringify(prefs));}catch{}};
 const savePlan=()=>{try{localStorage.setItem(planKey,JSON.stringify(planPrefs));}catch{}};
 function introduction(){if(!welcome)return;welcome.replaceChildren();welcome.hidden=!!prefs.welcomeDismissed;if(welcome.hidden)return;
  const title=element('h2','Uus: videoselgitused on nüüd olemas');
  const note=element('p','Kui mõni seos vajab tuge, pakun sinu vastuste põhjal sobivat videot. Pärast saad proovida uut näidet. Video on alati vabatahtlik.');
  const close=element('button','Selge','backup-secondary');close.type='button';close.addEventListener('click',()=>{prefs.welcomeDismissed=true;savePrefs();introduction();target.querySelector('a')?.focus();});
  welcome.append(title,note,close);
 }
 function draw(){introduction();const store=window.BackupStore;if(!store||store.corrupt()){target.hidden=true;return;}
  const now=Date.now(),modules=store.snapshot().modules,bridge=window.ConceptLinks?.recommend(modules),bank=window.VIDEO_CONTENT;
  const due=bank&&window.VideoLinks?.recommendation(modules,bank,now);
  const help=window.TodayPlan.visibleHelp(bank&&window.VideoLinks?.suggestedHelp(modules,bank,now),prefs,now);
  const video=due||(help?{...help,kind:'video-help'}:null),fallback=window.TodayPlan.recommend(modules,bridge,now,video);
  let chemistry=null;try{chemistry=window.QuantEngine?.recommendSkill(modules['hendrik-chemistry-v1'],window.ChemistryContent,now);}catch{}
  const plan=window.MedicalPlan?.build(modules,now,{chemistry,prefs:planPrefs,fallback,bank}),r=plan?.primary||fallback;target.replaceChildren();
  const label=element('p','JÄRGMINE SAMM MEDITSIINIÕPPE POOLE','backup-muted'),title=element('h2',r.title),reason=element('p',r.reason);
  const start=element('a',r.kind==='resume'?'Jätkan':r.kind==='video-help'?'Vaatan selle seose selgitust':'Proovin seda sammu','backup-primary');start.href=r.href;
  const note=element('p','Valik on sinu. Teised ained ja kahe minuti algus on allpool alati olemas.','backup-muted');
  target.append(label,title,reason,start);
  if(plan){
   const another=element('button','Valin teise sammu','backup-secondary');another.type='button';another.addEventListener('click',()=>{if(r.key==='choice'){document.getElementById('subject-choices')?.scrollIntoView({block:'start'});return;}planPrefs.deferred={...(planPrefs.deferred||{}),[r.key]:Date.now()+86400000,[r.subject]:Date.now()+86400000};savePlan();draw();target.querySelector('a')?.focus();});target.append(another);
   if(plan.resumes.length){const details=element('details'),summary=element('summary','Muu pooleli töö jääb alles');details.append(summary);for(const item of plan.resumes){const p=element('p'),a=element('a',item.title);a.href=item.href;p.append(a);details.append(p);}target.append(details);}
   if(plan.sat){const box=element('aside',null,'today-sat-baseline'),title=element('h3',plan.sat.title),reason=element('p',plan.sat.reason),device=element('p',plan.sat.deviceNote,'backup-muted'),link=element('a','Vaata ametlikku SAT-i proovi','backup-secondary'),devices=element('a','Milline seade sobib?');link.href=plan.sat.href;link.target='_blank';link.rel='noopener noreferrer';devices.href=plan.sat.deviceHref;devices.target='_blank';devices.rel='noopener noreferrer';
    const later=element('button','Tuleta hiljem meelde','backup-secondary');later.type='button';later.addEventListener('click',()=>{planPrefs.satUntil=Date.now()+7*86400000;savePlan();draw();});
    const done=element('button','Olen proovi juba teinud','backup-secondary');done.type='button';done.addEventListener('click',()=>{planPrefs.satDoneAt=Date.now();savePlan();draw();});
    box.append(title,reason,device,link,devices,later,done,element('p','Viimane nupp peidab meeldetuletuse selles brauseris; see ei salvesta testitulemust.','backup-muted'));target.append(box);
   }
  }
  // Guided quantitative pages provide help for the exact selected skill.
  // A broad topic match on home must not attach another skill's explanation.
  const sameResume=!plan&&help&&r.kind==='resume'&&r.concept===help.concept&&r.module==='hendrik-'+(help.domain==='biology'?'imat-bio':help.domain)+'-v1';
  if(r.kind==='video-help'||sameResume){
   const box=element('div',null,'today-video-help');
   if(sameResume){box.append(element('p','Soovi korral aitab selle seose videoselgitus. Praegune samm jääb alles.'));const link=element('a','Vaatan sobivat selgitust','backup-secondary');link.href=help.href;box.append(link);}
   const later=element('button','Praegu jätkan õppimist','backup-secondary');later.type='button';later.addEventListener('click',()=>{prefs.deferVideo={videoId:help.videoId,evidenceAt:help.evidenceAt,until:Date.now()+86400000};savePrefs();draw();target.querySelector('a')?.focus();});box.append(later);target.append(box);
  }
  target.append(note);target.hidden=false;
 }
 function ready(){draw();for(const key of window.BackupModel?.keys||[])window.StudySync?.subscribe(key,draw);}
 if(window.BackupStore)ready();else window.addEventListener('backup-ready',ready,{once:true});window.addEventListener('backup-changed',draw);
})();}
