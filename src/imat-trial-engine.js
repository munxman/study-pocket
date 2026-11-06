(function(r){
'use strict';
const KEY='hendrik-imat-trial-v1',clone=x=>JSON.parse(JSON.stringify(x));
function normalizeParticipantName(value){return typeof value==='string'?value.normalize('NFC').replace(/[\p{Cc}\p{Cf}]/gu,' ').replace(/\s+/gu,' ').trim().slice(0,60).replace(/[\uD800-\uDBFF]$/,'').trim():'';}
const fresh=()=>({version:1,serial:0,cards:{},sessions:[],activeId:null});
function restore(x){if(!x)return fresh();if(x.version!==1||!Array.isArray(x.sessions)||!x.cards)throw Error('Trial history cannot be read');return clone(x);}
function resolvePaper(banks,sessionOrId){
 const id=typeof sessionOrId==='string'?sessionOrId:sessionOrId?.paper;
 const list=Array.isArray(banks)?banks:banks?.questions?[banks]:Object.values(banks||{});
 return list.find(bank=>bank?.id===id&&Array.isArray(bank.questions))||null;
}
const active=s=>s.sessions.find(a=>a.id===s.activeId)||null;
function unfinished(s){return s.sessions.filter(a=>!a.reviewedAt&&['timed','choice','untimed'].includes(a.status)).sort((a,b)=>b.startedAt-a.startedAt)[0]||null;}
function start(s,bank,now=Date.now(),exposure={},options={}){
 const old=active(s),pending=old&&!old.reviewedAt&&['timed','choice','untimed'].includes(old.status)?old:unfinished(s);
 if(pending){s.activeId=pending.id;return pending;}
 if(!bank?.id||!Array.isArray(bank.questions)||!Number.isFinite(bank.minutes)||bank.minutes<=0)throw Error('Unknown trial paper');
 const a={id:'trial-'+(r.crypto?.randomUUID?.()||now+'-'+Math.random().toString(36).slice(2)),paper:bank.id,kind:'imat-trial',startedAt:now,updatedAt:now,deadline:now+bank.minutes*60000,status:'timed',index:0,answers:{},answerTimes:{},confidence:{},exposure:clone(exposure),repeated:s.sessions.some(x=>x.paper===bank.id&&x.timedSubmittedAt),completedAt:0};
 if(typeof bank.title==='string')a.paperTitle=bank.title;
 if(typeof bank.origin==='string')a.paperOrigin=bank.origin;
 if(['learner','guest'].includes(options.participant))a.participant=options.participant;
 if(a.participant==='guest'){const name=normalizeParticipantName(options.participantName);if(name)a.participantName=name;}
 s.serial++;s.sessions.push(a);s.activeId=a.id;return a;
}
function answer(a,id,value,now=Date.now()){if(!a||!['timed','untimed'].includes(a.status)||a.status==='timed'&&now>=a.deadline)return false;if(value!==null&&(!Number.isInteger(value)||value<0||value>4))return false;const key=a.status==='timed'?'answers':'secondAnswers';a[key][id]=value;a.answerTimes[id]=now;a.updatedAt=now;return true;}
function score(bank,answers={}){let correct=0,wrong=0,blank=0;for(const q of bank.questions){if(!Number.isInteger(answers[q.id]))blank++;else if(answers[q.id]===q.answer)correct++;else wrong++;}return {correct,wrong,blank,total:bank.questions.length,points:Math.round((correct*1.5-wrong*.4)*10)/10};}
function freeze(a,banks,now=Date.now()){
 const bank=resolvePaper(banks,a);if(!a||a.status!=='timed'||!bank)return false;
 a.timedAnswers=clone(a.answers);a.timedConfidence=clone(a.confidence);a.timedResult=score(bank,a.timedAnswers);a.results=bank.questions.map(q=>({id:q.id,topic:q.topic,correct:a.timedAnswers[q.id]===q.answer,blank:!Number.isInteger(a.timedAnswers[q.id]),confidence:a.timedConfidence[q.id]||'not_reported',extension:!!q.extension}));a.timedSubmittedAt=Math.min(now,a.deadline);a.completedAt=a.timedResult.correct+a.timedResult.wrong?a.timedSubmittedAt:0;a.expired=now>=a.deadline;a.status='choice';a.updatedAt=now;return true;
}
function second(a,now=Date.now()){if(!a||a.status!=='choice')return false;a.status='untimed';a.secondAnswers=clone(a.timedAnswers);a.secondStartedAt=now;a.updatedAt=now;return true;}
function review(a,banks,now=Date.now()){
 const bank=resolvePaper(banks,a);if(!a||!['choice','untimed'].includes(a.status)||!bank)return false;
 if(a.status==='untimed'){a.secondResult=score(bank,a.secondAnswers);a.secondSubmittedAt=now;}a.reviewedAt=now;a.status='review';a.updatedAt=now;return true;
}
function merge(base,local,remote){
 if(!local)return clone(remote);if(!remote)return clone(local);
 const out=fresh(),map=new Map();
 for(const a of [...remote.sessions,...local.sessions]){
  const old=map.get(a.id);if(!old){map.set(a.id,clone(a));continue;}
  const prior=base?.sessions?.find(x=>x.id===a.id);
  const frozen=old.timedSubmittedAt?old:a.timedSubmittedAt?a:null;
  if(a.paper!==old.paper){
   // Never splice answers or results from two papers into one saved attempt.
   const expectedPaper=prior?.paper||old.paper;
   const matching=[old,a].filter(x=>x.paper===expectedPaper);
   const coherent=matching.find(x=>x.timedSubmittedAt)||matching[0]||old;
   map.set(a.id,clone(coherent));continue;
  }
  const rank=x=>({timed:0,choice:1,untimed:2,review:3}[x.status]||0);
  const winner=clone(rank(a)>rank(old)||rank(a)===rank(old)&&a.updatedAt>old.updatedAt?a:old);
  const identity=prior||old;
  for(const k of ['paper','paperTitle','paperOrigin','participant','participantName','startedAt','deadline']){
   if(identity[k]!==undefined)winner[k]=clone(identity[k]);else delete winner[k];
  }
  if(frozen)for(const k of ['timedAnswers','timedConfidence','results','timedResult','timedSubmittedAt','completedAt','expired','repeated'])if(frozen[k]!==undefined)winner[k]=clone(frozen[k]);
  map.set(a.id,winner);
 }
 out.sessions=[...map.values()].sort((a,b)=>a.startedAt-b.startedAt);out.serial=Math.max(local.serial||0,remote.serial||0);out.activeId=base&&local.activeId===base.activeId?remote.activeId:local.activeId;return out;
}
const api={KEY,normalizeParticipantName,fresh,restore,resolvePaper,unfinished,start,active,answer,score,freeze,second,review,merge};r.ImatTrialEngine=api;if(typeof module==='object')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
