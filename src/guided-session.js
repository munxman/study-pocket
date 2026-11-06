'use strict';
(function(root){
 const M=root.GuidedSessionModel||(typeof require==='function'?require('./guided-session-model.js'):null);
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button=(label,action,extra='')=>`<button class="secondary" data-guided="${action}" ${extra}>${esc(label)}</button>`;
 function prepare({url,storage,engine:E,bank:B,state,now=()=>Date.now(),onExposure=()=>{}}){
   const aim=Number(url.searchParams.get('guided'));
   if(![8,12].includes(aim)||url.searchParams.has('practice'))return null;
   let plan=null,enabled=true,storageFailed=false,conflict=false;
   try{const raw=storage.getItem(M.KEY);if(raw)plan=M.restore(JSON.parse(raw),state());}catch{storageFailed=true;}
   if(!plan)plan=M.create(aim,now());
   function persist(){try{storage.setItem(M.KEY,JSON.stringify(plan));storageFailed=false;}catch{storageFailed=true;}}
   function sync(){if(!enabled)return M.summary(plan,state());const result=M.reconcile(plan,state());conflict=result.conflict;
     const active=E.active(state());
     // A locally open example must remain supported if an older unassisted snapshot arrives.
     if(active&&!active.answeredAt&&!active.assisted&&plan.helpSeen.includes(active.id)){
       E.expose(state(),now());onExposure();
     }
     persist();return result;
   }
   function attach(a){if(!a||plan.sessionIds.includes(a.id))return a;plan.sessionIds.push(a.id);persist();return a;}
   function next(){
     if(!enabled||plan.status==='finished')return false;
     const s=state(),info=sync(),active=E.active(s);
     if(info.conflict)return false;
     if(active&&!active.closed&&!M.completed(active)){
       if(!plan.sessionIds.length)attach(active);
       plan.status='active';persist();return true;
     }
     if(info.current&&!M.completed(info.current))return false;
     if(plan.sessionIds.length>=3){plan.status='finished';persist();return false;}
     const chosen=M.choose(plan,s,B,E,now());
     if(!chosen){plan.status='finished';persist();return false;}
     if(active){if(plan.sessionIds.includes(active.id)&&M.completed(active))active.moreChosen=true;E.stop(s);}
     const started=E.start(s,B,now(),chosen.id,true);
     if(started){attach(started);plan.status='active';persist();return true;}
     return false;
   }
   function ensure(){sync();if(plan.status==='paused'||plan.status==='finished'||plan.sessionIds.length)return true;return next();}
   function pause(){if(plan.status!=='finished')plan.status='paused';persist();}
   function resume(){sync();if(conflict||plan.status==='finished')return false;plan.status='active';persist();return plan.sessionIds.length?true:next();}
   function finish(){sync();plan.status='finished';persist();}
   function leave(){finish();enabled=false;}
   function restart(){plan=M.create(plan.aim,now());conflict=false;persist();return next();}
   function setAim(value){if([8,12].includes(value)){plan.aim=value;persist();}}
   function showHelp(){
     const info=sync(),a=E.active(state()),c=B.concepts.find(c=>c.id===a?.concept);
     if(!enabled||info.index!==1||info.current?.id!==a?.id||!c?.guidedExample||a.answeredAt||!['question','lesson'].includes(a.stage))return false;
     E.expose(state(),now());if(!plan.helpSeen.includes(a.id))plan.helpSeen.push(a.id);onExposure();persist();return true;
   }
   function context(){
     if(!enabled)return '';
     const info=sync(),step=Math.min(3,info.index+1);
     const labels=['Meenutus või järgmine mõte','Üks keerulisem seos selgeks','Vahelduseks teine bioloogia teema'];
     return `<aside class="guided-session" aria-label="Sinu õpiring"><p class="small-label">Õpiring · ${info.completed}/3 plokki tehtud</p><h2>${plan.status==='finished'?'Selleks korraks kokkuvõte':`${step}. plokk kolmest · ${labels[info.index]}`}</h2><p>Valitud siht: umbes ${plan.aim} minutit. Kolm mõtet, omas tempos — kell ei jookse ja võid varem lõpetada.</p>${plan.status!=='finished'?`<div class="imat-twin">${button('Siht: 8 minutit','aim-8',`aria-pressed="${plan.aim===8}"`)}${button('Soovin umbes 12 minutit','aim-12',`aria-pressed="${plan.aim===12}"`)}</div><p class="imat-note">Pikema sihi korral võta selgitamiseks ja mõtlemiseks rohkem aega; lisaplokke ei teki.</p>${button('Lõpetan selleks korraks','finish')}`:''}${storageFailed?'<p role="status">Õpiringi plaani ei saanud selles brauseris salvestada. Töö tulemuste salvestusolek on näha eraldi.</p>':''}${conflict?'<p role="status">Sul on teine plokk pooleli. See jääb alles; võid seda vabalt jätkata või hiljem uue õpiringi alustada.</p>':''}</aside>`;
   }
   function help(c,a){
     if(!enabled||plan.status==='finished'||plan.sessionIds[1]!==a.id||!c.guidedExample||a.answeredAt||!['lesson','question'].includes(a.stage))return '';
     const seen=plan.helpSeen.includes(a.id),example=c.guidedExample;
     return `<section class="guided-help coach-card"><h2>Teeme ühe seose rahulikult selgeks</h2><p>Võid enne vastamist vaadata läbimõeldud näidet või proovida kõigepealt ise. Näite kasutamine on õppimise osa.</p>${seen?`<div lang="en"><h3>${esc(example.title)}</h3>${(example.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('')}<p><strong>${esc(example.promptToThink)}</strong></p></div><p class="imat-note">See vastus on nüüd selgituse toel harjutamine.</p>`:button('Vaatan läbimõeldud näidet','help')}</section>`;
   }
   function controls(){
     if(!enabled)return '';
     const info=sync();
     if(plan.status==='finished')return '';
     return `<div class="guided-controls imat-finish"><p>${info.completed===1?'Üks samm tehtud. Järgmises plokis võtame ühe seose rahulikult läbi.':'Järgmiseks üks erinev bioloogia teema.'}</p><div class="imat-twin">${button('Järgmine plokk','next')}${button('Lõpetan selleks korraks','finish')}</div><p class="imat-note">Jätkamine on sinu valik. Võid ka praegu pausi teha.</p>${button('Teen pausi ja jätkan hiljem','pause')}</div>`;
   }
   function finalSummary(){
     const info=sync();
     return `<section class="guided-summary"><h1 tabindex="-1">${info.completed===3?'Kolm mõtet läbi töötatud.':'Selleks korraks tehtud.'}</h1><p>${info.completed}/3 plokki lõpetatud. ${info.current&&!M.completed(info.current)?'Pooleliolev plokk jääb alles. ':''}Valitud ${plan.aim} minutit oli siht, mitte mõõdetud õppimisaeg.</p><ul>${info.sessions.filter(Boolean).map(a=>`<li>${esc(B.concepts.find(c=>c.id===a.concept)?.title||a.concept)} — ${M.completed(a)?'plokk tehtud':'pooleli'}</li>`).join('')}</ul><p>Selgituse järel õige vastus aitab õppida. Meeldejäämist näitab hilisem iseseisev meenutus ja uus rakendus.</p><div class="imat-twin"><a class="secondary" href="./index.html">Lõpetan praegu</a>${button('Jätkan vabalt õppimist','free')}</div>${button('Alustan uut õpiringi','restart')}</section>`;
   }
   return {ensure,next,pause,resume,finish,leave,restart,setAim,showHelp,sync,context,help,controls,finalSummary,
     get enabled(){return enabled;},get status(){return plan.status;},get conflict(){return conflict;},get plan(){return plan;}};
 }
 const api={prepare};root.GuidedSession=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
