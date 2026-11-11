'use strict';
// This entry only checks the installed pack. Study data and lesson scripts stay in the study page.
(async()=>{
 const base=new URL('./',location.href),sw=navigator.serviceWorker;
 const state=document.getElementById('start-state'),fallback=document.getElementById('start-fallback'),recheck=document.getElementById('start-recheck');
 let retry=null;
 try{history.replaceState(null,'',location.pathname);}catch{}
 const fail=code=>{state.textContent=code==='other_windows'?'Õpitasku on teises sakis avatud. Lõpeta või salvesta seal pooleliolev töö ja sulge see sakk. Seejärel vajuta „Kontrolli uuesti“.':code==='offline'?'Internetiühendust pole. Võid jätkata selles brauseris salvestatud õppega.':'Praegu ei saanud uut õppeversiooni avada. Võid jätkata senise õppega.';fallback.hidden=false;recheck.hidden=code!=='other_windows'||!retry;};
 function bounded(promise,ms,code){let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(code)),ms);})]).finally(()=>clearTimeout(timer));}
 async function published(){
  const url=new URL('release.json',base),abort=new AbortController(),timer=setTimeout(()=>abort.abort(),15000);
  try{const response=await fetch(url.href,{cache:'no-store',redirect:'error',signal:abort.signal});if(!response.ok||response.redirected||response.url!==url.href)throw Error('release_unavailable');const data=await response.json();if(!/^[a-f0-9]{16}$/.test(data.release))throw Error('release_unavailable');return data.release;}finally{clearTimeout(timer);}
 }
 function message(worker,data){return new Promise((resolve,reject)=>{
  if(!worker)return reject(Error('worker_unavailable'));
  const channel=new MessageChannel(),timer=setTimeout(()=>finish(Error('worker_timeout')),10000);
  function finish(error,value){clearTimeout(timer);channel.port1.close();error?reject(error):resolve(value);}
  channel.port1.onmessage=event=>finish(null,event.data);
  try{worker.postMessage(data,[channel.port2]);}catch(error){finish(error);}
 });}
 async function verified(worker,release){const info=await message(worker,{type:'status'});return info?.core===true&&info.release===release;}
 async function current(reg,release){const worker=sw.controller;if(!worker||reg.active!==worker)return false;const valid=await verified(worker,release);return valid&&sw.controller===worker&&reg.active===worker;}
 function installation(reg){return new Promise((resolve,reject)=>{
  const workers=new Set(),timer=setTimeout(()=>finish(Error('installation_timeout')),180000);
  function finish(error){clearTimeout(timer);reg.removeEventListener('updatefound',watch);for(const worker of workers)worker.removeEventListener('statechange',watch);error?reject(error):resolve();}
  function watch(){const worker=reg.installing;if(!worker)return finish();if(!workers.has(worker)){workers.add(worker);worker.addEventListener('statechange',watch);}if(worker.state==='redundant')finish(Error('installation_failed'));else if(['installed','activating','activated'].includes(worker.state))finish();}
  reg.addEventListener('updatefound',watch);watch();
 });}
 function controller(reg,worker){
  let dispose;const promise=new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{dispose();reject(Error('activation_timeout'));},30000);
   const check=()=>{if(sw.controller===worker&&reg.active===worker){dispose();resolve();}};
   dispose=()=>{clearTimeout(timer);sw.removeEventListener('controllerchange',check);};
   sw.addEventListener('controllerchange',check);check();
  });promise.catch(()=>{});return {promise,dispose:()=>dispose()};
 }
 function enter(){location.replace(new URL('index.html',base).href);}
 async function activate(reg,worker,release){
  retry={reg,worker,release};const ready=controller(reg,worker);
  try{const result=await message(worker,{type:'activate-from-start',release});if(!result?.ok)throw Error(result?.error||'activation_refused');await ready.promise;}finally{ready.dispose();}
 }
 async function confirm(reg,release){if(await published()!==release||!(await current(reg,release)))throw Error('release_mismatch');enter();}
 recheck.onclick=async()=>{
  if(recheck.disabled||!retry)return;recheck.disabled=true;state.textContent='Avan õppimist…';
  try{
   const {reg,worker,release}=retry,latest=await published();
   if(await current(reg,latest))return enter();
   if(latest!==release||reg.waiting!==worker||!(await verified(worker,release)))throw Error('release_mismatch');
   await activate(reg,worker,release);await confirm(reg,release);
  }catch(error){fail(error.message);}finally{recheck.disabled=false;}
 };
 try{
  if(navigator.onLine===false)throw Error('offline');
  if(!sw)throw Error('unsupported');
  const release=await published();
  const reg=await bounded(sw.register(new URL('backup-sw.js',base).href,{scope:base.href,updateViaCache:'none'}),20000,'registration_timeout');
  if(await current(reg,release))return enter();
  await bounded(reg.update(),180000,'installation_timeout');
  await installation(reg);
  if(!(await current(reg,release))){
   if(reg.waiting){
    const worker=reg.waiting;
    if(!(await verified(worker,release)))throw Error('release_mismatch');
    await activate(reg,worker,release);
   }else if(reg.active&&await verified(reg.active,release)){
    const ready=controller(reg,reg.active);try{await ready.promise;}finally{ready.dispose();}
   }else throw Error('release_mismatch');
  }
  // A waiting worker may predate the published pack; only the controlling, complete current pack may open study.
  await confirm(reg,release);
 }catch(error){fail(error.message);}
})();
