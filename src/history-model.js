'use strict';
(function(root){
 const DAY=86400000,KEYS=['hendrik-bio-basics-v1','hendrik-imat-bio-v1','hendrik-bioloogia-v1'];
 const array=x=>Array.isArray(x)?x:[];
 const day=t=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(t);
 function unique(xs){const map=new Map();for(const s of array(xs)){if(!s||typeof s.id!=='string')continue;const old=map.get(s.id);const rank=x=>Math.max(x.completedAt||0,x.answeredAt||0,x.support?.answeredAt||0,...array(x.answers).map(a=>a.at||0));if(!old||rank(s)>=rank(old))map.set(s.id,s);}return [...map.values()];}
 function read(storage){const modules={},unreadable=[];for(const k of KEYS){try{const raw=storage.getItem(k);if(raw){const data=JSON.parse(raw);if(!data||!Array.isArray(data.sessions))throw Error('Invalid history');modules[k]=data;}}catch{unreadable.push(k);}}return {modules,unreadable};}
 function summarize(modules,now=Date.now()){
   const today=day(now),noon=Date.parse(today+'T12:00:00Z'),days=Array.from({length:7},(_,i)=>({key:day(noon-(6-i)*DAY),count:0})),since=days[0].key,previousStart=day(noon-13*DAY);
   const valid=t=>Number.isFinite(t)&&t>0&&t<=now;
   const current=t=>valid(t)&&day(t)>=since;
   const entries=[],events=[],byModule={};
   for(const [index,key] of KEYS.entries()){
     const id=['basics','imat','school'][index],data=modules[key]||{};
     const stats=byModule[id]={blocks:0,first:[],checks:[],delayed:[],support:[],self:[],choice:[]};
     for(const s of unique([...array(data.sessions),...(id==='school'&&data.active?[data.active]:[])])){
       let submitted=0,lastAt=0;
       const record=(at,type,correct,extra={})=>{if(!valid(at)||typeof correct!=='boolean')return;submitted++;lastAt=Math.max(lastAt,at);events.push({at,module:id,type,correct,...extra});if(current(at))stats[type].push({correct,...extra});};
       if(id==='school'){
         const answers=new Map();for(const a of array(s.answers))if(a&&typeof a.id==='string'&&valid(a.at))answers.set(a.id,a);
         for(const a of answers.values()){const type=a.type==='self'?'self':'choice';record(a.at,type,a.correct);if(current(a.at)&&a.type==='choice'&&a.delayed===true)stats.delayed.push({correct:a.correct});}
       }else{
         record(s.answeredAt,'first',s.correct,{independent:id==='basics'||!s.assisted});
         if(current(s.answeredAt)&&typeof s.correct==='boolean'&&s.delayedProbe===true&&(id==='basics'||!s.assisted))stats.delayed.push({correct:s.correct});
         if(id==='basics'){
           record(s.completedAt,'checks',s.checkCorrect);
           record(s.support?.answeredAt,'support',s.support?.correct);
         }else if(valid(s.completedAt)&&array(s.retryAnswers).length){
           // Retry timestamps were not recorded. Count one completed follow-up task,
           // not every tap/retry; preserve its FIRST-check outcome separately.
           record(s.completedAt,'checks',s.retryAnswers.length===1&&s.retryErrors?.[0]===null);
         }
       }
       const completed=valid(s.completedAt)&&(id==='school'?s.completed===true:submitted>0);
       if(completed){lastAt=Math.max(lastAt,s.completedAt);if(current(s.completedAt)){stats.blocks++;days.find(d=>d.key===day(s.completedAt)).count++;}}
       if(submitted||completed)entries.push({id:s.id,module:id,concept:s.concept||s.topic,completed,completedAt:completed?s.completedAt:0,at:lastAt});
     }
   }
   const recent=events.filter(e=>current(e.at)),activeDays=new Set(recent.map(e=>day(e.at)));
   for(const e of entries)if(current(e.completedAt))activeDays.add(day(e.completedAt));
   const blocks=Object.values(byModule).reduce((n,m)=>n+m.blocks,0);
   const previous=entries.filter(e=>e.completed&&day(e.completedAt)>=previousStart&&day(e.completedAt)<since).length;
   return {blocks,answers:recent.length,activeDays:activeDays.size,days,previous,byModule,entries:entries.sort((a,b)=>b.at-a.at).slice(0,12),since,today};
 }
 const api={KEYS,read,summarize,day};root.StudyHistory=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
