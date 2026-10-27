'use strict';
(async()=>{
 const M=window.BackupModel,subscribers=new Map(),en=document.documentElement.lang==='en';
 const status=document.createElement('div');status.className='backup-status';status.setAttribute('role','status');status.id='backup-save-state';(document.querySelector('header')||document.body).insertAdjacentElement('afterend',status);
 const say=(et,eng,bad=false)=>{status.textContent=en?eng:et;status.dataset.error=String(bad);};
 let current=M.fresh(),db=null,blocked=false,pending=Promise.resolve(),persistedAt=0;
 const nativeRead=()=>{try{return localStorage.getItem(M.STORE);}catch{return null;}};
 const localWrite=d=>{try{localStorage.setItem(M.STORE,JSON.stringify(d));return true;}catch{return false;}};
 function tx(mode,value){return new Promise((resolve,reject)=>{if(!db)return reject(Error('Device database unavailable'));let result;const t=db.transaction('snapshots',mode),s=t.objectStore('snapshots'),r=mode==='readonly'?s.get('current'):s.put(value,'current');r.onsuccess=()=>result=r.result;t.oncomplete=()=>resolve(result);t.onerror=()=>reject(t.error||Error('Save failed'));t.onabort=()=>reject(t.error||Error('Save aborted'));});}
 try{db=await new Promise((resolve,reject)=>{const r=indexedDB.open('study-pocket-progress-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('snapshots');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Storage busy'));});db.onversionchange=()=>{db.close();db=null;};}catch{}
 const raw=nativeRead();let local=null,mirror=null;
 try{if(raw)local=M.parse(raw);}catch{blocked=true;}
 try{const saved=await tx('readonly');if(saved)mirror=M.parse(JSON.stringify(saved));}catch{}
 if(local&&mirror)current=M.merge(local,mirror,window.StudySyncModel.merge,Math.max(local.updatedAt,mirror.updatedAt));else if(local||mirror){current=local||mirror;blocked=false;}
 const notify=key=>{for(const fn of subscribers.get(key)||[])fn(M.clone(current.modules[key]));};
 const saved=()=>say('Salvestatud selles brauseris','Saved in this browser');
 function persist(){
  const snapshot=M.clone(current),localOK=localWrite(snapshot);
  if(localOK){persistedAt=snapshot.updatedAt;saved();}else say('Salvestan seadmesse… hoia leht avatuna.','Saving to this device… keep this page open.');
  pending=pending.catch(()=>{}).then(()=>tx('readwrite',snapshot)).then(()=>{persistedAt=Math.max(persistedAt,snapshot.updatedAt);if(current.updatedAt===snapshot.updatedAt)saved();}).catch(()=>{if(!localOK)say('Salvestamine ei õnnestunud. Hoia leht avatuna ja vali „Salvesta varukoopia“.','Saving failed. Keep this page open and choose “Save backup file”.',true);});
  return pending;
 }
 const storage={getItem(k){return current.modules[k]?JSON.stringify(current.modules[k]):null;},setItem(k,text){if(blocked)throw Error('Existing data needs recovery');if(!M.keys.includes(k)){if(k.endsWith('-before-import'))return;throw Error('Unknown study module');}current.modules[k]=M.validateModule(k,JSON.parse(text));current.updatedAt=Math.max(Date.now(),current.updatedAt+1);persist();window.dispatchEvent(new Event('backup-changed'));},removeItem(){throw Error('Learning records cannot be deleted here');}};
 window.StudySync={storage,subscribe(k,fn){const l=subscribers.get(k)||[];l.push(fn);subscribers.set(k,l);},flush:()=>pending,refresh:async()=>{}};
 window.BackupStore={async receive(modules,bases={}){if(blocked)throw Error('Existing data needs recovery');const next=M.clone(current),changed=[];for(const [k,v] of Object.entries(modules)){const remote=M.validateModule(k,v),local=current.modules[k];const merged=M.validateModule(k,local?window.StudySyncModel.merge(k,bases[k],local,remote):remote);if(JSON.stringify(merged)!==JSON.stringify(local)){next.modules[k]=merged;changed.push(k);}}if(!changed.length)return;await window.BackupValidation?.(next);current=next;current.updatedAt=Math.max(Date.now(),current.updatedAt+1);await persist();if(persistedAt<current.updatedAt)throw Error('Could not save');for(const k of changed)notify(k);},snapshot:()=>M.clone(current),raw:()=>raw,corrupt:()=>blocked,flush:()=>pending,isSaved:()=>persistedAt>=current.updatedAt,async importData(data){const next=M.merge(current,data,window.StudySyncModel.merge);await window.BackupValidation?.(next);const before=current,wasBlocked=blocked;current=next;blocked=false;await persist();if(persistedAt<next.updatedAt){current=before;blocked=wasBlocked;throw Error('Could not save imported work. Existing work is retained.');}for(const k of M.keys)if(current.modules[k])notify(k);window.dispatchEvent(new Event('backup-changed'));return M.summary(current);}};
 window.addEventListener('storage',e=>{if(e.key!==M.STORE||!e.newValue||blocked)return;try{const other=M.parse(e.newValue),next=M.merge(current,other,window.StudySyncModel.merge,Math.max(current.updatedAt,other.updatedAt));if(JSON.stringify(next)===JSON.stringify(current))return;current=next;for(const k of M.keys)if(current.modules[k])notify(k);persist();}catch{say('Teise akna salvestust ei saanud ühendada. Praegune töö jääb alles.','Could not merge another tab. Your current work is retained.',true);}});
 if(blocked){say('Varasemat salvestust ei saanud lugeda. Seda ei kirjutata üle; ava „Minu töö ja varukoopia“.','Previous data could not be read. It will not be overwritten; open “Progress & backup”.',true);}else{persistedAt=local||mirror?current.updatedAt:0;saved();}
 const entries=[...document.querySelectorAll('script[data-study-entry]')].map(s=>s.dataset.studyEntry);
 if(!blocked||document.body.dataset.recovery==='true')for(const src of entries)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.append(s);});
 window.dispatchEvent(new Event('backup-ready'));
})();
