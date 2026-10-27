// Read-only aggregate: never return drafts, typed answers, recordings or review text.
export function summarizeEnglish(data={},since=0,now=Date.now()){
 const within=t=>Number.isFinite(t)&&t>=since&&t<=now;
 const sessions=[...new Map((Array.isArray(data.sessions)?data.sessions:[]).filter(a=>a&&typeof a.id==='string').map(a=>[a.id,a])).values()];
 const report={completed:0,unfinished:[],openedOnly:0,days:[],skills:[],evaluations:[],lastActivity:0};
 const days=new Set();
 for(const kind of ['reading','listening','writing','speaking','drill']){
  const skill={kind,completed:0,answers:0,correct:0,blanks:0,repeated:0,firstSeen:0,firstSeenCorrect:0,unsure:0,questionTypes:[],history:[]},types=new Map();
  for(const s of sessions.filter(s=>s.kind===kind)){
   if(!s.completedAt){if(within(s.startedAt)){const worked=Object.values(s.answers||{}).some(x=>String(x).trim())||Object.values(s.texts||{}).some(x=>String(x).trim())||s.recorded;if(worked)report.unfinished.push({kind,title:String(s.title||'').slice(0,160),stage:s.status||'active',startedAt:s.startedAt,updatedAt:s.updatedAt});else report.openedOnly++;}continue;}
   if(!within(s.completedAt))continue;
   skill.completed++;report.completed++;report.lastActivity=Math.max(report.lastActivity,s.completedAt);days.add(new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Tallinn'}).format(s.completedAt));
   const results=Array.isArray(s.results)?s.results:[];
   for(const r of results){if(typeof r.correct!=='boolean')continue;skill.answers++;skill.correct+=+r.correct;skill.blanks+=+!!r.blank;skill.repeated+=+!!r.repeated;skill.firstSeen+=+!r.repeated;skill.firstSeenCorrect+=+(!r.repeated&&r.correct);skill.unsure+=+(r.confidence==='unsure');const key=String(r.skill||r.type||'unknown').slice(0,100),t=types.get(key)||{type:key,answers:0,correct:0};t.answers++;t.correct+=+r.correct;types.set(key,t);}
   skill.history.push({at:s.completedAt,title:String(s.title||'').slice(0,160),mode:s.mode,correct:results.filter(r=>r.correct===true).length,total:results.length,words:Number(s.wordCount)||0,recorded:!!s.recorded,timedOut:!!s.timedOut});
  }
  skill.questionTypes=[...types.values()].sort((a,b)=>(b.answers-b.correct)-(a.answers-a.correct));skill.history.sort((a,b)=>b.at-a.at);skill.history=skill.history.slice(0,8);report.skills.push(skill);
 }
 const seen=new Set();for(const e of Array.isArray(data.evaluations)?data.evaluations:[]){if(!e||seen.has(e.id)||!within(e.at)||!sessions.some(s=>s.id===e.sessionId&&s.completedAt))continue;seen.add(e.id);report.evaluations.push({kind:e.kind,at:e.at,source:['ChatGPT','Teacher','Official result'].includes(e.source)?e.source:'External',band:Number.isFinite(e.band)&&e.band>=0&&e.band<=9?e.band:null,verified:false});}
 report.evaluations.sort((a,b)=>b.at-a.at);report.days=[...days].sort();return report;
}
