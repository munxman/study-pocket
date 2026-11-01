/* One action waits for verified installation, then activation. Never clears study storage. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PocketUpdate=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 async function install(reg,{timeout=180000}={}){
  if(reg.waiting)return reg.waiting;
  let stop;const waiting=new Promise((resolve,reject)=>{
   let timer,finished=false;const watched=new Set();
   const finish=(error,value)=>{if(finished)return;finished=true;clearTimeout(timer);reg.removeEventListener('updatefound',found);for(const w of watched)w.removeEventListener('statechange',check);error?reject(error):resolve(value);};
   const check=()=>{if(reg.waiting)return finish(null,reg.waiting);for(const w of watched){if(w.state==='installed')return finish(null,w);if(w.state==='redundant')return finish(Error('installation_failed'));}};
   const found=()=>{const w=reg.installing;if(w&&!watched.has(w)){watched.add(w);w.addEventListener('statechange',check);}check();};
   reg.addEventListener('updatefound',found);timer=setTimeout(()=>finish(Error('update_timeout')),timeout);stop=finish;found();
  });
  // Attach handlers before update(): it can resolve while a worker is still installing.
  waiting.catch(()=>{});
  try{await reg.update();if(!reg.waiting&&!reg.installing){stop(null,null);}return await waiting;}catch(e){stop(e);throw e;}
 }
 async function activate(worker,sw,{timeout=30000}={}){
  if(sw.controller===worker)return;
  return new Promise((resolve,reject)=>{const finish=()=>{clearTimeout(timer);sw.removeEventListener('controllerchange',finish);resolve();};const timer=setTimeout(()=>{sw.removeEventListener('controllerchange',finish);reject(Error('activation_timeout'));},timeout);sw.addEventListener('controllerchange',finish);worker.postMessage({type:'activate'});});
 }
 return {install,activate};
});
