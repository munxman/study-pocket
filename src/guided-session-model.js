'use strict';
(function(root){
 const KEY='study-pocket-guided-imat-v1',DAY=86400000;
 const PURPOSES=['recall','focus','variety'];
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const completed=a=>!!a&&a.stage==='done'&&Number.isFinite(a.completedAt)&&a.completedAt>0;
 function create(aim,now=Date.now()){
   return {version:1,aim:aim===12?12:8,startedAt:now,status:'active',sessionIds:[],helpSeen:[]};
 }
 function restore(value,state){
   if(!object(value)||value.version!==1||![8,12].includes(value.aim)||!Number.isFinite(value.startedAt)||value.startedAt<0||!['active','paused','finished'].includes(value.status)||!Array.isArray(value.sessionIds)||value.sessionIds.length>3||new Set(value.sessionIds).size!==value.sessionIds.length||!Array.isArray(value.helpSeen))return null;
   const ids=new Set(state.sessions.map(a=>a.id));
   if(!value.sessionIds.every(id=>typeof id==='string'&&ids.has(id))||!value.helpSeen.every(id=>value.sessionIds.includes(id)))return null;
   const clean=create(value.aim,value.startedAt);clean.status=value.status;clean.sessionIds=[...value.sessionIds];clean.helpSeen=[...new Set(value.helpSeen)];return clean;
 }
 function summary(plan,state){
   const sessions=plan.sessionIds.map(id=>state.sessions.find(a=>a.id===id));
   return {sessions,completed:sessions.filter(completed).length,missing:sessions.some(a=>!a),current:sessions.at(-1)||null,index:Math.max(0,sessions.length-1),purpose:PURPOSES[Math.max(0,sessions.length-1)]};
 }
 function reconcile(plan,state){
   const result=summary(plan,state);
   if(result.missing){plan.status='finished';return {...result,conflict:true};}
   if(result.completed===3)plan.status='finished';
   const active=state.sessions.find(a=>a.id===state.activeId&&!a.closed);
   const conflict=(!!active&&plan.sessionIds.length>0&&!plan.sessionIds.includes(active.id))||
     (!!result.current&&!completed(result.current)&&active?.id!==result.current.id);
   if(conflict&&plan.status!=='finished')plan.status='paused';
   return {...result,conflict};
 }
 function eligible(c,state,bank,now){
   if(!c.targeted&&!c.questionFirst)return true;
   if(state.cards[c.id]?.lastExposure>now-DAY)return false;
   const last=[...state.sessions].filter(completed).sort((a,b)=>b.completedAt-a.completedAt)[0];
   return !c.targeted||!bank.concepts.find(v=>v.id===last?.concept)?.targeted;
 }
 function weaknesses(state,bank,now){
   return bank.concepts.map(c=>{
     const recent=state.sessions.filter(a=>a.concept===c.id&&a.answeredAt>0&&a.answeredAt>=now-21*DAY);
     let misses=0,lastMiss=0;
     for(const a of recent){
       const firstMiss=a.correct===false;
       const checkMiss=a.retryAnswers?.length>0&&a.retryAnswers[0]!==c.questions[a.retryIndex??2]?.answer;
       if(firstMiss||checkMiss){misses++;lastMiss=Math.max(lastMiss,a.completedAt||a.answeredAt);}
     }
     return {concept:c,misses,lastMiss};
   }).filter(x=>x.misses>0).sort((a,b)=>(b.misses>=2)-(a.misses>=2)||Number(!!b.concept.guidedExample)-Number(!!a.concept.guidedExample)||b.lastMiss-a.lastMiss||b.misses-a.misses);
 }
 function choose(plan,state,bank,engine,now=Date.now()){
   const step=plan.sessionIds.length;
   if(step>=3)return null;
   if(step===0)return engine.recommend(state,bank,now)||bank.concepts.filter(c=>eligible(c,state,bank,now)).sort((a,b)=>(state.cards[a.id]?.lastExposure||0)-(state.cards[b.id]?.lastExposure||0))[0]||null;
   const used=new Set(summary(plan,state).sessions.filter(Boolean).map(a=>a.concept));
   const available=bank.concepts.filter(c=>!used.has(c.id)&&eligible(c,state,bank,now));
   if(step===1){
     const weak=weaknesses(state,bank,now).find(x=>available.includes(x.concept));
     if(weak)return weak.concept;
   }
   const previous=summary(plan,state).current;
   const previousArea=bank.concepts.find(c=>c.id===previous?.concept)?.area;
   const varied=step===2?available.filter(c=>c.area!==previousArea):[];
   const pool=varied.length?varied:available;
   const ordinary=engine.recommend(state,bank,now);
   return pool.find(c=>c.id===ordinary?.id)||pool.filter(c=>!state.cards[c.id])[0]||pool.sort((a,b)=>(state.cards[a.id]?.lastExposure||0)-(state.cards[b.id]?.lastExposure||0))[0]||null;
 }
 const api={KEY,PURPOSES,create,restore,summary,reconcile,choose,weaknesses,completed};
 root.GuidedSessionModel=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
