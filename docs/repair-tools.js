'use strict';
(async()=>{
 const $=id=>document.getElementById(id),state=$('repair-state'),report=$('repair-report'),button=$('repair-update');
 let reg,active=null,latest=null,ready=Boolean(window.BackupStore),running=false,syncLoaded=false;
 const date=t=>t?new Intl.DateTimeFormat('et-EE',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Tallinn'}).format(t):'teadmata';
 function localConnection(){try{return JSON.parse(localStorage.getItem('study-pocket:connection:v1')||'null');}catch{return null;}}
 function draw(){
  const c=localConnection(),d=window.PocketSync?.diagnostics(),connected=d?.connected??Boolean(c?.confirmed&&c?.key);
  $('repair-sync').textContent=connected?'See brauser on ühendatud. Kontole jõudmist kinnitab õnnestunud sünkroonimine.':'See brauser pole ühendatud. Siinne töö ei jõua raportisse enne privaatset ühendamist. Ära kustuta brauseri andmeid; saada allolev kokkuvõte Ingmarile.';
  const lines=['Õpitasku · '+location.origin+location.pathname,'Kontroll: '+date(Date.now()),'Avatud: '+(window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone?'avakuva äpp':'brauser'),'Aktiivne õppepakett: '+(active?.release||'teadmata'),'Viimane avaldatud: '+(latest?.release||'internetist kontrollimata'),'Ühendatud: '+(connected?'jah':'ei'),'Viimane kinnitatud sünkroonimine: '+date(d?.lastAcknowledged||c?.lastSync),'Saatmist ootab: '+(d?.pending===true?'jah':d?.pending===false&&!d?.error?'ei':'kontrollimata'),'Ühenduse tulemus: '+(d?.busy?'sünkroonin':d?.error|| (d?.lastAttempt?'õnnestus':'kontrollimata'))];
  if(window.BackupStore){const labels=['Bioloogia alused','Biology / IMAT','IELTS','IMAT proov'];window.BackupModel.summary(window.BackupStore.snapshot()).forEach((s,i)=>lines.push(labels[i]+': '+s.completed+' lõpetatud, '+s.unfinished+' pooleli, '+s.opened+' ainult avatud'));}
  const imat=window.BackupStore?.snapshot().modules['hendrik-imat-bio-v1']?.sessions||[];lines.push('IMAT: '+new Set(imat.filter(a=>a.completedAt).map(a=>a.concept)).size+' erinevat teemat lõpetatud selles brauseris');
  report.textContent=lines.join('\n');
 }
 function workerStatus(){return new Promise((resolve,reject)=>{const w=navigator.serviceWorker.controller||reg?.active;if(!w)return resolve(null);const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('status_timeout'));},10000);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data);};w.postMessage({type:'status'},[channel.port2]);});}
 async function enableSync(){if(syncLoaded||!ready||!active?.core||active.release!==latest?.release)return;syncLoaded=true;const script=document.createElement('script');script.src='./backup-sync.js';script.onload=()=>{draw();setInterval(draw,1500);};document.head.append(script);}
 async function inspect(){
  if(!('serviceWorker'in navigator))throw Error('unsupported');
  reg=await navigator.serviceWorker.register('./backup-sw.js',{scope:'./',updateViaCache:'none'});
  active=await workerStatus();const r=await fetch('./release.json',{cache:'no-store'});if(!r.ok)throw Error('release_unavailable');latest=await r.json();
  state.textContent=active?.core&&active.release===latest.release?'Viimane õppepakett on avatud. IMAT-harjutustes on 30 teemat ja 135 küsimust; päris IMAT-i proov on eraldi.':'Selles brauseris on vanem õppepakett või ettevalmistus on pooleli. Vajuta „Uuenda õpe“ ja oota, kuni leht avaneb uuesti.';
  await enableSync();draw();
 }
 window.addEventListener('backup-ready',()=>{ready=true;enableSync();draw();},{once:true});
 button.onclick=async()=>{if(running)return;running=true;button.disabled=true;try{
  if(!ready)throw Error('storage_not_ready');state.textContent='Laadin ja kontrollin uuendust… hoia leht avatuna.';
  if(!reg)reg=await navigator.serviceWorker.register('./backup-sw.js',{scope:'./',updateViaCache:'none'});
  const worker=await window.PocketUpdate.install(reg);await window.BackupStore.flush();
  if(window.BackupStore.corrupt()||(!window.BackupStore.isSaved()&&Object.keys(window.BackupStore.snapshot().modules).length))throw Error('unsaved');
  if(worker){state.textContent='Uuendus valmis. Avan sama äpi uue versiooni…';await window.PocketUpdate.activate(worker,navigator.serviceWorker);location.reload();}
  else{await inspect();await window.PocketSync?.sync();draw();}
 }catch{state.textContent='Uuendus ei lõpetanud. Senine töö jääb alles. Hoia internet sees ja proovi uuesti; salvestustõrke korral ava „Minu töö ja varukoopia“.';}finally{button.disabled=false;running=false;}};
 $('repair-copy').onclick=async()=>{draw();try{await navigator.clipboard.writeText(report.textContent);$('repair-copy-state').textContent='Kopeeritud. Saada see Ingmarile.';}catch{$('repair-copy-state').textContent='Kopeeri ülalolev tekst või saada sellest ekraanipilt.';}};
 draw();try{await inspect();}catch{state.textContent='Avaldatud versiooni ei saanud internetist kontrollida. Senine töö jääb alles.';draw();}
})();
