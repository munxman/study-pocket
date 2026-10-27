'use strict';
(function(root){
 const KEY='hendrik-study-chain-v1',DAY=86400000,KEYS=['hendrik-bio-basics-v1','hendrik-imat-bio-v1','hendrik-bioloogia-v1','hendrik-ielts-v1'];
 const day=t=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(t);
 const ordinal=d=>Date.parse(d+'T12:00:00Z')/DAY;
 const shift=(d,n)=>new Date((ordinal(d)+n)*DAY).toISOString().slice(0,10);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const array=x=>Array.isArray(x)?x:[];
 function repairData(x){return !!x&&x.version===1&&!!x.repairs&&typeof x.repairs==='object'&&!Array.isArray(x.repairs)&&Object.entries(x.repairs).every(([d,t])=>validRepair(d,t));}
 function validRepair(d,t){return /^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(t)&&t>0&&t<253402214400000&&shift(day(t),-1)===d;}
 let subscribed=false;
 function observe(){if(subscribed||!root.StudySync||!root.document)return;subscribed=true;for(const k of [...KEYS,KEY])root.StudySync.subscribe(k,refreshWidgets);root.addEventListener('focus',refreshWidgets);root.document.addEventListener('visibilitychange',()=>{if(!root.document.hidden)refreshWidgets();});root.setInterval(()=>{if(!root.document.hidden)refreshWidgets();},60000);}
 function refreshWidgets(){for(const section of root.document.querySelectorAll('.study-chain'))replaceWidget(section);}
 function replaceWidget(section,month){const holder=root.document.createElement('div');holder.innerHTML=html(root.StudySync?.storage,{lang:section.dataset.chainLang,compact:section.classList.contains('chain-compact'),month:month||section.dataset.chainMonth,demo:section.dataset.chainDemo==='1'});const next=holder.firstElementChild;if(next&&section.outerHTML!==next.outerHTML){section.replaceWith(next);return next;}return section;}

 function read(storage,{demo=false}={}){
  const modules={},unreadable=[];
  for(const key of KEYS)try{
   // Demo foundations deliberately use their existing separate key as well as
   // StudySync's demo namespace. Never look outside the supplied account store.
   const raw=storage.getItem(key+(demo&&key===KEYS[0]?'-demo':''));
   if(raw){const data=JSON.parse(raw);if(!data||!Array.isArray(data.sessions))throw Error('invalid');modules[key]=data;}
  }catch{unreadable.push(key);}
  let repairs={version:1,repairs:{}};
  try{const raw=storage.getItem(KEY);if(raw){repairs=JSON.parse(raw);if(!repairData(repairs))throw Error('invalid');}}catch{unreadable.push(KEY);repairs={version:1,repairs:{}};}
  return {modules,unreadable,repairs};
 }
 function summarize(modules,now=Date.now(),metadata={version:1,repairs:{}}){
  const today=day(now),yesterday=shift(today,-1),dates=new Map();
  const valid=t=>Number.isFinite(t)&&t>0&&t<=now;
  for(const [index,key] of KEYS.entries()){
   const unique=new Map();
   for(const s of array(modules[key]?.sessions)){
    if(!s||typeof s.id!=='string'||!valid(s.completedAt))continue;
    const meaningful=index===0?typeof s.checkCorrect==='boolean':index===1?typeof s.correct==='boolean':index===2?s.completed===true&&array(s.answers).some(a=>typeof a?.correct==='boolean'):s.status==='submitted'&&(array(s.results).some(r=>typeof r?.correct==='boolean'&&!r.blank)||Object.values(s.texts||{}).some(t=>typeof t==='string'&&t.trim())||s.recorded===true);
    if(!meaningful)continue;
    // One completion per session; later duplicate copies never add another day.
    const old=unique.get(s.id);if(!old||s.completedAt<old.completedAt)unique.set(s.id,s);
   }
   for(const s of unique.values()){
    const d=day(s.completedAt),item=dates.get(d)||{day:d,biology:0,english:0};
    item[index===3?'english':'biology']++;dates.set(d,item);
   }
  }
  const repairs=new Set();
  for(const [d,t] of Object.entries(metadata?.repairs||{}))if(validRepair(d,t)&&t<=now&&!dates.has(d)&&dates.has(shift(d,-1))&&dates.has(shift(d,1)))repairs.add(d);
  const days=[...dates.keys()].sort(),linked=new Set([...days,...repairs]);let best=0,run=0,prior=null;
  for(const d of [...linked].sort()){run=prior&&ordinal(d)-ordinal(prior)===1?run+1:1;best=Math.max(best,run);prior=d;}
  let current=0,end=linked.has(today)?today:linked.has(yesterday)?yesterday:null;
  while(end&&linked.has(end)){current++;end=shift(end,-1);}
  const repairAvailable=dates.has(today)&&!linked.has(yesterday)&&dates.has(shift(today,-2));
  return {today,days,dates,repairs,repairAvailable,current,best,total:days.length,todayDone:dates.has(today),lastDay:days.at(-1)||null};
 }
 function weld(storage,now=Date.now(),options={}){
  const loaded=read(storage,options),r=summarize(loaded.modules,now,loaded.repairs);
  if(loaded.unreadable.length||!r.repairAvailable)return false;
  const next={version:1,repairs:{...loaded.repairs.repairs,[shift(r.today,-1)]:now}};
  storage.setItem(KEY,JSON.stringify(next));return true;
 }
 function html(storage,{lang='et',compact=false,month,now=Date.now(),demo=false}={}){
  if(!storage)return '';observe();
  const loaded=read(storage,{demo}),r=summarize(loaded.modules,now,loaded.repairs),en=lang==='en',locale=en?'en-GB':'et-EE',currentMonth=r.today.slice(0,7),firstMonth=r.days[0]?.slice(0,7)||currentMonth;
  const partial=loaded.unreadable.length>0;
  const title=en?'One small step a day.':'Üks väike samm päevas.';
  const message=r.todayDone?(en?'Today’s link is in place. Continue if you want to.':'Tänane lüli on olemas. Jätka, kui soovid.'):
   r.current?(en?'One short block can add today’s link.':'Üks lühike plokk lisab tänase lüli.'):
   r.total?(en?'Start a new chain whenever you are ready. Your earlier work stays.':'Alusta uut ahelat, kui oled valmis. Varasem töö jääb alles.'):
   (en?'Your first completed block starts the chain.':'Esimene lõpetatud plokk alustab ahelat.');
  const dateLabel=d=>new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'));
  const cell=d=>{const item=r.dates.get(d),repaired=r.repairs.has(d),future=d>r.today,label=dateLabel(d)+': '+(item?(en?`${item.biology} biology, ${item.english} English blocks`:`${item.biology} bioloogia-, ${item.english} inglise keele plokki`):repaired?(en?'welded link; no completed block saved':'parandatud lüli; lõpetatud plokki pole salvestatud'):future?(en?'upcoming':'ees'):(en?'no completed block saved':'lõpetatud plokki pole salvestatud'));
   return `<span class="chain-day${item?' chain-done':repaired?' chain-repaired':''}${d===r.today?' chain-today':''}${future?' chain-future':''}" role="listitem" aria-label="${esc(label)}"${d===r.today?' aria-current="date"':''}><span class="chain-date">${Number(d.slice(8))}</span><span class="chain-mark" aria-hidden="true">${item?'×':repaired?'↔':future?'':'·'}</span></span>`;};
  let calendar='';
  if(compact){calendar=`<div class="chain-week" role="list" aria-label="${en?'Last seven days':'Viimased seitse päeva'}">${Array.from({length:7},(_,i)=>cell(shift(r.today,i-6))).join('')}</div>`;}
  else{
   if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month||'')||month<firstMonth||month>currentMonth)month=currentMonth;
   const first=month+'-01',offset=(new Date(first+'T12:00:00Z').getUTCDay()+6)%7,last=new Date(Number(month.slice(0,4)),Number(month.slice(5)),0).getDate();
   const heading=new Intl.DateTimeFormat(locale,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(first+'T12:00:00Z'));
   calendar=`<div class="chain-month"><button type="button" data-chain-move="-1" aria-label="${en?'Previous month':'Eelmine kuu'}"${month<=firstMonth?' disabled':''}>←</button><h3>${esc(heading)}</h3><button type="button" data-chain-move="1" aria-label="${en?'Next month':'Järgmine kuu'}"${month>=currentMonth?' disabled':''}>→</button></div><div class="chain-weekdays" aria-hidden="true">${(en?['M','T','W','T','F','S','S']:['E','T','K','N','R','L','P']).map(d=>`<span>${d}</span>`).join('')}</div><div class="chain-calendar" role="list" aria-label="${esc(heading)}">${'<span aria-hidden="true"></span>'.repeat(offset)}${Array.from({length:last},(_,i)=>cell(month+'-'+String(i+1).padStart(2,'0'))).join('')}</div>`;
  }
  return `<section class="study-chain${compact?' chain-compact':''}" data-chain-lang="${en?'en':'et'}" data-chain-month="${esc(month||currentMonth)}" data-chain-demo="${demo?'1':'0'}" aria-label="${en?'Learning chain':'Õppimisahel'}"><div class="chain-intro"><span class="chain-eyebrow">${en?'DON’T BREAK THE CHAIN':'ÄRA KATKESTA AHELAT'}</span><h2 tabindex="-1">${title}</h2><p>${partial?(en?'Some saved history could not be read. The chain shown is incomplete.':'Osa salvestatud ajaloost ei avanenud. Kuvatud ahel on osaline.'):message}</p></div><dl class="chain-stats"><div><dt>${en?'Current chain':'Praegune ahel'}</dt><dd>${r.current}<small>${en?(r.current===1?'day':'days'):(r.current===1?'päev':'päeva')}</small></dd></div><div><dt>${en?'Best saved chain':'Pikim salvestatud ahel'}</dt><dd>${r.best}<small>${en?(r.best===1?'day':'days'):(r.best===1?'päev':'päeva')}</small></dd></div><div><dt>${en?'Days completed':'Päevi tehtud'}</dt><dd>${r.total}</dd></div></dl>${calendar}${r.repairs.size?`<p class="chain-note">${en?`${r.repairs.size} welded ${r.repairs.size===1?'link':'links'} included in chain lengths; completed study days stay separate.`:`Ahela pikkuses on ${r.repairs.size} parandatud lüli. Tehtud õppepäevi loeme eraldi.`}</p>`:''}${r.repairAvailable&&!partial?`<div class="chain-repair"><p>${en?'Missed yesterday? You studied the day before and have completed a block today. You can weld this single gap.':'Eile jäi vahele? Üleeile õppisid ja tänane plokk on tehtud. Võid selle ühe puuduva lüli kokku keevitada.'}</p><button type="button" data-chain-weld>${en?'Weld yesterday’s link':'Keevitan eilse lüli kokku'}</button><small>${en?'Marked as a repair, not a completed study day.':'Märgime paranduse, mitte tehtud õppepäeva.'}</small></div>`:''}<p class="chain-feedback" role="status"></p><p class="chain-note">${en?'One completed biology or English block marks the day. Mistakes count too. Days follow Estonian time.':'Üks lõpetatud bioloogia- või inglise keele plokk märgib päeva. Ka vigadega plokk loeb. Päevad käivad Eesti aja järgi.'}</p>${compact?`<a class="chain-link" href="./progress.html${demo?'?demo':''}#progress">${en?'See your calendar →':'Vaata oma kalendrit →'}</a>`:`<details class="chain-about"><summary>${en?'How the chain works':'Kuidas ahel töötab?'}</summary><p>${en?'Inspired by the calendar idea often called the Seinfeld strategy: mark a small completed step each day. This records practice, not knowledge or an exam score.':'Seinfeldi nimega tuntud kalendriidee: märgi iga päev üks väike tehtud samm. Ahel näitab harjutamist, mitte teadmiste taset ega eksamitulemust.'}</p><p>${en?'Opening a page or leaving answers unfinished does not mark a day. Extra blocks do not create extra days. Today remains available until midnight. If only yesterday was missed, complete a block today to weld that gap; the day before yesterday must also have a completed block. Repairs are marked ↔ and do not add study days or answers. Older or longer gaps start a new chain; your earlier work stays.':'Lehe avamine või pooleli vastamine päeva ei märgi. Lisaplokid ei lisa päevi. Tänane päev on avatud südaööni. Kui ainult eilne jäi vahele, saad pärast tänast plokki selle lüli kokku keevitada; ka üleeile peab olema plokk tehtud. Parandus on märgiga ↔ ega lisa õppepäevi või vastuseid. Vanema või pikema pausi järel algab uus ahel; varasem töö jääb alles.'}</p><p>${en?'Saved offline work counts on its original completion date. This calendar uses only this browser’s saved history; it does not sync to the main app.':'Võrguühenduseta töö loeb algse lõpetamise kuupäeval. Kalender kasutab ainult selle brauseri salvestatud ajalugu; põhiäpiga seda ei sünkroonita.'}</p></details>`}</section>`;
 }
 const api={KEY,KEYS,day,shift,read,summarize,html,weld,validRepair};root.StudyChain=api;if(typeof module==='object'&&module.exports)module.exports=api;
 if(root.document)root.document.addEventListener('click',e=>{
  const button=e.target.closest?.('[data-chain-move],[data-chain-weld]');if(!button||button.disabled)return;
  const section=button.closest('.study-chain');if(!section)return;
  if(button.hasAttribute('data-chain-weld')){
   const en=section.dataset.chainLang==='en';let message;
   try{const saved=weld(root.StudySync?.storage,Date.now(),{demo:section.dataset.chainDemo==='1'});message=saved?(en?'Yesterday’s link is welded. Your study totals are unchanged.':'Eilne lüli on kokku keevitatud. Tehtud töö arvud jäid samaks.'):(en?'This gap can no longer be welded. Your calendar has been refreshed.':'Seda lünka ei saa praegu parandada. Kalender on värskendatud.');}
   catch{message=en?'Could not save the repair. Keep this page open and try again.':'Parandust ei saanud salvestada. Hoia leht avatuna ja proovi uuesti.';}
   const next=replaceWidget(section);next.querySelector('.chain-feedback').textContent=message;next.querySelector('h2')?.focus({preventScroll:true});return;
  }
  const move=Number(button.dataset.chainMove);if(![-1,1].includes(move))return;
  const d=new Date(section.dataset.chainMonth+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+move);
  const next=replaceWidget(section,d.toISOString().slice(0,7));next.querySelector(`[data-chain-move="${move}"]:not(:disabled)`)?.focus({preventScroll:true});
 });
})(typeof window!=='undefined'?window:globalThis);
