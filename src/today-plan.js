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
 return {recommend};
});
if(typeof window!=='undefined'&&window.document){(()=>{
 const target=document.getElementById('today-plan');if(!target)return;
 function draw(){const store=window.BackupStore;if(!store||store.corrupt())return;const modules=store.snapshot().modules,bridge=window.ConceptLinks?.recommend(modules),video=window.VIDEO_CONTENT&&window.VideoLinks?.recommendation(modules,window.VIDEO_CONTENT),r=window.TodayPlan.recommend(modules,bridge,Date.now(),video);target.replaceChildren();
  const label=document.createElement('p');label.className='backup-muted';label.textContent='SOOVITUS JÄRGMISEKS SAMMUKS';
  const title=document.createElement('h2');title.textContent=r.title;
  const reason=document.createElement('p');reason.textContent=r.reason;
  const start=document.createElement('a');start.className='backup-primary';start.href=r.href;start.textContent=r.kind==='resume'?'Jätkan':'Proovin seda sammu';
  const note=document.createElement('p');note.className='backup-muted';note.textContent='Valik on sinu. Teised ained ja kahe minuti algus on allpool alati olemas.';
  target.append(label,title,reason,start,note);target.hidden=false;
 }
 function ready(){draw();for(const key of window.BackupModel?.keys||[])window.StudySync?.subscribe(key,draw);}
 if(window.BackupStore)ready();else window.addEventListener('backup-ready',ready,{once:true});window.addEventListener('backup-changed',draw);
})();}
