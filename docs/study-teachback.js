(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else {
    const api = factory(root);
    root.TeachbackUI = {slot:api.slot};
    api.install();
  }
})(typeof window === 'undefined' ? globalThis : window, root => {
  'use strict';
  const prefix = 'opitasku:teachback:v1:';
  const stages = {entry:'Alguse mõte', repair:'Mõte pärast harjutust', consolidation:'Hilisem selgitus'};
  const keys = {imat:'hendrik-imat-bio-v1', basics:'hendrik-bio-basics-v1'};
  const WEEK=7*86400000, studyDay=at=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Tallinn'}).format(at);
  const offeredHere = new Map(), openEditors = new Set(), temporaryDrafts = new Map();
  const notify = answerId => root.dispatchEvent(new root.CustomEvent('teachback-changed',{detail:{answerId}}));
  const day = at => new Date(at).toLocaleString('et-EE',{timeZone:'Europe/Tallinn',dateStyle:'short',timeStyle:'short'});
  const read = key => JSON.parse(root.localStorage.getItem(prefix+key) || 'null');
  const write = (key, value) => root.localStorage.setItem(prefix+key, JSON.stringify(value));
  const remove = key => root.localStorage.removeItem(prefix+key);
  function list(kind) {
    const store = root.localStorage, values = [];
    for (let i=0; i<store.length; i++) {
      const key = store.key(i);
      if (key?.startsWith(prefix+kind+':')) {
        try { const value = JSON.parse(store.getItem(key)); if(value?.id)values.push(value); } catch {}
      }
    }
    return values;
  }
  function readState(module) {
    try {
      if (!root.StudySync?.storage || root.BackupStore?.corrupt?.()) return null;
      const raw=root.StudySync.storage.getItem(keys[module]);
      return raw ? JSON.parse(raw) : {sessions:[],cards:{}};
    } catch { return null; }
  }
  function offerKey(module, session, rec) {
    return [module, rec.group, rec.stage, session.id].map(encodeURIComponent).join('|');
  }
  function recordSet() {
    const offers=list('offer'), answers=list('answer');
    const completed=new Map();
    for (const a of answers.sort((a,b)=>a.at-b.at)) if(!completed.has(a.offerId))completed.set(a.offerId,a);
    return {offers,answers,completed};
  }
  function history(set) {
    return set.offers.map(o=>{
      const answer=set.completed.get(o.id);
      return {module:o.module, group:o.group, stage:o.stage, sessionId:o.sessionId,
        at:o.at, completedAt:answer?.at, completed:!!answer, skipped:!!o.skipped, entryFresh:answer?.entryFresh===true};
    });
  }
  // Work backwards through this exact concept. A later correct or ambiguous
  // outcome breaks the sequence; an immediate correction closes its own miss.
  function unresolved(states,now){
    const candidates=[];
    for(const module of Object.keys(keys)){
      const byConcept=new Map();
      for(const s of states[module].sessions){
        const list=byConcept.get(s.concept)||[];
        list.push(s);byConcept.set(s.concept,list);
      }
      for(const attempts of byConcept.values()){
        const time=s=>Math.max(s.completedAt||0,s.answeredAt||0,s.startedAt||0);
        if(attempts.some(s=>!Number.isFinite(time(s))||time(s)<=0))continue;
        attempts.sort((a,b)=>time(b)-time(a));
        const latest=attempts[0],days=new Set();
        if(time(latest)>now)continue;
        for(const s of attempts){
          const at=time(s);
          if(at<now-WEEK||!s.completedAt||s.stage!=='done'||s.checkCorrect!==false)break;
          days.add(studyDay(at));
        }
        if(days.size>=2)candidates.push({module,session:latest,at:time(latest)});
      }
    }
    return candidates.sort((a,b)=>b.at-a.at);
  }
  function seedRepair(now=Date.now()){
    if(new URLSearchParams(root.location?.search).has('demo')||root.BackupStore?.corrupt?.())return;
    const connection=root.PocketSync?.diagnostics?.();
    if(!connection?.connected || !connection.lastAcknowledged || connection.error==='authorization')return;
    const states={};
    for(const module of Object.keys(keys)){
      const raw=root.StudySync?.storage?.getItem(keys[module]);
      if(!raw)return;
      const engine=module==='imat'?root.ImatEngine:root.BasicsEngine;
      const bank=module==='imat'?root.IMAT_CONTENT:root.BASICS_CONTENT;
      if(!engine||!bank)return;
      states[module]=engine.restore(JSON.parse(raw),bank);
    }
    const set=recordSet(),seed=set.offers.find(o=>o.fromHistory);
    const candidates=unresolved(states,now);
    if(seed){
      if(!seed.skipped&&!set.completed.has(seed.id)&&!read('draft:'+seed.id)&&
        !temporaryDrafts.has(seed.id)&&!candidates.some(c=>c.module===seed.module&&c.session.id===seed.sessionId)){
        write('offer:'+seed.id,{...seed,skipped:true});
      }
      return;
    }
    if(pending(set).length)return;
    for(const {module,session} of candidates){
      const rec=root.StudyTeachback.recommend({module,state:states[module],otherState:states[module==='imat'?'basics':'imat'],session,history:history(set),now});
      if(rec?.stage!=='repair')continue;
      const id=offerKey(module,session,rec);
      if(read('offer:'+id))return;
      write('offer:'+id,{...rec,id,fromHistory:true,module,sessionId:session.id,concept:session.concept,at:now});
      return;
    }
  }
  function slot({module,state,session,otherState,now=Date.now()}) {
    if(!session?.id || !(module in keys) || !root.StudyTeachback || new URLSearchParams(root.location?.search).has('demo')) return '';
    try {
      const set=recordSet();
      // The daily cap governs new invitations. Repainting the very same
      // question must keep its draft in place while the learner dictates.
      const same=set.offers.find(o=>o.module===module && o.sessionId===session.id &&
        (o.stage==='entry'?session.stage==='question':session.stage==='done'));
      const rec=same || root.StudyTeachback.recommend({module,state,session,otherState:otherState===undefined?readState(module==='imat'?'basics':'imat'):otherState,history:history(set),now});
      if(!rec || !(rec.stage in stages))return '';
      const id=offerKey(module,session,rec);
      const previous=set.offers.find(o=>o.id===id);
      if(previous?.skipped || previous?.deferred || set.completed.has(id))return '';
      const offer=previous||{id,module,group:rec.group,stage:rec.stage,groupTitle:rec.groupTitle,prompt:rec.prompt,
        lang:rec.lang,sessionId:session.id,concept:session.concept,at:now};
      offeredHere.set(id,offer);
      return '<study-teachback data-offer="'+encodeURIComponent(id)+'"></study-teachback>';
    } catch { return ''; }
  }
  function baselineFresh(o, set, context) {
    if (o.stage!=='entry' || context!=='lesson' || o.deferred) return false;
    if(set.answers.some(a=>a.module===o.module&&a.group===o.group&&a.at<=Date.now()))return false;
    const state=readState(o.module),otherState=readState(o.module==='imat'?'basics':'imat');
    if(!state||!otherState)return false;
    return root.StudyTeachback?.isEntryFresh({module:o.module,group:o.group,state,otherState,sessionId:o.sessionId})===true;
  }
  function finish(id, text, lang, context='archive', now=Date.now()) {
    const set=recordSet(),o=read('offer:'+id);
    if(!o || o.skipped || !String(text).trim() || !['et-EE','en-GB'].includes(lang))return null;
    if(set.completed.has(id))return set.completed.get(id);
    const answer={id:root.crypto.randomUUID(),offerId:o.id,module:o.module,group:o.group,groupTitle:o.groupTitle,
      sessionId:o.sessionId,stage:o.stage,concept:o.concept,prompt:o.prompt,lang,sourceLang:o.lang,at:now,
      entryFresh:baselineFresh(o,set,context),context,text:String(text).trim().slice(0,3200)};
    write('answer:'+answer.id,answer);
    temporaryDrafts.delete(id);
    try { remove('draft:'+id); } catch {}
    return answer;
  }
  function prior(answer, answers) {
    return answers.filter(a=>a.entryFresh===true && a.stage==='entry' && a.module===answer.module &&
      a.group===answer.group && a.lang===answer.lang && a.at<answer.at && a.offerId!==answer.offerId)
      .sort((a,b)=>a.at-b.at)[0] || null;
  }
  function practiceLink(o) {
    if(!Object.prototype.hasOwnProperty.call(keys,o.module)||!/^[-_a-z0-9]{1,80}$/i.test(o.concept))return null;
    return './'+o.module+'.html?practice='+encodeURIComponent(o.concept)+'#learn';
  }
  const el=(tag,text,cls)=>{
    const n=root.document.createElement(tag); if(text)n.textContent=text; if(cls)n.className=cls; return n;
  };
  function button(text,fn) {const b=el('button',text,'backup-secondary');b.type='button';b.addEventListener('click',fn);return b;}
  function dated(a){
    const stage=a.stage==='entry'&&!a.entryFresh?'Tagasivaatav mõte':stages[a.stage];
    const context=a.context==='archive'?' · hiljem avatud':a.context==='lesson' && a.stage!=='entry'?' · pärast harjutuse tagasisidet':'';
    return stage+' · '+day(a.at)+context;
  }
  function copyShare(box,text) {
    const status=el('p');status.setAttribute('role','status');
    const actions=el('div',null,'thought-actions');
    const manual=el('textarea');manual.hidden=true;manual.readOnly=true;manual.setAttribute('aria-label','Vali jagatav tekst');
    actions.append(button('Kopeeri selgitus',async()=>{
      try { await root.navigator.clipboard.writeText(text);status.textContent='Tekst on kopeeritud. Võid selle ise õpetajale saata.'; }
      catch { manual.value=text; manual.hidden=false;manual.focus();manual.select();status.textContent='Kopeeri valitud tekst.'; }
    }));
    if(root.navigator.share)actions.append(button('Jaga selgitust…',async()=>{
      try { await root.navigator.share({text}); }
      catch(e){if(e.name!=='AbortError')status.textContent='Jagamine ei õnnestunud. Võid teksti kopeerida.';}
    }));
    box.append(actions,manual,status);
  }
  function showSaved(box,a,all) {
    const earlier=prior(a,all);
    const later=a.stage!=='entry';
    const items=later&&earlier?[earlier,a]:[a];
    if(later&&!earlier)box.append(el('p','Selles õpisuunas pole sama teema varasemat algvastust selles keeles. Siin on sinu hilisem mõte.'));
    if(a.stage==='entry'&&!a.entryFresh)box.append(el('p','See mõte pandi kirja hiljem või ei saanud selle varasemat ajastust kinnitada.'));
    for(const item of items) {
      box.append(el('strong',dated(item)),el('p',item.prompt));
      const prose=el('p',item.text);prose.style.whiteSpace='pre-wrap';box.append(prose);
    }
    const text=a.groupTitle+'\n\n'+items.map(item=>dated(item)+'\n'+item.prompt+'\n'+item.text).join('\n\n');
    copyShare(box,text);
    if(later)box.append(el('p','Mõtle korraks: kas oskaksid sama ideed kasutada teises näites?'));
    const href=practiceLink(a);if(href){const link=el('a','Soovin seda veel harjutada','backup-secondary');link.href=href;box.append(link);}
    const bank=a.module==='imat'?root.IMAT_CONTENT:root.BASICS_CONTENT;
    const related=(bank?.concepts||[]).filter(c=>c.id!==a.concept && root.StudyTeachback?.groupFor(a.module,c.id)===a.group);
    if(related.length){
      const picker=el('details'),list=el('ul');
      picker.append(el('summary','Mida tahaksid veel harjutada?'),el('p','Ava soovi korral üks sama teema harjutus.'));
      for(const concept of related){
        const href=practiceLink({module:a.module,concept:concept.id});
        if(!href)continue;
        const item=el('li'),link=el('a',concept.title);link.href=href;item.append(link);list.append(item);
      }
      picker.append(list);box.append(picker);
    }
  }
  const pending=set=>set.offers.filter(o=>!o.skipped&&!set.completed.has(o.id)).sort((a,b)=>b.at-a.at);
  function renderEditor(host, offer, context) {
    const id=offer.id, key='draft:'+id;
    let draft=temporaryDrafts.get(id);
    if(!draft){try{draft=read(key);}catch{}}
    const box=el('div');box.className='teachback-editor';
    box.append(el('p',offer.prompt));
    const area=el('textarea');area.id='teachback-text-'+context+'-'+encodeURIComponent(id);area.rows=3;area.maxLength=3200;
    area.value=draft?.text||'';
    const label=el('label','Minu selgitus');label.htmlFor=area.id;
    const picker=el('select'),pickLabel=el('label','Kõne keel ');
    for(const [value,title] of [['et-EE','Eesti'],['en-GB','English']]){
      const opt=el('option',title);opt.value=value;picker.append(opt);
    }
    picker.value=draft?.lang||offer.lang;
    pickLabel.append(picker);
    const mic=el('study-dictation');mic.dataset.target=area.id;mic.dataset.session=id;mic.lang=picker.value;
    const status=el('p');status.setAttribute('role','status');
    const save=button('Salvesta minu selgitus',()=>{
      if(mic.active){status.textContent='Lõpeta dikteerimine ja vaata tekst üle.';return;}
      try{
        const answer=finish(id,area.value,picker.value,context);
        if(!answer){status.textContent='Kirjuta või dikteeri enne oma mõte.';return;}
        openEditors.delete(id);
        // Replace the editor only after its dated snapshot has been persisted.
        const confirmation=el('div');confirmation.append(el('h3','Sinu selgitus on salvestatud'));
        showSaved(confirmation,answer,recordSet().answers);
        host.replaceChildren(confirmation);
        notify(answer.id);
      }catch{status.textContent='Salvestamine ei õnnestunud. Tekst on siin alles. Kopeeri see enne lehe sulgemist.';}
    });
    function updateDraft() {
      const draft={text:area.value,lang:picker.value};
      save.disabled=!area.value.trim();
      temporaryDrafts.set(id,draft);
      try {write(key,draft);temporaryDrafts.delete(id);status.textContent='Mustand on selles brauseris alles.';}
      catch {status.textContent='Mustand on ainult avatud lehel. Kopeeri see enne lahkumist.';}
    }
    save.disabled=!area.value.trim();
    area.addEventListener('input',updateDraft);picker.addEventListener('change',()=>{mic.lang=picker.value;updateDraft();});
    box.append(label,area,pickLabel,mic,el('small','Selgitus jääb sellesse brauserisse. Õpetaja saab seda lugeda, kui jagad seda ise.'),save,status);
    host.append(box);
  }
  function install() {
    if(!root.customElements || root.customElements.get('study-teachback'))return;
    class Offer extends root.HTMLElement {
      connectedCallback() {
        let id;
        try{id=decodeURIComponent(this.dataset.offer||'');}catch{return;}
        if(!id)return;
        try {
          const existing=read('offer:'+id),o=existing||offeredHere.get(id);
          if(!o||o.skipped)return;
          if(!existing)write('offer:'+id,o);
          this.show(o);
        }catch{this.replaceChildren(el('small','Mõttekäiku ei saa praegu salvestada. Võid endamisi vastata ja õppimist jätkata.'));}
      }
      show(o) {
        const context=this.dataset.context==='archive'?'archive':'lesson';
        const set=recordSet(),answer=set.completed.get(o.id);
        if(answer){this.replaceChildren();showSaved(this,answer,set.answers);return;}
        const details=el('details'),summary=el('summary',(o.stage==='entry'?'Kuidas see sinu arvates töötab?':o.stage==='repair'?'Kas selgitad oma sõnadega, kuidas see töötab?':'Kuidas sa seda täna sõbrale selgitaksid?')+' · soovi korral');
        details.append(summary);
        details.open=openEditors.has(o.id) || this.hasAttribute('data-open');
        details.addEventListener('toggle',()=>{if(details.isConnected){if(details.open)openEditors.add(o.id);else openEditors.delete(o.id);}});
        const intro=o.stage==='entry' ? (context==='archive'?'Kirjuta, mida sa praegu arvad. Hiljem antud vastus jääb kirja tänase mõttena.':'Võid öelda ka, mis on veel ebaselge.') : o.stage==='repair' ? 'Sõnasta üks seos oma sõnadega. Soovi korral kasuta ühte näidet.' : 'Proovi oma näitega selgitada. Kui soovid proovida, mis sulle hiljem meenub, võid selle jätta järgmiseks korraks. Pärast salvestamist saad seda võrrelda oma esimese selgitusega, kui see on olemas.';
        details.append(el('p',intro));
        renderEditor(details,o,context);
        const later=button('Jätan hilisemaks',()=>{
          try{write('offer:'+o.id,{...o,deferred:true});openEditors.delete(o.id);this.replaceChildren(el('p','Kui soovid jätkata, leiad selle „Minu töö” alt.'));notify();}
          catch{later.textContent='Muutust ei saanud salvestada';}
        });
        const skip=button('Jätan selle vahele',()=>{
          try{
            const draft=temporaryDrafts.get(o.id)||read('draft:'+o.id);
            if(draft?.text && !root.confirm('Jätan selle selgituse vahele ja kustutan selle mustandi?'))return;
            write('offer:'+o.id,{...o,skipped:true});remove('draft:'+o.id);temporaryDrafts.delete(o.id);
            openEditors.delete(o.id);this.replaceChildren(el('p','Võid õppimist jätkata.'));notify();
          }
          catch{skip.textContent='Muutust ei saanud salvestada';}
        });
        details.append(later,skip);
        this.replaceChildren(details);
      }
    }
    class Home extends root.HTMLElement {
      connectedCallback(){
        this.refresh=()=>this.show();
        this.fromHistory=()=>{try{seedRepair();}catch{}this.show();};
        root.addEventListener('teachback-changed',this.refresh);
        root.addEventListener('backup-ready',this.fromHistory);
        root.addEventListener('backup-changed',this.fromHistory);
        this.fromHistory();
      }
      disconnectedCallback(){
        root.removeEventListener('teachback-changed',this.refresh);
        root.removeEventListener('backup-ready',this.fromHistory);
        root.removeEventListener('backup-changed',this.fromHistory);
      }
      show(){this.replaceChildren();try{const first=pending(recordSet())[0];if(!first)return;
        const link=el('a',(first.fromHistory?'Soovi korral selgita oma sõnadega · ':'Jätkan soovi korral selgitust · ')+first.groupTitle,'backup-secondary');
        link.href='./progress.html?teachback='+encodeURIComponent(first.id)+'#minu-selgitused';this.append(link);
      }catch{}}
    }
    class Library extends root.HTMLElement {
      connectedCallback(){
        this.refresh=e=>{this.justSaved=e.detail?.answerId;this.userActed=true;this.show();};
        root.addEventListener('teachback-changed',this.refresh);
        this.show();
      }
      disconnectedCallback(){root.removeEventListener('teachback-changed',this.refresh);}
      show(){
        try {
          const set=recordSet(),queue=pending(set),box=el('div');
          if(!queue.length&&!set.answers.length){this.replaceChildren(el('p','Siia ilmuvad soovi korral salvestatud selgitused ning pooleli jäetud mõtted.'));return;}
          const wanted=new URLSearchParams(root.location.search).get('teachback');
          for(const o of queue){
            const section=el('section');section.append(el('h3',o.groupTitle));
            const offer=el('study-teachback');offer.dataset.offer=encodeURIComponent(o.id);offer.dataset.context='archive';
            if(!this.userActed && wanted===o.id)offer.setAttribute('data-open','');
            section.append(offer);box.append(section);
          }
          const visible=[...set.answers].sort((a,b)=>b.at-a.at);
          for(const a of visible){
            // Keep prior reasoning out of view while a later answer in that
            // route is pending. The learner can finish or skip the prompt.
            if(queue.some(o=>o.group===a.group&&o.module===a.module&&o.stage!=='entry'&&o.at>=a.at))continue;
            const row=el('details');row.open=a.id===this.justSaved;row.append(el('summary',a.groupTitle+' · '+dated(a)));
            const body=el('div');row.append(body);showSaved(body,a,set.answers);
            body.append(button('Kustuta see selgitus',()=>{
              if(!root.confirm('Kustutan selle selgituse sellest brauserist?'))return;
              try{
                const o=read('offer:'+a.offerId);
                if(o)write('offer:'+o.id,{...o,skipped:true});
                remove('answer:'+a.id);remove('draft:'+a.offerId);temporaryDrafts.delete(a.offerId);
                notify();
              }catch{body.append(el('p','Kustutamine ei õnnestunud. Proovi uuesti.'));}
            }));
            box.append(row);
          }
          this.replaceChildren(box);
        }catch{this.replaceChildren(el('p','Selles brauseris salvestatud selgitusi ei saanud avada.'));}
      }
    }
    root.customElements.define('study-teachback',Offer);
    root.customElements.define('study-teachback-home',Home);
    root.customElements.define('study-teachback-library',Library);
  }
  return {install,slot,recordSet,history,finish,prior,practiceLink,seedRepair};
});
