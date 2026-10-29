'use strict';
(function(root){
 const KEY='hendrik-imat-bio-v1',DAY=86400000,HOUR=3600000;
 const ERRORS=['Ei teadnud','Lugesin valesti','Arvutasin valesti','Pakkusin'];
 const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const num=(x,max=Number.MAX_SAFE_INTEGER)=>Number.isFinite(x)&&x>=0&&x<=max;
 const fresh=()=>({version:1,serial:0,sessions:[],cards:{},activeId:null});
 const card=()=>({attempts:0,successes:0,failures:0,due:0,lastAt:0,lastExposure:0,interval:0,highPending:false,highAt:0,correctedAt:0,rememberedAt:0,recalls:0});
 function restore(value,bank){
   if(!obj(value)||value.version!==1||!Array.isArray(value.sessions)||!obj(value.cards)||!num(value.serial))throw Error('IMAT salvestuse vorming ei sobi.');
   const s=fresh(),ids=new Set(bank.concepts.map(c=>c.id)),seen=new Set();s.serial=value.serial;
   for(const [id,v] of Object.entries(value.cards)){
     if(!ids.has(id))continue;
     if(!obj(v))throw Error('IMAT mõisteandmed on vigased.');
     const c=card();for(const k of Object.keys(c)){if(k==='highPending'){if(typeof v[k]!=='boolean')throw Error('IMAT kordusandmed on vigased.');c[k]=v[k];}else{if(k==='recalls'&&v[k]===undefined){c[k]=0;continue;}if(!num(v[k]))throw Error('IMAT kordusandmed on vigased.');c[k]=v[k];}}s.cards[id]=c;
   }
   for(const v of value.sessions){
     if(!obj(v)||typeof v.id!=='string'||seen.has(v.id)||!ids.has(v.concept)||!['basic','application'].includes(v.level)||!['lesson','question','feedback','retry','done'].includes(v.stage)||!num(v.startedAt)||!Array.isArray(v.retryAnswers)||!Array.isArray(v.retryErrors))throw Error('Poolelioleva IMAT ploki andmed on vigased.');
     const c=bank.concepts.find(c=>c.id===v.concept);
     for(const k of ['questionIndex','retryIndex'])if(v[k]!==undefined&&(!Number.isInteger(v[k])||!c.questions[v[k]]))throw Error('Invalid question reference');
     if(v.targetedPractice!==undefined&&typeof v.targetedPractice!=='boolean')throw Error('Invalid targeted flag');
     const q=question(bank,v);
     const choice=x=>x===null||Number.isInteger(x)&&x>=0&&x<5;
     if(!choice(v.selected)||!choice(v.retrySelected)||![null,'sure','unsure'].includes(v.confidence)||![null,...ERRORS].includes(v.error)||!num(v.answeredAt)||!num(v.completedAt)||!v.retryAnswers.every(x=>Number.isInteger(x)&&x>=0&&x<5)||v.retryErrors.length!==v.retryAnswers.length||!v.retryErrors.every(x=>x===null||ERRORS.includes(x)))throw Error('IMAT vastus on vigane.');
     for(const k of ['paraphrased','retryParaphrased','assisted','scaffold','englishHelp','moreChosen','review','closed','retrySubmitted'])if(typeof v[k]!=='boolean')throw Error('IMAT olek on vigane.');
     if(['feedback','retry','done'].includes(v.stage)&&(v.selected===null||!v.confidence||!v.answeredAt))throw Error('IMAT vastus puudub.');
     if(v.stage==='done'&&(!v.completedAt||v.retryAnswers.length===0||(!v.targetedPractice&&v.retryAnswers.at(-1)!==retryQuestion(bank,v).answer)))throw Error('IMAT lõpetamine on vigane.');
     if(v.answeredAt&&!s.cards[v.concept])throw Error('IMAT korduskaart puudub.');
     const clean={};for(const k of ['id','concept','level','stage','startedAt','selected','confidence','paraphrased','retryParaphrased','retrySelected','error','answeredAt','completedAt','assisted','scaffold','englishHelp','moreChosen','review','closed','retrySubmitted'])clean[k]=v[k];
     for(const k of ['questionIndex','retryIndex','targetedPractice'])if(v[k]!==undefined)clean[k]=v[k];
     if(v.targetedPractice&&v.completedAt)clean.checkCorrect=v.retryAnswers.at(-1)===retryQuestion(bank,v).answer;
     clean.delayedProbe=typeof v.delayedProbe==='boolean'?v.delayedProbe:null;clean.retryAnswers=[...v.retryAnswers];clean.retryErrors=[...v.retryErrors];clean.correct=clean.answeredAt?clean.selected===q.answer:null;s.sessions.push(clean);seen.add(v.id);
   }
   s.activeId=seen.has(value.activeId)?value.activeId:null;return s;
 }
 function active(s){return s.sessions.find(v=>v.id===s.activeId)||null;}
 const question=(bank,a)=>{const c=bank.concepts.find(c=>c.id===a.concept);return a.questionIndex===undefined?c.questions.find(q=>q.level===a.level):c.questions[a.questionIndex];};
 const retryQuestion=(bank,a)=>bank.concepts.find(c=>c.id===a.concept).questions[a.retryIndex??2];
 function leastRecent(s,c,pool,exclude=null){const used=new Map();for(const a of s.sessions.filter(a=>a.concept===c.id)){if(a.answeredAt)used.set(a.questionIndex??(a.level==='application'?1:0),Math.max(used.get(a.questionIndex??(a.level==='application'?1:0))||0,a.answeredAt));if(a.completedAt)used.set(a.retryIndex??2,Math.max(used.get(a.retryIndex??2)||0,a.completedAt));}return pool.filter(i=>i!==exclude).sort((a,b)=>(used.get(a)||0)-(used.get(b)||0))[0];}
 function recommend(s,bank,now=Date.now()){
   const last=[...s.sessions].filter(a=>a.completedAt).sort((a,b)=>b.completedAt-a.completedAt)[0];
   const available=c=>c.targeted?(!bank.concepts.find(x=>x.id===last?.concept)?.targeted&&!(s.cards[c.id]?.lastExposure>now-DAY)):!c.questionFirst||!(s.cards[c.id]?.lastExposure>now-DAY);
   const due=bank.concepts.filter(c=>s.cards[c.id]&&s.cards[c.id].due<=now&&available(c)).sort((a,b)=>s.cards[a.id].due-s.cards[b.id].due);
   const focus=due.find(c=>c.targeted&&(s.cards[c.id].failures>0||s.cards[c.id].highPending));
   const unseen=bank.concepts.find(c=>!s.cards[c.id]&&available(c));
   // A completed review must not let the due backlog consume every short block.
   if(last?.review&&unseen)return unseen;
   return focus||due[0]||unseen||null;
 }
 function start(s,bank,now=Date.now(),preferred=null,allowPractice=false){
   const old=active(s);if(old&&!old.closed){if(old.stage!=='done'||now-old.completedAt<12*HOUR)return old;old.closed=true;s.activeId=null;}
   const concept=bank.concepts.find(c=>c.id===preferred)||recommend(s,bank,now)||(allowPractice?bank.concepts.filter(c=>s.cards[c.id]&&!c.targeted).sort((a,b)=>s.cards[a.id].lastExposure-s.cards[b.id].lastExposure)[0]:null);if(!concept)return null;const c=s.cards[concept.id],review=!!c,scaffold=!!c&&c.failures>=2;
   const session={id:'i'+(++s.serial)+'-'+(root.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)),concept:concept.id,level:c?.recalls>=2?'application':'basic',stage:review&&!scaffold?'question':'lesson',startedAt:now,selected:null,confidence:null,paraphrased:false,retryParaphrased:false,retrySelected:null,error:null,answeredAt:0,completedAt:0,correct:null,delayedProbe:null,retryAnswers:[],retryErrors:[],retrySubmitted:false,assisted:!review||scaffold,scaffold,englishHelp:false,moreChosen:false,review,closed:false};
   if(concept.targeted||concept.questionFirst){session.targetedPractice=true;session.stage='question';session.assisted=false;session.scaffold=false;session.questionIndex=leastRecent(s,concept,concept.probeQuestions);session.retryIndex=concept.supportQuestions[0];}
   s.sessions.push(session);s.activeId=session.id;return session;
 }
 function expose(s,now=Date.now()){const a=active(s);if(!a)return;a.assisted=true;const c=s.cards[a.concept];if(c)c.lastExposure=now;}
 function submit(s,bank,now=Date.now()){
   const a=active(s);if(!a||a.stage!=='question'||a.selected===null||!a.confidence)return false;
   const concept=bank.concepts.find(c=>c.id===a.concept),q=question(bank,a),c=s.cards[a.concept]||card();
   const delayed=c.attempts>0&&a.startedAt-c.lastExposure>=DAY&&!a.assisted;
   const eligible=delayed&&a.startedAt>=c.due,previousDue=c.due;
   a.delayedProbe=eligible;a.correct=a.selected===q.answer;a.answeredAt=now;if(a.targetedPractice)a.retryIndex=leastRecent(s,concept,a.correct&&a.confidence==='sure'?concept.transferQuestions:concept.supportQuestions,a.questionIndex);a.stage='feedback';c.attempts++;
   if(a.correct){
     c.failures=0;c.successes=a.confidence==='sure'?c.successes+1:0;
     if(a.confidence==='sure'){if(eligible)c.recalls++;c.interval=eligible?Math.min(60*DAY,Math.max(DAY,c.interval*2)):Math.max(DAY,c.interval);}else{c.recalls=0;c.interval=4*HOUR;}
     if(a.assisted){c.recalls=0;c.interval=Math.min(c.interval,DAY);}
     if(delayed){c.rememberedAt=now;if(c.highPending&&a.confidence==='sure'&&now-c.highAt>=DAY){c.highPending=false;c.correctedAt=now;}}
   }else{
     c.failures++;c.successes=0;c.recalls=0;c.interval=HOUR/6;
     if(a.confidence==='sure'){c.highPending=true;c.highAt=now;c.correctedAt=0;}
     c.rememberedAt=0;
   }
   c.due=a.correct&&previousDue>now?Math.min(previousDue,now+c.interval):now+c.interval;c.lastAt=now;c.lastExposure=now;s.cards[a.concept]=c;return true;
 }
 function classify(s,label){const a=active(s);if(a?.answeredAt&&a.correct===false&&ERRORS.includes(label))a.error=label;}
 function beginRetry(s){const a=active(s);if(a?.stage==='feedback')a.stage='retry';}
 function retry(s,bank,now=Date.now()){
   const a=active(s);if(!a||a.stage!=='retry'||a.retrySelected===null||a.retrySubmitted)return false;
   const c=bank.concepts.find(c=>c.id===a.concept);a.retryAnswers.push(a.retrySelected);a.retryErrors.push(null);a.retrySubmitted=true;s.cards[a.concept].lastExposure=now;
   if(a.targetedPractice)a.checkCorrect=a.retrySelected===retryQuestion(bank,a).answer;
   if(a.retrySelected===retryQuestion(bank,a).answer){a.stage='done';a.completedAt=now;}else{a.scaffold=true;const schedule=s.cards[a.concept];schedule.interval=HOUR/6;schedule.due=now+schedule.interval;schedule.recalls=0;schedule.successes=0;schedule.rememberedAt=0;if(schedule.correctedAt===a.answeredAt){schedule.correctedAt=0;schedule.highPending=true;}if(a.retryAnswers.length===1)schedule.failures++;}
   if(a.targetedPractice){a.stage='done';a.completedAt=now;}
   return true;
 }
 function retryAgain(s){const a=active(s);if(a?.stage==='retry'){a.retrySelected=null;a.retryParaphrased=false;a.retrySubmitted=false;}}
 function classifyRetry(s,label){const a=active(s);if(a?.stage==='retry'&&a.retrySubmitted&&ERRORS.includes(label))a.retryErrors[a.retryErrors.length-1]=label;}
 function stop(s){const a=active(s);if(a)a.closed=true;s.activeId=null;}
 function more(s,bank,now=Date.now()){const a=active(s);if(!a||a.stage!=='done')return null;a.moreChosen=true;a.closed=true;s.activeId=null;return start(s,bank,now,null,true);}
 function progress(s,bank){return {starts:s.sessions.length,completions:s.sessions.filter(a=>a.completedAt).length,more:s.sessions.filter(a=>a.moreChosen).length,reading:s.sessions.filter(a=>a.error==='Lugesin valesti').length+s.sessions.reduce((n,a)=>n+a.retryErrors.filter(x=>x==='Lugesin valesti').length,0),remembered:Object.values(s.cards).filter(c=>c.rememberedAt).length,corrected:Object.values(s.cards).filter(c=>c.correctedAt&&!c.highPending).length,areas:bank.areas.map(area=>({...area,encountered:new Set(s.sessions.filter(a=>bank.concepts.find(c=>c.id===a.concept)?.area===area.id).map(a=>a.concept)).size,total:bank.concepts.filter(c=>c.area===area.id).length}))};}
 const api={KEY,DAY,HOUR,ERRORS,fresh,restore,active,start,expose,submit,classify,beginRetry,retry,retryAgain,classifyRetry,stop,more,progress,recommend,question,retryQuestion};root.ImatEngine=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
