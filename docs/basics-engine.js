'use strict';
(function(root){
 const KEY='hendrik-bio-basics-v1',DAY=86400000,HOUR=3600000;
 const fresh=()=>({version:1,serial:0,sessions:[],cards:{},activeId:null});
 const active=s=>s.sessions.find(a=>a.id===s.activeId)||null;
 const concept=(bank,id)=>bank.concepts.find(c=>c.id===id);
 // Persist the chosen question: expanding the bank must not change old answers.
 const question=(bank,a)=>concept(bank,a.concept).questions[a.questionIndex??(a.level==='application'?2:0)];
 const checkQuestion=(bank,a)=>concept(bank,a.concept).questions[a.checkIndex??1];
 const emptyCard=()=>({attempts:0,failures:0,recalls:0,rememberedAt:0,lastAt:0,lastExposure:0,due:0,interval:0,needsHelp:false});
 const completed=s=>[...s.sessions].reverse().filter(a=>a.completedAt).sort((a,b)=>b.completedAt-a.completedAt);
 const family=(bank,id)=>(bank.geneticsPath||[]).includes(id)?'genetics':concept(bank,id)?.unit;
 function nextNew(s,bank,avoid=null){
   const ready=bank.concepts.filter(c=>c.id!==avoid&&!s.cards[c.id]&&c.requires.every(id=>s.cards[id]&&!s.cards[id].needsHelp));
   const recent=completed(s).slice(0,2);
   // A long genetics path must not become the whole experience. Keep every
   // prerequisite, but offer a ready different family after two genetics blocks.
   const different=avoid?family(bank,avoid):recent.length===2&&recent.every(a=>family(bank,a.concept)==='genetics')?'genetics':null;
   return (different&&ready.find(c=>family(bank,c.id)!==different))||ready[0]||null;
 }
 function wasReview(s,a){
   if(a.firstLesson||a.initialProbe)return false;
   return s.sessions.some(p=>p.id!==a.id&&p.concept===a.concept&&(p.answeredAt||p.completedAt)&&(p.startedAt<a.startedAt||p.startedAt===a.startedAt&&s.sessions.indexOf(p)<s.sessions.indexOf(a)));
 }
 function recommend(s,bank,now=Date.now()){
   const fresh=nextNew(s,bank),recent=completed(s),last=recent[0];
   const available=c=>!c.targeted||(!concept(bank,last?.concept)?.targeted&&!(s.cards[c.id]?.lastExposure>now-DAY));
   const focus=bank.concepts.filter(c=>c.targeted&&available(c)&&s.cards[c.id]?.needsHelp&&s.cards[c.id].due<=now).sort((a,b)=>s.cards[a.id].lastExposure-s.cards[b.id].lastExposure)[0];
   if(focus)return focus;
   // One completed review at most before a ready new idea, across visits too.
   // Reviews stay due; choosing variety never awards mastery or erases a gap.
   if(fresh&&available(fresh)&&last&&(wasReview(s,last)||(recent.length>=2&&recent.slice(0,2).every(a=>family(bank,a.concept)==='genetics'))))return fresh;
   const due=bank.concepts.filter(c=>s.cards[c.id]?.due<=now&&available(c)).sort((a,b)=>s.cards[a.id].due-s.cards[b.id].due);
   if(due.length)return due[0];
   // A gap blocks only dependent concepts, never unrelated biology.
   return fresh&&available(fresh)?fresh:bank.concepts.find(c=>!s.cards[c.id]&&available(c)&&c.requires.every(id=>s.cards[id]&&!s.cards[id].needsHelp))||null;
 }
 function leastRecent(s,id,pool,exclude=null){
   const used=new Map();for(const a of s.sessions.filter(a=>a.concept===id)){
     if(a.answeredAt)used.set(a.questionIndex??(a.level==='application'?2:0),Math.max(used.get(a.questionIndex??(a.level==='application'?2:0))||0,a.answeredAt));
     if(a.completedAt)used.set(a.checkIndex??1,Math.max(used.get(a.checkIndex??1)||0,a.completedAt));
   }
   return [...new Set(pool)].filter(i=>i!==exclude).sort((a,b)=>(used.get(a)||0)-(used.get(b)||0))[0];
 }
 function start(s,bank,now=Date.now(),allowPractice=false,preferred=null){
   const old=active(s);if(old&&!old.closed){if(old.stage!=='done'||now-old.completedAt<12*HOUR)return old;old.closed=true;s.activeId=null;}
   const scheduled=recommend(s,bank,now);
   // A review date is a reminder, never a daily study limit. Extra practice
   // revisits a weak foundation first and cannot earn delayed-recall credit.
   const last=completed(s)[0];
   const practice=allowPractice?bank.concepts.filter(c=>s.cards[c.id]&&!c.targeted).sort((a,b)=>Number(a.id===last?.concept)-Number(b.id===last?.concept)||s.cards[a.id].lastExposure-s.cards[b.id].lastExposure)[0]:null;
   const c=preferred||scheduled||practice;if(!c)return null;
   const card=s.cards[c.id],firstLesson=!!bank.teachFirst&&!card,level=card?.recalls>=2?'application':'basic';
   const pool=c.targeted?c.probeQuestions:level==='application'?[...(c.applicationQuestions||[2]),...(c.reviewQuestions||[0])]:c.reviewQuestions||[0];
   const questionIndex=leastRecent(s,c.id,pool);
   const a={id:'b'+(++s.serial)+'-'+(root.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)),concept:c.id,level,stage:firstLesson?'lesson':'question',startedAt:now,selected:null,confidence:null,correct:null,delayedProbe:null,answeredAt:0,assisted:firstLesson,unknown:false,checkSelected:null,checkCorrect:null,completedAt:0,closed:false,moreChosen:false,firstLesson,questionIndex,checkIndex:1,taughtAt:firstLesson?now:0};
   if(c.targeted)a.targetedPractice=true;
   if(!firstLesson&&bank.questionFirst===true){a.questionFirst=true;a.initialProbe=!card;}
   if(card&&card.due>now)a.extraPractice=true;
   s.sessions.push(a);s.activeId=a.id;return a;
 }
 function submit(s,bank,now=Date.now(),unknown=false){
   const a=active(s);if(!a||a.stage!=='question'||(!unknown&&(a.selected===null||!['sure','unsure'].includes(a.confidence))))return false;
   a.unknown=unknown;a.correct=!unknown&&a.selected===question(bank,a).answer;a.answeredAt=now;a.stage='explanation';a.assisted=!a.correct||a.confidence!=='sure';
   if(a.questionFirst){const item=concept(bank,a.concept);a.checkIndex=a.correct&&a.confidence==='sure'?leastRecent(s,a.concept,[...(item.followupQuestions||item.applicationQuestions||[2]),...(item.applicationQuestions||[2]),4,3].filter(i=>item.questions[i]),a.questionIndex)??1:1;}
   const item=concept(bank,a.concept);if(a.targetedPractice)a.checkIndex=leastRecent(s,a.concept,a.correct&&a.confidence==='sure'?item.transferQuestions:item.supportQuestions,a.questionIndex);
   const c=s.cards[a.concept]||emptyCard(),eligible=!a.extraPractice&&c.lastExposure>0&&a.startedAt-c.lastExposure>=DAY&&a.startedAt>=c.due;
   a.delayedProbe=eligible;
   const prevDue=c.due;c.attempts++;c.lastAt=now;c.lastExposure=now;
   if(!a.correct){c.failures++;c.recalls=0;c.rememberedAt=0;c.needsHelp=true;c.interval=HOUR/6;}
   else if(a.confidence!=='sure'){c.failures=0;c.recalls=0;c.rememberedAt=0;c.needsHelp=true;c.interval=4*HOUR;}
   else{c.failures=0;c.needsHelp=false;if(eligible){c.recalls++;c.rememberedAt=now;}c.interval=eligible?Math.min(30*DAY,Math.max(DAY,c.interval*2)):Math.max(DAY,c.interval);}
   c.due=a.correct&&prevDue>now?Math.min(prevDue,now+c.interval):now+c.interval;s.cards[a.concept]=c;return true;
 }
 function beginCheck(s){const a=active(s);if(a?.stage==='explanation'||a?.stage==='lesson')a.stage='check';}
 function check(s,bank,now=Date.now()){
   const a=active(s);if(!a||a.stage!=='check'||a.checkSelected===null)return false;
   a.checkCorrect=a.checkSelected===checkQuestion(bank,a).answer;a.stage='done';a.completedAt=now;
   const c=s.cards[a.concept]||emptyCard();s.cards[a.concept]=c;
   // Learning after an explanation creates a review schedule, never an
   // independent-answer score or a delayed-recall credit.
   if(a.firstLesson){c.lastAt=now;c.interval=a.checkCorrect?DAY:HOUR/6;c.due=now+c.interval;c.needsHelp=!a.checkCorrect;}
   // A new-topic prequestion is allowed to reveal unfamiliarity. A correct
   // teaching check opens the next introduction but keeps the early review due;
   // it does not earn independent recall or erase the recorded initial gap.
   if(a.initialProbe&&a.checkCorrect)c.needsHelp=false;
   c.lastExposure=now;if(a.checkCorrect&&c.interval>=DAY&&!a.extraPractice)c.due=Math.max(c.due,now+DAY);
   if(!a.checkCorrect){c.needsHelp=true;c.recalls=0;c.rememberedAt=0;c.failures++;c.interval=HOUR/6;c.due=now+c.interval;}
   // A correct immediate check is learning, not delayed mastery. A gap remains due soon.
   return true;
 }
 function stop(s){const a=active(s);if(a)a.closed=true;s.activeId=null;}
 function more(s,bank,now=Date.now()){const a=active(s);if(a?.stage!=='done')return null;a.moreChosen=true;stop(s);return start(s,bank,now,true);}
 function topicStart(s,bank,id,now=Date.now()){
   const desired=concept(bank,id);if(!desired)return null;
   // Route a chosen topic to its first missing prerequisite, without a global gate.
   const ready=c=>{const missing=c.requires.find(k=>!s.cards[k]||s.cards[k].needsHelp);return missing?ready(concept(bank,missing)):c;};
   const c=ready(desired),old=active(s);if(old?.stage==='done')old.moreChosen=true;
   stop(s);return start(s,bank,now,true,c);
 }
 function newTopic(s,bank,now=Date.now()){
   const old=active(s),c=nextNew(s,bank,old?.concept||completed(s)[0]?.concept);if(!c)return null;
   if(old?.stage==='done')old.moreChosen=true;stop(s);return start(s,bank,now,true,c);
 }
 function supportChoices(s,bank,a){
   const c=concept(bank,a.concept);
   return c.supports||[...(c.requires.length?c.requires:[c.id])].sort((x,y)=>Number(!!s.cards[y]?.needsHelp)-Number(!!s.cards[x]?.needsHelp)).map(id=>'concept:'+id);
 }
 function supportDefinition(bank,id){
   if(bank.supports?.[id])return bank.supports[id];
   const c=id?.startsWith('concept:')&&concept(bank,id.slice(8));if(!c)return null;
   return {title:c.title,concept:c.id,question:c.questions[0],explanation:c.lesson,example:c.example||c.anchor,source:c.source};
 }
 function beginSupport(s,bank,id,now=Date.now()){
   const a=active(s);if(!a||a.stage!=='done'||a.support||!s.cards[a.concept]?.needsHelp||!supportChoices(s,bank,a).includes(id))return false;
   a.support={id,selected:null,correct:null,startedAt:now,answeredAt:0};return true;
 }
 function answerSupport(s,bank,now=Date.now(),unknown=false){
   const a=active(s),p=a?.support,q=p&&supportDefinition(bank,p.id);if(!q||p.answeredAt||(!unknown&&p.selected===null))return false;
   if(unknown)p.selected=null;
   p.correct=!unknown&&p.selected===q.question.answer;p.answeredAt=now;
   // Seeing a prerequisite answer is exposure, not independent recall or mastery.
   const c=s.cards[q.concept];if(c){c.lastExposure=Math.max(c.lastExposure,now);if(!p.correct){c.needsHelp=true;c.recalls=0;c.rememberedAt=0;c.interval=HOUR/6;c.due=Math.min(c.due,now+HOUR/6);}}
   return true;
 }
 function restore(v,bank){
   const obj=x=>x&&typeof x==='object'&&!Array.isArray(x),num=x=>Number.isSafeInteger(x)&&x>=0,choice=x=>x===null||Number.isInteger(x)&&x>=0&&x<3;
   if(!obj(v)||v.version!==1||!num(v.serial)||!obj(v.cards)||!Array.isArray(v.sessions))throw Error('Invalid basics history');
   const s=fresh(),ids=new Set();s.serial=v.serial;
   for(const [id,c]of Object.entries(v.cards)){if(!concept(bank,id))continue;if(!obj(c)||typeof c.needsHelp!=='boolean')throw Error('Invalid card');const out=emptyCard();for(const k of Object.keys(out)){if(k!=='needsHelp'&&!num(c[k]))throw Error('Invalid schedule');out[k]=c[k];}s.cards[id]=out;}
   for(const a of v.sessions){if(!obj(a)||!concept(bank,a.concept)||typeof a.id!=='string'||ids.has(a.id)||!['basic','application'].includes(a.level)||!['lesson','question','explanation','check','done'].includes(a.stage)||!choice(a.selected)||!choice(a.checkSelected)||![null,'sure','unsure'].includes(a.confidence))throw Error('Invalid attempt');
     for(const k of ['startedAt','answeredAt','completedAt'])if(!num(a[k]))throw Error('Invalid time');
     for(const k of ['assisted','unknown','closed','moreChosen'])if(typeof a[k]!=='boolean')throw Error('Invalid flag');
     const firstLesson=a.firstLesson===true;
     if(firstLesson&&(a.answeredAt!==0||!a.assisted||a.selected!==null||a.confidence!==null||!['lesson','check','done'].includes(a.stage)))throw Error('Invalid teaching attempt');
     if(!firstLesson&&a.stage==='lesson')throw Error('Invalid teaching stage');
     if(!firstLesson&&a.stage!=='question'&&(!a.answeredAt||!s.cards[a.concept]||(!a.unknown&&(a.selected===null||!a.confidence))))throw Error('Missing answer');
     if(a.stage==='done'&&(!a.completedAt||a.checkSelected===null||!s.cards[a.concept]))throw Error('Missing check');
     const out={};for(const k of ['id','concept','level','stage','startedAt','selected','confidence','answeredAt','assisted','unknown','checkSelected','completedAt','closed','moreChosen'])out[k]=a[k];
     for(const k of ['questionIndex','checkIndex'])if(a[k]!==undefined){if(!num(a[k])||!concept(bank,a.concept).questions[a[k]])throw Error('Invalid question');out[k]=a[k];}
     if(a.firstLesson!==undefined){if(typeof a.firstLesson!=='boolean')throw Error('Invalid teaching flag');out.firstLesson=a.firstLesson;}
     if(a.taughtAt!==undefined){if(!num(a.taughtAt))throw Error('Invalid teaching time');out.taughtAt=a.taughtAt;}
     if(a.extraPractice!==undefined){if(typeof a.extraPractice!=='boolean')throw Error('Invalid practice flag');out.extraPractice=a.extraPractice;}
     for(const k of ['questionFirst','initialProbe','targetedPractice'])if(a[k]!==undefined){if(typeof a[k]!=='boolean')throw Error('Invalid question-first flag');out[k]=a[k];}
     if(a.initialProbe&&(!a.questionFirst||firstLesson))throw Error('Invalid initial probe');
     if(a.support!==undefined){
       const p=a.support,d=obj(p)&&supportDefinition(bank,p.id);
       if(!d||a.stage!=='done'||!choice(p.selected)||!num(p.startedAt)||!num(p.answeredAt)||p.startedAt<a.completedAt||(p.answeredAt&&p.answeredAt<p.startedAt)||!supportChoices(s,bank,a).includes(p.id))throw Error('Invalid support');
       out.support={id:p.id,selected:p.selected,correct:p.answeredAt?p.selected===d.question.answer:null,startedAt:p.startedAt,answeredAt:p.answeredAt};
     }
     out.delayedProbe=typeof a.delayedProbe==='boolean'?a.delayedProbe:null;
     out.correct=a.answeredAt?!a.unknown&&a.selected===question(bank,a).answer:null;out.checkCorrect=a.completedAt?a.checkSelected===checkQuestion(bank,a).answer:null;s.sessions.push(out);ids.add(a.id);
   }
   s.activeId=ids.has(v.activeId)?v.activeId:null;return s;
 }
 const api={KEY,DAY,HOUR,fresh,active,question,checkQuestion,start,recommend,nextNew,newTopic,submit,beginCheck,check,stop,more,topicStart,supportChoices,supportDefinition,beginSupport,answerSupport,restore};root.BasicsEngine=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
