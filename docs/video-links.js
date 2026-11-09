(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.VideoLinks=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const KEY='hendrik-video-practice-v1',DAY=86400000;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Exact submitted ordinary-question subskills only. Missing indices and trial
 // results cannot trigger personalised video recommendations.
 const imat={
  // Naming reabsorption or its direction does not establish a cotransport gap.
  division:{video:'bio-chromosome-count',indices:[3,5,6,8,9,10,11,12]},
  mendel:{video:'bio-monohybrid-probability',indices:[0,1,2]},
  transport:{video:'bio-membrane-transport',indices:[0,1,2]},
  'gas-exchange':{video:'bio-gas-diffusion',indices:[1,2,4,5,9]}
 };
 const quantified={
  chemistry:{
   atomic_structure_ions:[{video:'i12-chem-atomic-structure',indices:[1,5]}],
   bonding_polarity:[{video:'i12-chem-polarity',indices:[2,3,4]}],
   moles_stoichiometry:[{video:'i12-chem-moles-ratios',indices:[0,1,2,3,5]}],
   concentration_dilution:[{video:'i12-chem-molarity',indices:[0,1,2]}]
  },
  physics:{atomic_photons:[{video:'i12-physics-photon-energy',indices:[2,3,4,5]}]},
  maths:{
   formulas_units:[{video:'sat-linear-equation',indices:[1,2]}],
   plane_geometry:[{video:'sat-area-volume',indices:[0,2]}],
   proportions:[{video:'bio-gas-diffusion',indices:[2,3,4]}],
   probability_conditions:[{video:'bio-monohybrid-probability',indices:[0,2,3]}]
  }
 };
 const moduleKeys={biology:'hendrik-imat-bio-v1',maths:'hendrik-maths-v1',physics:'hendrik-physics-v1',chemistry:'hendrik-chemistry-v1'};
 const extraTargets={
  'bio-gas-diffusion':{maths:['proportions'],physics:['pressure']},
  'bio-monohybrid-probability':{maths:['probability_conditions']},
  'i12-chem-moles-ratios':{maths:['proportions','formulas_units']},
  'i12-chem-molarity':{maths:['formulas_units'],physics:['units_scale']},
  'i12-physics-waves':{maths:['proportions','formulas_units']},
  'i12-physics-photon-energy':{maths:['proportions']},
  'sat-linear-equation':{maths:['formulas_units']},
  'sat-linear-model':{maths:['formulas_units']},
  'sat-area-volume':{maths:['plane_geometry']}
 };
 function targets(video){
  const result={};
  if(moduleKeys[video.domain])result[video.domain]=[...video.conceptIds];
  // Specific heat does not teach the current work/power/efficiency questions.
  if(video.id==='i12-physics-specific-heat')result.physics=[];
  for(const [domain,ids]of Object.entries(extraTargets[video.id]||{}))result[domain]=[...new Set([...(result[domain]||[]),...ids])];
  return result;
 }
 function contextual(bank,domain,concept,session){
  if(!Number.isFinite(session?.answeredAt)||session.answeredAt<=0||!Number.isInteger(session.questionIndex)||session.questionIndex<0||
     (session.participant!=null&&session.participant!=='learner')||session.paper||session.kind==='trial'||String(session.id||'').startsWith('trial-')||
     (session.concept&&session.concept!==concept)||typeof session.correct!=='boolean'||
     !(session.correct===false||session.confidence==='unsure'))return null;
  const candidates=domain==='biology'?(imat[concept]?[imat[concept]]:[]):quantified[domain]?.[concept]||[];
  const match=candidates.find(x=>x.indices.includes(session.questionIndex));
  return match?bank.videos.find(v=>v.id===match.video)||null:null;
 }
 function slot(bank,domain,concept,session){const v=contextual(bank,domain,concept,session);return v?'<aside class="video-inline"><p>Kas pilt aitaks seda seost näha?</p><a class="backup-secondary" href="./videos.html?video='+encodeURIComponent(v.id)+'&help=1&from='+encodeURIComponent(domain)+'">Soovi korral: video ja uus näide</a><p class="backup-muted">Valikuline. Praegune vastus jääb alles; võid ka kohe jätkata.</p></aside>':'';}
 function recommendation(modules,bank,now=Date.now()){
  const state=modules[KEY];if(!state)return null;
  const due=bank.videos.filter(v=>state.cards?.[v.id]?.due<=now&&state.cards[v.id].lastAt&&now-Math.max(state.cards[v.id].lastExposure||0,state.cards[v.id].lastAt)>=DAY).sort((a,b)=>state.cards[a.id].due-state.cards[b.id].due)[0];
  return due?{kind:'video-review',title:'Proovin varasema selgituse mõtet uues ülesandes',href:'./videos.html?video='+encodeURIComponent(due.id)+'&review=1',reason:'Üks küsimus enne abi avamist. Soovi korral vaata selgitust või vali teine aine.'}:null;
 }
 // A disclosed video/gist is exposure, including across subject boundaries.
 // Never rewrite an already submitted first answer or create a learner response.
 function markRelatedExposure(storage,video,now=Date.now()){
  const writes=[];
  for(const [domain,ids]of Object.entries(targets(video))){
   const key=moduleKeys[domain],raw=storage.getItem(key);if(!raw||!ids.length)continue;
   const state=JSON.parse(raw);if(!state||!Array.isArray(state.sessions)||!state.cards||typeof state.cards!=='object')throw Error('Seotud aine salvestus vajab kontrollimist.');
   let changed=false;
   for(const id of ids){const card=state.cards[id];if(card){card.lastExposure=Math.max(card.lastExposure||0,now);changed=true;}
    for(const a of state.sessions)if(a.concept===id&&!a.answeredAt&&!a.completedAt){a.assisted=true;a.delayedProbe=false;a.delayedEligibleAtStart=false;changed=true;}
   }
   if(changed)writes.push([key,JSON.stringify(state)]);
  }
  // Parse every related source before writing, so unreadable data stays untouched.
  for(const [key,value]of writes)storage.setItem(key,value);
 }
 function markRelatedVideoExposure(state,bank,video,kind,now=Date.now()){
  const source=targets(video);
  for(const other of bank.videos){
   if(other.id===video.id)continue;
   const dest=targets(other),overlap=Object.entries(source).some(([domain,ids])=>ids.some(id=>dest[domain]?.includes(id)));
   if(!overlap)continue;
   const card=state.cards[other.id];if(card)card.lastExposure=Math.max(card.lastExposure||0,now);
   for(const a of state.sessions)if(a.videoId===other.id&&!a.answeredAt){a.assisted=true;a.delayedProbe=false;a.delayedEligibleAtStart=false;a.helpedAt=a.helpedAt||now;a.lastExposureAt=Math.max(a.lastExposureAt||0,now);a.exposures.push({kind,at:now});}
  }
 }
 return {KEY,contextual,slot,recommendation,markRelatedExposure,markRelatedVideoExposure,targets};
});
