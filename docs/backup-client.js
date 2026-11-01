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
 let reg;
 const tell=s=>{state.textContent=s;};
 const display=s=>{tell(s.core&&s.audio===s.totalAudio?text('Bioloogia ja English, sh kuulamine, on selles brauseris võrguühenduseta valmis.','Biology and English, including listening, are ready offline in this browser.'):s.core?text(`Õppetekstid valmis. Kuulamisfaile ${s.audio}/${s.totalAudio}.`,`Study pages ready. Listening files ${s.audio}/${s.totalAudio}.`):text('Esmase allalaadimise jaoks hoia internet sees.','Stay online for the initial download.'));button.hidden=s.core&&s.audio===s.totalAudio;};
 function send(type,progressFn){return new Promise((resolve,reject)=>{const worker=reg?.active||navigator.serviceWorker.controller;if(!worker)return reject(Error('Offline setup is not ready yet. Try again shortly.'));const ch=new MessageChannel(),timeout=setTimeout(()=>reject(Error('Download interrupted. Keep the page open and retry online.')),180000);ch.port1.onmessage=e=>{if(e.data.progress){progressFn?.(e.data);return;}clearTimeout(timeout);ch.port1.close();e.data.error?reject(Error(e.data.error)):resolve(e.data);};worker.postMessage({type},[ch.port2]);});}
 if(!('serviceWorker'in navigator)){tell(text('See brauser ei toeta võrguühenduseta lehe avamist.','This browser does not support offline page opening.'));button.disabled=true;update.disabled=true;return;}
 try{reg=await navigator.serviceWorker.register('./backup-sw.js',{scope:'./',updateViaCache:'none'});reg=await navigator.serviceWorker.ready;display(await send('status'));if(reg.waiting)update.textContent=text('Rakenda valmis uuendus','Apply ready update');}catch{tell(text('Võrguühenduseta ettevalmistus ei õnnestunud. Proovi internetiga uuesti.','Offline preparation failed. Retry while online.'));}

 button.onclick=async()=>{button.disabled=true;try{await navigator.storage?.persist?.();await send('download',display);display(await send('status'));}catch(e){tell(text('Allalaadimine jäi pooleli. Proovi internetiga uuesti. ','Download did not finish. Retry online. ')+e.message);}finally{button.disabled=false;}};
 update.onclick=async()=>{update.disabled=true;try{
  if(!reg)reg=await navigator.serviceWorker.register('./backup-sw.js',{scope:'./',updateViaCache:'none'});
  tell(text('Kontrollin ja laadin uuendust… hoia leht avatuna.','Checking and downloading… keep this page open.'));
  const worker=await window.PocketUpdate.install(reg);
  await window.BackupStore?.flush();
  if(window.BackupStore?.corrupt()||(window.BackupStore&&!window.BackupStore.isSaved()&&Object.keys(window.BackupStore.snapshot().modules).length))throw Error('unsaved');
  if(worker){tell(text('Uuendus valmis. Avan uuendatud õppe…','Update ready. Opening updated study…'));await window.PocketUpdate.activate(worker,navigator.serviceWorker);location.reload();}
  else{tell(text('Selles brauseris on viimane avaldatud õppeversioon.','This browser has the latest published study version.'));}
 }catch(e){tell(e.message==='unsaved'?text('Töö pole veel turvaliselt salvestatud. Ava „Minu töö ja varukoopia“. Uuendust ei rakendatud.','Some work is not safely saved. Open Progress & backup. Update not applied.'):text('Uuendus ei lõpetanud. Senine õpe ja töö jäävad alles. Proovi internetiga uuesti.','Update did not finish. Existing study and work are retained. Retry online.'));}finally{update.disabled=false;}};
})();
