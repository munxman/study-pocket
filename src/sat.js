'use strict';
(()=>{
 const B=window.VIDEO_CONTENT,E=window.VideoEngine,L=window.VideoLinks,M=window.SatPracticeModel,store=window.StudySync.storage,main=document.getElementById('sat-coach'),params=new URLSearchParams(location.search);
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels={maths:'Math · matemaatika',english:'Reading & Writing · inglise keel'};
 const titles={'sat-linear-equation':'Üks algebraülesanne','sat-linear-model':'Seos ja mudel','sat-area-volume':'Kujundid ja mõõtmed','sat-mean-median':'Andmete võrdlemine','sat-inferences':'Ingliskeelse teksti mõte','sat-quantitative-evidence':'Tekst ja arvandmed','sat-transitions':'Lausete seos','sat-sentence-boundaries':'Lauseehitus'};
 const savedStep=Number(params.get('step'));
 let state,sessionId=params.get('session'),step=Number.isSafeInteger(savedStep)&&savedStep>0?savedStep:1,help=false,error='',exposureError='',pending=null,reason='',shownFeedbackFor=null,unavailable='';
 const subjects='<nav class="video-related" aria-label="Teised õppeained"><a class="backup-secondary" href="./imat.html?guided=8">Bioloogia · IMAT</a><a class="backup-secondary" href="./quant.html?subject=chemistry">Keemia</a><a class="backup-secondary" href="./ielts.html">English · IELTS</a><a href="./index.html">Kõik ained</a></nav>';
 function calculator(section){const toggle=document.getElementById('geometry-calc-toggle'),panel=document.getElementById('geometry-calc-panel');if(toggle){toggle.hidden=section!=='maths';if(toggle.hidden){toggle.setAttribute('aria-expanded','false');if(panel)panel.hidden=true;}}}
 try{state=E.restore(store.getItem(E.MODULE_ID),B);}catch(e){calculator(null);main.innerHTML='<h1>Hoiame varasema töö alles.</h1><p>'+esc(e.message)+'</p><a href="./progress.html">Minu töö ja varukoopia</a>';return;}
 function current(){return state.sessions.find(a=>a.id===sessionId&&M.getSection(a.videoId))||null;}
 function save(){try{store.setItem(E.MODULE_ID,JSON.stringify(state));error='';return true;}catch{error='Salvestamine ei õnnestunud. Hoia leht avatuna ja salvesta varukoopia lehel „Minu töö”.';return false;}}
 function address(){history.replaceState(null,'','./sat.html'+(sessionId?'?session='+encodeURIComponent(sessionId)+'&step='+step:''));}
 function exposure(kind){const a=current();if(!a)return;state.activeId=a.id;const v=E.video(B,a.videoId),now=Date.now();E.expose(state,kind,now);L.markRelatedVideoExposure(state,B,v,kind,now);exposureError='';try{L.markRelatedExposure(store,v,now);}catch{exposureError='Seotud aine salvestust ei saanud uuendada. Vaata ühenduse olekut; sinu vastus jääb alles.';}save();}
 function begin(candidate){
  if(!candidate)return;pending=null;help=false;reason=candidate.reason;unavailable='';
  if(candidate.resume){const a=state.sessions.find(a=>a.id===candidate.sessionId);if(!a){choose(M.getSection(candidate.videoId));return;}state.activeId=a.id;sessionId=a.id;}
  else sessionId=E.start(state,B,Date.now(),candidate.videoId).id;
  save();address();draw();
 }
 function choose(section,{continueNow=false,fallback=false}={}){
  const now=Date.now();let candidate=M.choose(state,B,now,section?{section}:{});
  if(!candidate&&fallback)candidate=M.choose(state,B,now);
  // Reuse the existing exact-index bridge only for an untried maths baseline.
  // An ordinary miss invites a check; it neither diagnoses a gap nor skips SAT due work.
  if(candidate?.section==='maths'&&candidate.reason==='unseen')try{
   const ordinary=JSON.parse(store.getItem('hendrik-maths-v1')||'null');
   const hint=L.suggestedHelp({'hendrik-maths-v1':ordinary,[E.MODULE_ID]:state},B,now);
   if(M.getSection(hint?.videoId)==='maths'){
    const linked=M.choose(state,B,now,{section:'maths',excludeVideoIds:M.sections.maths.filter(id=>id!==hint.videoId)});
    if(linked?.reason==='unseen')candidate={...linked,reason:'maths-link'};
   }
  }catch{/* Unknown ordinary history must not become a guessed weakness. */}
  if(candidate?.repeat&&!continueNow){unavailable='';pending=candidate;sessionId=null;help=false;address();draw();}else if(candidate)begin(candidate);else{pending=null;unavailable='Selle osa salvestus või küsimused vajavad kontrollimist. Varasem töö jääb alles. Võid proovida teist SAT-i osa või vaadata „Minu töö ja varukoopia”.';draw();}
  return !!candidate;
 }
 function support(v){return '<section class="video-support"><h2>Üks seos</h2><p lang="en">'+esc(v.gist)+'</p>'+(v.termsEt?'<p>'+esc(v.termsEt)+'</p>':'')+'<p><a class="backup-secondary" href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer" data-video-open>Soovi korral vaatan videot</a></p><p class="backup-muted">Video vajab internetti. Siinne selgitus ja ülesanne töötavad ka allalaaditud õppepakis.</p></section>';}
 function footer(){return '<p class="backup-muted">See on väike alguspakett: neli matemaatika- ja neli lugemise/kirjutamise oskust. Küsimused on meie koostatud; need ei anna SAT-i punktisummat ega asenda IELTS-i.</p><details><summary>Täispikk SAT ja ülejäänud plaan</summary><p><a href="https://satsuite.collegeboard.org/practice/practice-tests/bluebook" target="_blank" rel="noopener noreferrer">Ametlik SAT-i proovitest Bluebookis</a> on eraldi pikem proov sobivaks hetkeks. Vali test, mida sa pole varem lahendanud ega läbi vaadanud.</p><p><a href="./exam-plan.html">Minu eksamiplaan · Itaalia ja Tartu</a></p></details>'+subjects;}
 function draw(){
  const a=current(),section=a?M.getSection(a.videoId):pending?.section;
  // Seeing a saved result is fresh teaching exposure, even on another day.
  // Record it once per page view, without changing the frozen submitted answer.
  if(a?.answeredAt&&shownFeedbackFor!==a.id){shownFeedbackFor=a.id;exposure('explanation');}
  calculator(a?section:null);
  let body='<h1>SAT · üks mõte korraga</h1><p>Üks lühike ülesanne. Võid igal ajal peatuda.</p>';
  if(unavailable)body+='<p role="alert">'+esc(unavailable)+'</p><p><a href="./progress.html">Minu töö ja varukoopia</a></p>';
  if(!a){body+=pending?'<section class="backup-card"><h2>'+esc(labels[section])+'</h2><p>Selle osa küsimusi oled hiljuti juba proovinud. Võid kohe jätkata tuttava ülesandega. Hilisemaks meenutamiseks hoitud teistsugune küsimus jääb alles.</p><button class="backup-primary" data-action="repeat">Kordan tuttavat ülesannet</button></section>':'';body+='<p><button class="backup-secondary" data-section="maths">Valin matemaatika</button> <button class="backup-secondary" data-section="english">Valin inglise keele</button></p>'+footer();}
  else{
   state.activeId=a.id;const v=E.video(B,a.videoId),q=E.question(B,a),other=section==='maths'?'english':'maths';
   body+='<p class="video-metadata">'+esc(labels[section])+' · samm '+step+' · jätkamine on vabatahtlik</p><h2>'+esc(titles[v.id])+'</h2>'+(reason==='weak-due'&&!a.answeredAt?'<p>See oskus jäi varem valeks või ebakindlaks. Proovi nüüd uuesti enne selgituse avamist.</p>':reason==='maths-link'&&!a.answeredAt?'<p>See seostub ühe varasema matemaatikaülesandega. Proovime, kuidas seos siin töötab.</p>':'');
   if(a.answeredAt){
    body+='<section class="backup-card"><h2>'+(a.correct?'See vastus on õige.':'Vaatame mõtte läbi.')+'</h2><p lang="en">'+esc(q.explanation)+'</p><p class="backup-muted">'+(a.delayedProbe?'Hilisem iseseisev vastus.':a.independent?'Vastasid enne selle ülesande abi avamist.':'Vastasid pärast abi avamist — see on toetatud harjutus.')+' '+(a.repeatedQuestion?'See oli tuttava küsimuse kordus.':'See oli selle küsimuse esimene salvestatud vastus.')+'</p><p>'+(a.correct&&a.confidence==='sure'?'Hilisem teistsugune ülesanne aitab kontrollida, kas oskad seost uuesti kasutada.':'See oskus jääb hilisemaks harjutamiseks. Praegu võid proovida teist mõtet või lõpetada.')+'</p><button class="backup-primary" data-action="next">Jätkan järgmise SAT-i ülesandega</button><p><button class="backup-secondary" data-section="maths">Valin matemaatika</button> <button class="backup-secondary" data-section="english">Valin inglise keele</button></p><p><a class="backup-secondary" href="./index.html">Peatun praegu</a></p></section><button class="backup-secondary" data-action="help">'+(help?'Peidan lisaselgituse':'Soovin veel selgitust või videot')+'</button>'+(help?support(v):'')+footer();
   }else{
    body+='<p>'+(a.delayedEligibleAtStart?'Proovi kõigepealt meenutada.':'Proovi kõigepealt oma mõtet.')+' Kui vajad abi, võid selgituse kohe avada.</p>'+(a.repeatedQuestion?'<p class="backup-muted">See on varem vastatud küsimuse kordus.</p>':'')+'<section class="backup-card"><h2 class="video-question" lang="en">'+esc(q.prompt)+'</h2><form id="sat-answer"><fieldset class="quant-options"><legend>Vali vastus</legend>'+q.options.map((o,i)=>'<label class="quant-option"><input type="radio" name="choice" value="'+i+'"'+(a.selected===i?' checked':'')+'><span lang="en">'+esc(o)+'</span></label>').join('')+'</fieldset><fieldset class="quant-options"><legend>Kui kindel oled?</legend>'+[['sure','Üsna kindel'],['unsure','Pole veel kindel']].map(([id,label])=>'<label><input type="radio" name="confidence" value="'+id+'"'+(a.confidence===id?' checked':'')+'> '+label+'</label> ').join('')+'</fieldset><button class="backup-primary" type="submit">Kontrollin mõtet</button></form><p><button class="backup-secondary" data-action="help">'+(help?'Peidan selgituse':'Soovin selgitust või videot')+'</button></p>'+(help?support(v):'')+'<p><a href="./index.html">Peatun praegu · vastusevalik jääb alles</a></p></section><p><button class="backup-secondary" data-section="'+other+'">Valin praegu '+(other==='maths'?'matemaatika':'inglise keele')+'</button></p>'+footer();
   }
  }
  main.innerHTML='<p class="video-save-error" role="alert">'+esc([error,exposureError].filter(Boolean).join(' '))+'</p>'+(!navigator.onLine?'<p role="status">Oled võrguühenduseta. Allalaaditud küsimus ja selgitus töötavad; video vajab internetti.</p>':'')+body;
 }
 main.addEventListener('change',e=>{const a=current();if(!a||a.answeredAt)return;if(e.target.name==='choice'){const i=Number(e.target.value);if(!Number.isInteger(i)||i<0||i>=E.question(B,a).options.length)return;a.selected=i;}else if(e.target.name==='confidence'){if(!['sure','unsure'].includes(e.target.value))return;a.confidence=e.target.value;}else return;save();});
 main.addEventListener('click',e=>{
  if(e.target.closest('[data-video-open]')){exposure('video');return;}
  const section=e.target.closest('[data-section]');if(section){step=1;choose(section.dataset.section,{continueNow:true});main.focus();return;}
  const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
  if(action==='repeat'&&pending)begin(pending);
  else if(action==='next'&&current()?.answeredAt){const next=M.getSection(current().videoId)==='maths'?'english':'maths',previousStep=step;step=step<Number.MAX_SAFE_INTEGER?step+1:step;if(!choose(next,{continueNow:true,fallback:true})){step=previousStep;draw();}}
  else if(action==='help'&&current()){help=!help;if(help)exposure('gist');draw();}
  main.focus();
 });
 main.addEventListener('submit',e=>{e.preventDefault();const a=current();if(!a||a.answeredAt)return;state.activeId=a.id;if(!E.submit(state,B,Date.now())){error='Vali vastus ja kindlus. Selgituse võid alati avada.';draw();return;}shownFeedbackFor=a.id;exposure('explanation');draw();main.focus();});
 window.StudySync.subscribe(E.MODULE_ID,data=>{try{const incoming=E.restore(data,B);if(sessionId&&!incoming.sessions.some(a=>a.id===sessionId)){error='Ühendatud salvestuses pole seda sammu veel. Hoia leht avatuna ja vaata ühenduse olekut.';draw();return;}state=incoming;if(current())state.activeId=sessionId;draw();}catch{error='Uuem salvestus vajab kontrollimist. Sinu töö jääb alles.';draw();}});
 window.addEventListener('online',draw);window.addEventListener('offline',draw);
 // A refresh must restore the exact attempt, including an already submitted result.
 // A stale link never silently starts or overwrites another attempt.
 if(sessionId){if(current()){state.activeId=sessionId;draw();}else{calculator(null);main.innerHTML='<h1>See õppesamm pole selles brauseris veel saadaval.</h1><p>Varasem töö jääb alles. Võid jätkata oma olemasolevas brauseris või valida SAT-i avalehe.</p><a class="backup-primary" href="./sat.html">SAT-i avaleht</a>'+subjects;}}
 else choose(['maths','english'].includes(params.get('section'))?params.get('section'):undefined);
})();
