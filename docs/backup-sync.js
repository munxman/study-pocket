'use strict';
(()=>{
 const API='https://study-pocket-sync.lindstrom.chatgpt.site',KEY='study-pocket:connection:v1';
 const en=document.documentElement.lang==='en',txt=(et,eng)=>en?eng:et;
 const read=(store,k)=>{try{return store.getItem(k);}catch{return null;}},write=(store,k,v)=>{store.setItem(k,v);if(store.getItem(k)!==v)throw Error('Storage unavailable');};
 let connection;try{connection=JSON.parse(read(localStorage,KEY)||'null');}catch{}
 const invitation=read(sessionStorage,'study-pocket:invitation');
 const bar=document.createElement('section');bar.className='backup-status';bar.setAttribute('aria-label',txt('Privaatne sünkroonimine','Private sync'));
 const status=document.createElement('span');status.setAttribute('role','status');const retry=document.createElement('button');retry.textContent=txt('Sünkrooni nüüd','Sync now');bar.append(status,retry);
 (document.querySelector('header')||document.body).insertAdjacentElement('afterend',bar);
 let busy=false,timer=null,changed=false,initialized=false;
 const say=s=>{status.textContent=s;};
 const save=()=>write(localStorage,KEY,JSON.stringify(connection));
 async function request(path,method='GET',body){
  const r=await fetch(API+path,{method,credentials:'omit',cache:'no-store',headers:{...(connection?.key?{Authorization:'Bearer '+connection.key}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(25000)});
  if(r.status===401){const e=Error('Reconnect');e.auth=true;throw e;}if(r.status===409){const e=Error('Conflict');e.conflict=true;e.pairUsed=path==='/pair';throw e;}
  if(!r.ok)throw Error('Sync unavailable');const v=await r.json();if(v.error)throw Error('Sync unavailable');return v;
 }
 async function sync(){
  if(busy||!initialized||!connection?.key||!connection.confirmed)return;
  busy=true;retry.disabled=true;changed=false;
  try{
   const S=window.BackupStore;if(S.corrupt())throw Error('Storage needs recovery');await S.flush();
   const remote=await request('/trial-sync');if(remote.format!=='pocket-sync-v1'||!remote.modules)throw Error('Invalid response');
   // Preserve current local edits, including edits made during the network request.
   const values=Object.fromEntries(Object.entries(remote.modules).map(([k,v])=>[k,v.data]));
   await S.receive(values,connection.base||{});if(!S.isSaved()&&Object.keys(values).length)throw Error('Storage unavailable');
   connection.initialized=true;connection.base=values;connection.revisions=Object.fromEntries(Object.entries(remote.modules).map(([k,v])=>[k,v.revision]));save();
   let reportingPending=remote.reportingPending;
   for(const key of window.BackupModel.keys){
    const local=S.snapshot().modules[key];if(!local||JSON.stringify(local)===JSON.stringify(connection.base[key]))continue;
    // Never upload an initial blank module created by simply opening a page.
    if(!connection.base[key]&&!(local.sessions?.length||Object.keys(local.repairs||{}).length))continue;
    const sent=window.BackupModel.clone(local),v=await request('/trial-sync','PUT',{module:key,revision:connection.revisions[key]||0,data:sent});
    await S.receive({[key]:v.data},{[key]:sent});connection.base[key]=v.data;connection.revisions[key]=v.revision;reportingPending ||= v.reportingPending;save();
   }
   const latest=S.snapshot().modules,pending=window.BackupModel.keys.some(k=>latest[k]&&JSON.stringify(latest[k])!==JSON.stringify(connection.base[k])&&(latest[k].sessions?.length||Object.keys(latest[k].repairs||{}).length));
   connection.lastSync=Date.now();save();
   say(pending?txt('Töö on seadmes. Uued vastused ootavad saatmist.','Saved here. New answers are waiting to upload.'):reportingPending?txt('Töö on kontol. Õpiülevaade uueneb järgmisel ühendusel.','Work saved to your account. Reporting will refresh on the next connection.'):txt('Automaatne sünkroonimine on sees · töö on kontol','Automatic sync is on · work saved to your account'));
   if(pending)schedule(1500);
  }catch(e){say(e.auth?txt('Töö on seadmes alles. Ühendus vajab uut seadistuslinki.','Your work is safe here. This connection needs a new setup link.'):txt('Töö on seadmes alles. Sünkroonime internetiühenduse taastumisel.','Your work is safe here. Sync will retry when online.'));if(e.conflict)schedule(2000);}
  finally{busy=false;retry.disabled=false;if(changed)schedule(1500);}
 }
 function schedule(ms=1200){clearTimeout(timer);timer=setTimeout(sync,ms);}
 retry.onclick=()=>sync();
 async function ready(){
  if(initialized)return;initialized=true;
  if(connection?.confirmed){
   // Reopening a consumed invitation must not replace an established device connection.
   if(invitation)sessionStorage.removeItem('study-pocket:invitation');
   await sync();
  }else if(invitation){
   retry.hidden=true;say(txt('Ühenda see brauser üks kord. Edaspidi salvestub uus töö automaatselt kontole, kui äpp on internetiga avatud.','Connect this browser once. Afterwards, new work syncs automatically whenever the app is open online.'));
   const hasWork=window.BackupModel.summary(window.BackupStore.snapshot()).some(r=>r.completed||r.unfinished);
   const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';label.append(check,document.createTextNode(txt(' Selle brauseri senine töö on minu oma; ühenda see varasema ajalooga.',' The existing work in this browser is mine; merge it with my previous history.')));if(hasWork)bar.append(label);
   const pair=document.createElement('button');pair.textContent=txt('Ühendan oma õpiajaloo','Connect my study history');pair.disabled=hasWork;check.onchange=()=>pair.disabled=!check.checked;bar.append(pair);
   pair.onclick=async()=>{pair.disabled=true;try{
    const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(invitation)))].map(x=>x.toString(16).padStart(2,'0')).join('');
    if(!connection?.key||connection.invitationHash!==digest){const bytes=crypto.getRandomValues(new Uint8Array(32));connection={key:btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),confirmed:false,invitationHash:digest,base:{},revisions:{}};save();}
    await request('/pair','POST',{invitation,deviceKey:connection.key});connection.confirmed=true;save();sessionStorage.removeItem('study-pocket:invitation');pair.remove();label.remove();retry.hidden=false;await sync();
   }catch(e){say(e.pairUsed?txt('See seadistuslink on juba teises brauseris kasutatud. Automaatne sünkroonimine seal jätkub. Selle brauseri ühendamiseks küsi uus privaatne seadistuslink; siinne töö jääb alles.','This setup link was already used in another browser. Automatic sync continues there. Ask for a new private setup link for this browser; your local work is retained.'):txt('Ühendamine ei õnnestunud. Töö jääb alles. Proovi internetiga uuesti; vana või kasutatud link vajab asendamist.','Setup did not finish. Your work is retained. Retry online; an expired or used link needs replacing.'));pair.disabled=hasWork&&!check.checked;}};
  }else{retry.hidden=true;say(txt('See brauser pole veel ühendatud: töö salvestub ainult siia. Ava selle brauseri privaatne seadistuslink. Ühendatud brauseris on sünkroonimine edaspidi automaatne.','This browser is not connected yet: work saves only here. Open a private setup link for this browser. Once connected, syncing is automatic.'));}
 }
 window.addEventListener('backup-ready',ready,{once:true});if(window.BackupStore)ready();
 window.addEventListener('backup-changed',()=>{changed=true;schedule();});window.addEventListener('online',()=>schedule(0));document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(0);});setInterval(()=>{if(!document.hidden)schedule(0);},45000);
 window.PocketSync={sync};
})();
