'use strict';
(async()=>{
 const en=document.documentElement.lang==='en',text=(et,eng)=>en?eng:et;
 const bar=document.createElement('nav');bar.className='backup-tools';bar.setAttribute('aria-label','Offline backup');
 const home=document.createElement('a');home.href='./index.html';home.textContent=text('Õpitasku','Study Pocket');
 const repair=document.createElement('a');repair.href='./repair.html';repair.textContent=text('Uuendus ja ühendus','Update & connection');bar.append(repair);
 const progress=document.createElement('a');progress.href='./progress.html';progress.textContent=text('Minu töö ja varukoopia','Progress & backup');
 const button=document.createElement('button');button.textContent=text('Laadi võrguühenduseta õpe','Download offline study');
 const update=document.createElement('button');update.textContent=text('Kontrolli uuendust','Check for an update');
 const state=document.createElement('span');state.setAttribute('role','status');bar.append(home,progress,button,update,state);(document.querySelector('header')||document.body).insertAdjacentElement('afterend',bar);
 const notice=document.createElement('section');notice.className='backup-update-notice';notice.hidden=true;notice.setAttribute('aria-label',text('Õppe uuendus','Study update'));
 const heading=document.createElement('h2');heading.textContent=text('Uuendus on valmis','An update is ready');
 const description=document.createElement('p');description.textContent=text('Uuenda, et saada uusim õppesisu ja parandused. Võid ka praegu edasi õppida ning uuendada hiljem.','Update to get the latest study content and fixes. You can also keep studying and update later.');
 const actions=document.createElement('div');actions.className='backup-update-actions';
 const apply=document.createElement('button');apply.type='button';apply.textContent=text('Uuenda nüüd','Update now');
 const later=document.createElement('button');later.type='button';later.textContent=text('Hiljem','Later');actions.append(apply,later);
 const noticeState=document.createElement('p');noticeState.setAttribute('role','status');notice.append(heading,description,actions,noticeState);bar.insertAdjacentElement('afterend',notice);
 let reg,checking=false,lastCheck=0,laterUntil=0;
 const laterKey='study-pocket:update-reminder:later',checkEvery=15*60*1000;
 try{laterUntil=Number(sessionStorage.getItem(laterKey))||0;}catch{}
 const observedRegistrations=new WeakSet(),observedWorkers=new WeakSet();
 function refreshReminder(){
  const waiting=!!reg?.waiting&&reg.waiting.state!=='redundant';
  update.textContent=waiting?text('Rakenda valmis uuendus','Apply ready update'):text('Kontrolli uuendust','Check for an update');
  update.setAttribute('data-update-ready',String(waiting));
  const wasHidden=notice.hidden;notice.hidden=!waiting||Date.now()<laterUntil;
  if(wasHidden&&!notice.hidden)noticeState.textContent=text('Uus õppepakett on alla laaditud ja valmis rakendamiseks.','The new study pack is downloaded and ready to apply.');
 }
 function observeRegistration(){
  if(!reg)return;
  function observeWorker(){
   const worker=reg.installing;
   if(worker&&!observedWorkers.has(worker)){observedWorkers.add(worker);worker.addEventListener('statechange',()=>{refreshReminder();Promise.resolve().then(refreshReminder);});}
   refreshReminder();
  }
  if(!observedRegistrations.has(reg)){observedRegistrations.add(reg);reg.addEventListener('updatefound',observeWorker);}
  observeWorker();
 }
 async function checkInBackground(){
  refreshReminder();
  if(!reg||checking||document.hidden||navigator.onLine===false||reg.waiting||reg.installing||Date.now()-lastCheck<checkEvery)return;
  checking=true;lastCheck=Date.now();
  try{await reg.update();observeRegistration();}catch{/* Offline checks do not imply an update is ready. */}finally{checking=false;refreshReminder();}
 }
 later.onclick=()=>{laterUntil=Date.now()+30*60*1000;try{sessionStorage.setItem(laterKey,String(laterUntil));}catch{}refreshReminder();};
 apply.onclick=()=>update.onclick?.();
 const tell=s=>{state.textContent=s;};
 const display=s=>{tell(s.core&&s.audio===s.totalAudio?text('Bioloogia ja English, sh kuulamine, on selles brauseris võrguühenduseta valmis.','Biology and English, including listening, are ready offline in this browser.'):s.core?text(`Õppetekstid valmis. Kuulamisfaile ${s.audio}/${s.totalAudio}.`,`Study pages ready. Listening files ${s.audio}/${s.totalAudio}.`):text('Esmase allalaadimise jaoks hoia internet sees.','Stay online for the initial download.'));button.hidden=s.core&&s.audio===s.totalAudio;};
 function send(type,progressFn){return new Promise((resolve,reject)=>{const worker=reg?.active||navigator.serviceWorker.controller;if(!worker)return reject(Error('Offline setup is not ready yet. Try again shortly.'));const ch=new MessageChannel(),timeout=setTimeout(()=>reject(Error('Download interrupted. Keep the page open and retry online.')),180000);ch.port1.onmessage=e=>{if(e.data.progress){progressFn?.(e.data);return;}clearTimeout(timeout);ch.port1.close();e.data.error?reject(Error(e.data.error)):resolve(e.data);};worker.postMessage({type},[ch.port2]);});}
 if(!('serviceWorker'in navigator)){tell(text('See brauser ei toeta võrguühenduseta lehe avamist.','This browser does not support offline page opening.'));button.disabled=true;update.disabled=true;return;}

 button.onclick=async()=>{button.disabled=true;try{await navigator.storage?.persist?.();await send('download',display);display(await send('status'));}catch(e){tell(text('Allalaadimine jäi pooleli. Proovi internetiga uuesti. ','Download did not finish. Retry online. ')+e.message);}finally{button.disabled=false;}};
 update.onclick=async()=>{if(update.disabled)return;update.disabled=true;apply.disabled=true;try{
  if(!reg)reg=await navigator.serviceWorker.register('./backup-sw.js',{scope:'./',updateViaCache:'none'});
  observeRegistration();
  tell(text('Kontrollin ja laadin uuendust… hoia leht avatuna.','Checking and downloading… keep this page open.'));noticeState.textContent=state.textContent;
  const worker=await window.PocketUpdate.install(reg);
  await window.BackupStore?.flush();
  if(window.BackupStore?.corrupt()||(window.BackupStore&&!window.BackupStore.isSaved()&&Object.keys(window.BackupStore.snapshot().modules).length))throw Error('unsaved');
  if(worker){tell(text('Uuendus valmis. Avan uuendatud õppe…','Update ready. Opening updated study…'));await window.PocketUpdate.activate(worker,navigator.serviceWorker);location.reload();}
  else{tell(text('Selles brauseris on viimane avaldatud õppeversioon.','This browser has the latest published study version.'));}
 }catch(e){tell(e.message==='unsaved'?text('Töö pole veel turvaliselt salvestatud. Ava „Minu töö ja varukoopia“. Uuendust ei rakendatud.','Some work is not safely saved. Open Progress & backup. Update not applied.'):text('Uuendus ei lõpetanud. Senine õpe ja töö jäävad alles. Proovi internetiga uuesti.','Update did not finish. Existing study and work are retained. Retry online.'));}finally{update.disabled=false;apply.disabled=false;refreshReminder();noticeState.textContent=state.textContent;}};
 window.addEventListener('online',checkInBackground);
 document.addEventListener('visibilitychange',checkInBackground);
 navigator.serviceWorker.addEventListener('controllerchange',refreshReminder);
 setInterval(checkInBackground,60000);
 try{
  reg=await navigator.serviceWorker.register('./backup-sw.js',{scope:'./',updateViaCache:'none'});lastCheck=Date.now();observeRegistration();
  reg=await navigator.serviceWorker.ready;observeRegistration();display(await send('status'));
 }catch{tell(text('Võrguühenduseta ettevalmistus ei õnnestunud. Proovi internetiga uuesti.','Offline preparation failed. Retry while online.'));}
})();
