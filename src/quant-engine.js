(function(root,factory){const api=factory();root.QuantEngine=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 const DAY=86400000, FIRST=[0,1,4,5];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const fresh=()=>({version:1,serial:0,cards:{},sessions:[],activeId:null});
 const active=s=>s.sessions.find(a=>a.id===s.activeId)||null;
 const topic=(b,a)=>b.topics.find(t=>t.id===a.concept);
 function restore(raw,b){
  if(raw==null)return fresh();const s=typeof raw==='string'?JSON.parse(raw):clone(raw);
  if(s.version!==1||!Array.isArray(s.sessions)||!s.cards||typeof s.cards!=='object'||Array.isArray(s.cards)||!Number.isSafeInteger(s.serial)||s.serial<0)throw Error('Õpiajalugu vajab kontrollimist.');
  const ids=new Set();for(const a of s.sessions){const t=topic(b,a);if(!t||typeof a.id!=='string'||ids.has(a.id)||!['question','lesson','check','done'].includes(a.stage)||!Number.isInteger(a.questionIndex)||!t.questions[a.questionIndex]||!Number.isInteger(a.checkIndex)||!t.questions[a.checkIndex])throw Error('Varasem plokk ei sobi selle õppepaketiga.');ids.add(a.id);}
  if(s.activeId&&!ids.has(s.activeId))throw Error('Pooleli töö viide ei sobi.');return s;
 }
 function seen(s,id){return new Set(s.sessions.filter(a=>a.concept===id&&a.answeredAt).map(a=>a.questionIndex));}
 function candidate(s,b,now,exclude){
  let choices=b.topics.filter(t=>t.id!==exclude);if(!choices.length)choices=b.topics;
  const due=choices.filter(t=>s.cards[t.id]?.due<=now).sort((a,b)=>s.cards[a.id].due-s.cards[b.id].due);
  if(due.length)return due[0];
  const unseen=choices.filter(t=>!s.sessions.some(a=>a.concept===t.id&&a.answeredAt));if(unseen.length)return unseen[0];
  return choices.filter(t=>FIRST.some(i=>!seen(s,t.id).has(i))).sort((a,b)=>(s.cards[a.id]?.lastExposure||0)-(s.cards[b.id]?.lastExposure||0))[0]||null;
 }
 function start(s,b,now=Date.now(),concept=null,exclude=null){
  const waiting=s.sessions.filter(a=>a.stage!=='done');
  const resume=concept?waiting.find(a=>a.concept===concept):active(s)&&active(s).stage!=='done'?active(s):waiting.at(-1);
  if(resume){s.activeId=resume.id;return resume;}
  const t=concept?b.topics.find(t=>t.id===concept):candidate(s,b,now,exclude);if(!t)return null;
  const used=seen(s,t.id),counts=i=>s.sessions.filter(a=>a.concept===t.id&&a.questionIndex===i&&a.answeredAt).length;
  const questionIndex=FIRST.find(i=>!used.has(i))??[...FIRST].sort((a,b)=>counts(a)-counts(b))[0];
  s.serial++;const id='quant-'+(globalThis.crypto?.randomUUID?.()||now.toString(36)+'-'+s.serial+'-'+Math.random().toString(36).slice(2));
  const c=s.cards[t.id];
  const a={id,kind:'quantitative',concept:t.id,startedAt:now,stage:'question',questionIndex,checkIndex:2,selected:null,checkSelected:null,confidence:null,answeredAt:0,completedAt:0,assisted:false,initialProbe:used.size===0,delayedProbe:false,delayedEligibleAtStart:!!c&&now-c.lastExposure>=DAY&&now>=c.due,repeatedQuestion:used.has(questionIndex),contentVersion:1};
  s.sessions.push(a);s.activeId=id;return a;
 }
 function help(s,now=Date.now()){const a=active(s);if(!a)return;if(!a.answeredAt){a.assisted=true;a.delayedProbe=false;}a.taughtAt=now;a.stage='lesson';}
 function submit(s,b,now=Date.now()){
  const a=active(s);if(!a||a.stage!=='question'||a.answeredAt)return false;
  const q=topic(b,a).questions[a.questionIndex];if(a.selected!==null&&(!Number.isInteger(a.selected)||!q.options[a.selected]||!['sure','unsure'].includes(a.confidence)))return false;
  const c=s.cards[a.concept];a.unknown=a.selected===null;a.correct=a.selected===q.answer;a.answeredAt=now;
  a.delayedProbe=a.delayedEligibleAtStart===true&&!a.initialProbe&&!a.assisted&&!!c&&now-c.lastExposure>=DAY&&now>=c.due;
  a.checkIndex=a.correct&&a.confidence==='sure'?3:2;a.stage='lesson';a.taughtAt=now;return true;
 }
 function beginCheck(s){const a=active(s);if(!a||a.stage!=='lesson')return false;a.stage=a.answeredAt?'check':'question';return true;}
 function check(s,b,now=Date.now()){
  const a=active(s);if(!a||a.stage!=='check'||a.completedAt)return false;const q=topic(b,a).questions[a.checkIndex];
  if(!Number.isInteger(a.checkSelected)||!q.options[a.checkSelected])return false;
  a.checkCorrect=a.checkSelected===q.answer;a.checkAnsweredAt=now;a.completedAt=now;a.stage='done';
  const old=s.cards[a.concept]||{},good=a.delayedProbe&&a.correct&&a.confidence==='sure'&&a.checkCorrect;
  const streak=good?(old.delayedSuccesses||0)+1:!a.correct||!a.checkCorrect?0:old.delayedSuccesses||0;
  s.cards[a.concept]={lastExposure:now,lastAt:now,due:now+DAY*(good?Math.min(7,2**streak):1),delayedSuccesses:streak,needsHelp:!a.correct||!a.checkCorrect,failures:!a.correct||!a.checkCorrect?(old.failures||0)+1:0};return true;
 }
 function more(s,b,now=Date.now()){const a=active(s);if(a?.stage!=='done')return a;if(a)a.moreChosen=true;s.activeId=null;return start(s,b,now,null,a?.concept);}
 return {DAY,FIRST,fresh,restore,active,topic,start,help,submit,beginCheck,check,more,candidate,seen};
});
