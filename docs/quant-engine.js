(function(root,factory){const api=factory();root.QuantEngine=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 const DAY=86400000,FIRST=[0,1,4,5],ROUTING_VERSION=1;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const fresh=()=>({version:1,serial:0,cards:{},sessions:[],activeId:null});
 const active=s=>s.sessions.find(a=>a.id===s.activeId)||null;
 const topic=(b,a)=>b.topics.find(t=>t.id===a.concept);
 const time=x=>Number.isFinite(x)&&x>0?x:0;
 const route=(t,i)=>t.followupVersion===ROUTING_VERSION?t.followups?.[i]:null;
 const routeIndices=t=>Object.keys(t.followups||{}).map(Number).filter(i=>route(t,i));
 const matching=(t,r)=>[r.simpleIndex,r.applicationIndex].every(i=>Number.isInteger(i)&&t.questions[i]?.skill===r.skill);
 function restore(raw,b){
  if(raw==null)return fresh();const s=typeof raw==='string'?JSON.parse(raw):clone(raw);
  if(s.version!==1||!Array.isArray(s.sessions)||!s.cards||typeof s.cards!=='object'||Array.isArray(s.cards)||!Number.isSafeInteger(s.serial)||s.serial<0)throw Error('Õpiajalugu vajab kontrollimist.');
  const ids=new Set();for(const a of s.sessions){const t=topic(b,a);if(!t||typeof a.id!=='string'||ids.has(a.id)||!['question','lesson','check','done'].includes(a.stage)||!Number.isInteger(a.questionIndex)||!t.questions[a.questionIndex]||!Number.isInteger(a.checkIndex)||!t.questions[a.checkIndex])throw Error('Varasem plokk ei sobi selle õppepaketiga.');
   if(a.routingVersion!==undefined){const r=route(t,a.routeIndex);if(a.routingVersion!==ROUTING_VERSION||!r||!matching(t,r)||a.initialSkill!==r.skill||a.initialSkill!==t.questions[a.questionIndex].skill||a.checkSkill!==r.skill||a.checkSkill!==t.questions[a.checkIndex].skill||![a.routeIndex,r.simpleIndex,r.applicationIndex].includes(a.questionIndex)||![a.routeIndex,r.simpleIndex,r.applicationIndex].includes(a.checkIndex))throw Error('Selle oskuse töö vajab sobivat õppepaketti. Kontrolli uuendust.');}
   ids.add(a.id);
  }
  if(s.activeId&&!ids.has(s.activeId))throw Error('Pooleli töö viide ei sobi.');return s;
 }
 function seen(s,id){return new Set(s.sessions.filter(a=>a.concept===id&&a.answeredAt).map(a=>a.questionIndex));}
 function count(s,id,index){return s.sessions.filter(a=>a.concept===id).reduce((n,a)=>n+Number(!!a.answeredAt&&a.questionIndex===index)+Number(!!(a.checkAnsweredAt||a.completedAt)&&typeof a.checkCorrect==='boolean'&&a.checkIndex===index),0);}
 // Derive exact-skill evidence from immutable attempts, not a last-write-wins
 // topic card. Historical flags are never rewritten or upgraded by this view.
 function skillEvidence(s,b,concept){
  const t=b.topics.find(t=>t.id===concept);if(!t)return {};
  const evidence={},events=[];let knownExposure=0;
  for(const a of s.sessions.filter(x=>x.concept===concept)){
   knownExposure=Math.max(knownExposure,time(a.answeredAt),time(a.taughtAt),time(a.checkAnsweredAt||a.completedAt));
   const first=t.questions[a.questionIndex]?.skill,check=t.questions[a.checkIndex]?.skill;
   if(first&&time(a.answeredAt)&&typeof a.correct==='boolean')events.push({at:a.answeredAt,order:0,skill:first,kind:'first',a,correct:a.correct});
   if(time(a.taughtAt)){const taught=a.routingVersion?[first]:[...new Set(t.questions.slice(0,6).map(q=>q.skill))];for(const skill of taught.filter(Boolean))events.push({at:a.taughtAt,order:1,skill,kind:'exposure',a});}
   if(check&&time(a.checkAnsweredAt||a.completedAt)&&typeof a.checkCorrect==='boolean')events.push({at:a.checkAnsweredAt||a.completedAt,order:2,skill:check,kind:'check',a,correct:a.checkCorrect});
  }
  const stored=s.cards[concept]||{},external=Math.max(time(stored.lastExternalExposure),time(stored.lastExposure)>knownExposure?time(stored.lastExposure):0);
  // A video opened on another device may sync after the answer. Replay its
  // actual saved exposure time before judging whether later recall resolved a miss.
  if(external)for(const skill of new Set(t.questions.map(q=>q.skill)))events.push({at:external,order:-1,skill,kind:'exposure',a:{id:'external-exposure'}});
  events.sort((a,b)=>a.at-b.at||a.order-b.order||a.a.id.localeCompare(b.a.id));
  for(const e of events){const c=evidence[e.skill]||(evidence[e.skill]={attempts:0,lastExposure:0,due:0,needsHelp:false,failures:0,delayedSuccesses:0,lastWrongAt:0,lastIndependentAt:0});
   const later=e.kind==='first'&&e.a.delayedProbe===true&&c.attempts>0&&!e.a.assisted&&e.a.confidence==='sure'&&c.lastExposure>0&&time(e.a.startedAt)>=c.lastExposure+DAY&&e.a.startedAt>=c.due;
   if(e.kind!=='exposure'){
    c.attempts++;
    if(!e.correct){c.needsHelp=true;c.failures++;c.delayedSuccesses=0;c.lastWrongAt=e.at;}
    else if(e.kind==='first'&&e.a.confidence!=='sure'){c.needsHelp=true;c.delayedSuccesses=0;}
    else if(e.kind==='first'&&!e.a.assisted){c.lastIndependentAt=e.at;if(later){c.needsHelp=false;c.failures=0;c.delayedSuccesses++;}}
   }
   c.lastExposure=Math.max(c.lastExposure,e.at);c.due=c.lastExposure+DAY*(!c.needsHelp&&c.delayedSuccesses?Math.min(7,2**c.delayedSuccesses):1);
  }
  return evidence;
 }
 function dueSkills(s,b,t,now){const e=skillEvidence(s,b,t.id);return routeIndices(t).map(i=>({i,r:route(t,i),c:e[route(t,i).skill]})).filter(x=>x.c?.attempts&&x.c.due<=now).sort((a,b)=>Number(b.c.needsHelp)-Number(a.c.needsHelp)||a.c.due-b.c.due||a.i-b.i);}
 function candidate(s,b,now,exclude){
  let choices=b.topics.filter(t=>t.id!==exclude);if(!choices.length)choices=b.topics;
  const due=choices.map(t=>({t,d:dueSkills(s,b,t,now)[0]})).filter(x=>x.d).sort((a,b)=>Number(b.d.c.needsHelp)-Number(a.d.c.needsHelp)||a.d.c.due-b.d.c.due);
  if(due.length)return due[0].t;
  const legacyDue=choices.filter(t=>!t.followups&&s.cards[t.id]?.due<=now).sort((a,b)=>s.cards[a.id].due-s.cards[b.id].due);if(legacyDue.length)return legacyDue[0];
  const unseen=choices.filter(t=>!s.sessions.some(a=>a.concept===t.id&&a.answeredAt));if(unseen.length)return unseen[0];
  return choices.filter(t=>FIRST.some(i=>!seen(s,t.id).has(i))).sort((a,b)=>(s.cards[a.id]?.lastExposure||0)-(s.cards[b.id]?.lastExposure||0))[0]||null;
 }
 function start(s,b,now=Date.now(),concept=null,exclude=null){
  const waiting=s.sessions.filter(a=>a.stage!=='done');
  const resume=concept?waiting.find(a=>a.concept===concept):active(s)&&active(s).stage!=='done'?active(s):waiting.at(-1);
  if(resume){s.activeId=resume.id;return resume;}
  const t=concept?b.topics.find(t=>t.id===concept):candidate(s,b,now,exclude);if(!t)return null;
  const used=seen(s,t.id),due=dueSkills(s,b,t,now)[0];
  let routeIndex,questionIndex;
  if(due){routeIndex=due.i;questionIndex=[due.i,due.r.simpleIndex,due.r.applicationIndex].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>count(s,t.id,a)-count(s,t.id,b)||a-b)[0];}
  else{questionIndex=FIRST.find(i=>!used.has(i))??[...FIRST].sort((a,b)=>count(s,t.id,a)-count(s,t.id,b))[0];routeIndex=questionIndex;}
  const r=route(t,routeIndex),c=r?skillEvidence(s,b,t.id)[r.skill]:s.cards[t.id];
  if(r&&!matching(t,r))throw Error('Selle oskuse harjutus vajab kontrollimist.');
  s.serial++;const id='quant-'+(globalThis.crypto?.randomUUID?.()||now.toString(36)+'-'+s.serial+'-'+Math.random().toString(36).slice(2));
  const a={id,kind:'quantitative',concept:t.id,startedAt:now,stage:'question',questionIndex,checkIndex:r?r.simpleIndex:2,selected:null,checkSelected:null,confidence:null,answeredAt:0,completedAt:0,assisted:false,initialProbe:r?!c?.attempts:used.size===0,delayedProbe:false,delayedEligibleAtStart:!!c&&now-c.lastExposure>=DAY&&now>=c.due,repeatedQuestion:count(s,t.id,questionIndex)>0,contentVersion:r?2:1};
  if(r)Object.assign(a,{routingVersion:ROUTING_VERSION,routeIndex,initialSkill:r.skill,checkSkill:r.skill});
  s.sessions.push(a);s.activeId=id;return a;
 }
 function help(s,now=Date.now()){const a=active(s);if(!a||a.completedAt)return;if(!a.answeredAt){a.assisted=true;a.helpedAt=a.helpedAt||now;a.delayedProbe=false;}a.taughtAt=now;a.stage='lesson';}
 function submit(s,b,now=Date.now()){
  const a=active(s);if(!a||a.stage!=='question'||a.answeredAt)return false;
  const t=topic(b,a),q=t.questions[a.questionIndex];if(a.selected!==null&&(!Number.isInteger(a.selected)||!q.options[a.selected]||!['sure','unsure'].includes(a.confidence)))return false;
  const r=a.routingVersion===ROUTING_VERSION?route(t,a.routeIndex):null,c=r?skillEvidence(s,b,a.concept)[a.initialSkill]:s.cards[a.concept];
  a.unknown=a.selected===null;a.correct=a.selected===q.answer;a.answeredAt=now;
  a.delayedProbe=a.delayedEligibleAtStart===true&&!a.initialProbe&&!a.assisted&&!!c&&now-c.lastExposure>=DAY&&now>=c.due;
  if(r){const choices=a.correct&&a.confidence==='sure'?[r.applicationIndex,a.routeIndex,r.simpleIndex]:[r.simpleIndex,a.routeIndex,r.applicationIndex];a.checkIndex=choices.find(i=>i!==a.questionIndex);a.checkSkill=t.questions[a.checkIndex].skill;a.checkRepeatedQuestion=count(s,t.id,a.checkIndex)>0;}
  else a.checkIndex=a.correct&&a.confidence==='sure'?3:2;
  a.stage='lesson';a.taughtAt=now;return true;
 }
 function beginCheck(s){const a=active(s);if(!a||a.stage!=='lesson'||a.completedAt)return false;a.stage=a.answeredAt?'check':'question';return true;}
 function check(s,b,now=Date.now()){
  const a=active(s);if(!a||a.stage!=='check'||a.completedAt)return false;const q=topic(b,a).questions[a.checkIndex];
  if(!Number.isInteger(a.checkSelected)||!q.options[a.checkSelected])return false;
  a.checkCorrect=a.checkSelected===q.answer;a.checkAnsweredAt=now;a.completedAt=now;a.stage='done';
  const old=s.cards[a.concept]||{},good=a.delayedProbe&&a.correct&&a.confidence==='sure'&&a.checkCorrect;
  const streak=good?(old.delayedSuccesses||0)+1:!a.correct||!a.checkCorrect?0:old.delayedSuccesses||0;
  const evidence=Object.values(skillEvidence(s,b,a.concept)).filter(c=>c.attempts);
  s.cards[a.concept]={lastExposure:now,lastAt:now,...(old.lastExternalExposure?{lastExternalExposure:old.lastExternalExposure}:{}),due:evidence.length?Math.min(...evidence.map(c=>c.due)):now+DAY*(good?Math.min(7,2**streak):1),delayedSuccesses:evidence.length?Math.min(...evidence.map(c=>c.delayedSuccesses)):streak,needsHelp:evidence.length?evidence.some(c=>c.needsHelp):!a.correct||!a.checkCorrect,failures:evidence.length?evidence.reduce((n,c)=>n+c.failures,0):!a.correct||!a.checkCorrect?(old.failures||0)+1:0};return true;
 }
 function lesson(b,a){const t=topic(b,a);return a.routingVersion===ROUTING_VERSION?route(t,a.routeIndex)||t:t;}
 function more(s,b,now=Date.now()){const a=active(s);if(a?.stage!=='done')return a;if(a)a.moreChosen=true;s.activeId=null;return start(s,b,now,null,a?.concept);}
 return {DAY,FIRST,ROUTING_VERSION,fresh,restore,active,topic,start,help,submit,beginCheck,check,more,candidate,seen,skillEvidence,lesson};
});
