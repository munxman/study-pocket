import { summarizeEnglish } from './ielts-overview.js';
const DAY=86400000;
const array=x=>Array.isArray(x)?x:[];
const unique=xs=>[...new Map(xs.filter(x=>x&&typeof x.id==='string').map(x=>[x.id,x])).values()];
const day=t=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(t);
const stats=()=>({attempts:0,correct:0,independent:0,independentCorrect:0,unsure:0,unknown:0,sureWrong:0,checks:0,checkCorrect:0,delayed:0,delayedCorrect:0,delayedSure:0,unclassified:0});

export function summarize(modules,period='7',now=Date.now()) {
  // Rolling 7/30 days; activity is grouped into local Estonian calendar days.
  const since=period==='all'?0:now-Number(period)*DAY;
  const inRange=t=>Number.isFinite(t)&&t>0&&t>=since&&t<=now;
  const activity=new Map(),timeline=[];
  const touch=(at,n=1)=>{if(inRange(at))activity.set(day(at),(activity.get(day(at))||0)+n);};
  let lastAnswer=0;
  const report={period,since,now,modules:[],other:[],activeDays:0,lastAnswer:0,days:[],timeline:[]};
  for(const [key,id] of [['hendrik-bio-basics-v1','basics'],['hendrik-imat-bio-v1','imat']]) {
    const data=modules[key]||{},sessions=unique(array(data.sessions));
    const result={id,...stats(),completed:0,more:0,openedUnanswered:0,unfinished:0,unfinishedDay:0,concepts:[],readingSelfReport:0,supportChecks:0,supportCorrect:0,supportHistory:[]};
    const concepts=new Map();
    for(const a of sessions) {
      if(typeof a.concept!=='string'||a.concept.length>100)continue;
      const first=inRange(a.answeredAt)&&typeof a.correct==='boolean',completion=inRange(a.completedAt);
      const p=id==='basics'&&a.support;
      if(p&&typeof p.correct==='boolean'&&typeof p.id==='string'){
        if(p.answeredAt>0&&p.answeredAt<=now)lastAnswer=Math.max(lastAnswer,p.answeredAt);
        if(inRange(p.answeredAt)){result.supportChecks++;result.supportCorrect+=p.correct?1:0;touch(p.answeredAt);result.supportHistory.push({id:p.id,concept:a.concept,correct:p.correct,unknown:p.selected===null,at:p.answeredAt});}
      }
      if(a.answeredAt>0&&a.answeredAt<=now)lastAnswer=Math.max(lastAnswer,a.answeredAt);
      if(id==='basics'&&a.firstLesson&&typeof a.checkCorrect==='boolean'&&a.completedAt>0&&a.completedAt<=now)lastAnswer=Math.max(lastAnswer,a.completedAt);
      if(inRange(a.startedAt)&&!a.answeredAt&&!a.completedAt)result.openedUnanswered++;
      if(!first&&!completion)continue;
      if(!concepts.has(a.concept))concepts.set(a.concept,{id:a.concept,...stats(),unfinishedDay:0,lastAnswer:0,needsHelp:!!data.cards?.[a.concept]?.needsHelp||!!data.cards?.[a.concept]?.highPending||data.cards?.[a.concept]?.failures>0,due:data.cards?.[a.concept]?.due||0,history:[]});
      const c=concepts.get(a.concept);
      if(first){
        // In foundations, assisted is assigned AFTER the first answer. That answer
        // still precedes the explanation. IMAT can expose teaching before answering.
        const independent=id==='basics'||!a.assisted;
        for(const target of [result,c]){
          target.attempts++;target.correct+=a.correct?1:0;
          target.independent+=independent?1:0;target.independentCorrect+=independent&&a.correct?1:0;
          target.unsure+=!a.unknown&&a.confidence==='unsure'?1:0;target.unknown+=a.unknown?1:0;
          target.sureWrong+=!a.unknown&&!a.correct&&a.confidence==='sure'?1:0;
          if(a.delayedProbe===true){target.delayed++;target.delayedCorrect+=a.correct?1:0;target.delayedSure+=a.correct&&a.confidence==='sure'?1:0;}
          else if(typeof a.delayedProbe!=='boolean')target.unclassified++;
        }
        c.lastAnswer=Math.max(c.lastAnswer,a.answeredAt);touch(a.answeredAt);
        if(!a.completedAt){result.unfinished++;if(now-a.answeredAt>=DAY){result.unfinishedDay++;c.unfinishedDay++;}}
        if(a.error==='Lugesin valesti')result.readingSelfReport++;
        c.history.push({at:a.answeredAt,correct:a.correct,confidence:a.unknown?null:a.confidence,unknown:!!a.unknown,independent,delayed:a.delayedProbe===true,level:a.level,completed:!!a.completedAt});
        timeline.push({at:a.answeredAt,module:id,concept:a.concept,correct:a.correct,unknown:!!a.unknown,completed:!!a.completedAt});
      }
      // Count the FIRST immediate check, not the eventually correct retry.
      const checked=id==='basics'?completion&&typeof a.checkCorrect==='boolean':first&&array(a.retryAnswers).length>0;
      if(checked){
        const correct=id==='basics'||(a.targetedPractice&&typeof a.checkCorrect==='boolean')?a.checkCorrect:a.retryErrors?.[0]===null&&a.retryAnswers.length===1&&!!a.completedAt;
        // For IMAT a failed retry cannot finish the session; a single successful
        // retry does. Repeated retries remain an initial miss even after completion.
        for(const target of [result,c]){target.checks++;target.checkCorrect+=correct?1:0;}
        if(id==='basics'&&a.firstLesson){
          // A teaching-first unit has a real check answer, but no independent
          // pre-teaching attempt. Keep the two denominators separate.
          touch(a.completedAt);lastAnswer=Math.max(lastAnswer,a.completedAt);c.lastAnswer=Math.max(c.lastAnswer,a.completedAt);
        }
      }
      if(completion){result.completed++;result.more+=a.moreChosen?1:0;touch(a.completedAt,0);}
    }
    result.concepts=[...concepts.values()].map(c=>({...c,history:c.history.sort((a,b)=>b.at-a.at).slice(0,8)})).sort((a,b)=>Number(b.needsHelp)-Number(a.needsHelp)||(b.attempts-b.correct)-(a.attempts-a.correct)||b.lastAnswer-a.lastAnswer);
    result.supportHistory.sort((a,b)=>b.at-a.at);result.supportHistory=result.supportHistory.slice(0,12);
    report.modules.push(result);
  }
  // Legacy exercises are separate: incompatible task formats must not produce a
  // blended "biology accuracy" or inferred examination readiness.
  for(const [key,id] of [['hendrik-bioloogia-v1','school'],['hendrik-akadeemiline-v1','academic'],['hendrik-tekst-v1','reading']]) {
    const data=modules[key]||{},sessions=unique(id==='academic'?array(data.attempts):[...array(data.sessions),...(data.active?[data.active]:[])]);
    let completed=0,answers=0,correct=0,self=0;
    for(const s of sessions){
      const end=id==='school'?s.completedAt:s.finished;
      if(inRange(end)&&(id!=='school'||s.completed)){completed++;touch(end,0);}
      for(const a of array(id==='reading'?s.solo:s.answers)){
        // Reading has no per-answer timestamp; only finished solo checks can be
        // assigned to a reporting period. Guided checks are deliberately excluded.
        const at=id==='reading'?end:a.at;
        if(!inRange(at)||typeof a.correct!=='boolean')continue;
        if(a.type==='self'){self++;continue;}answers++;correct+=a.correct?1:0;touch(at);lastAnswer=Math.max(lastAnswer,at);
      }
    }
    report.other.push({id,completed,answers,correct,self});
  }
  const nerve=array(modules['hendrik-nerves-feedback-v1']?.firstAnswers).filter(x=>typeof x==='boolean');
  report.nerve={answered:nerve.length,correct:nerve.filter(Boolean).length}; // Lifetime, no reliable answer dates.
  report.english=summarizeEnglish(modules['hendrik-ielts-v1'],since,now);
  report.trials=unique(array(modules['hendrik-imat-trial-v1']?.sessions)).filter(s=>inRange(s.timedSubmittedAt)).map(s=>({id:s.id,at:s.timedSubmittedAt,paper:s.paper,repeated:!!s.repeated,timed:s.timedResult,untimed:s.secondResult||null}));
  report.activeDays=activity.size;report.lastAnswer=lastAnswer;
  report.days=[...activity].sort(([a],[b])=>a.localeCompare(b)).map(([date,answers])=>({date,answers}));
  report.timeline=timeline.sort((a,b)=>b.at-a.at).slice(0,12);
  return report;
}
