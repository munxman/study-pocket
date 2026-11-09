// Read-only, bounded reporting. Event dates come from saved device timestamps,
// never from the module's most recent server upload. No drafts or raw answers.
export const ZONE='Europe/Tallinn';
const list=x=>Array.isArray(x)?x:[];
const unique=xs=>[...new Map(xs.filter(x=>x&&typeof x.id==='string').map(x=>[x.id,x])).values()];
const safe=x=>typeof x==='string'?x.slice(0,120):null;
const bool=x=>typeof x==='boolean'?x:null;
export const normalizeGuestName=value=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g,'').replace(/\s+/g,' ').trim():'';
export const trialParticipantName=s=>s.participant==='guest'?(normalizeGuestName(s.participantName).slice(0,60).replace(/[\uD800-\uDBFF]$/,'')||null):null;
export const localDay=t=>new Intl.DateTimeFormat('sv-SE',{timeZone:ZONE}).format(t);
export function range(from,to,now=Date.now()){
 const valid=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
 if(!valid(from)||!valid(to)||from>to||Date.parse(to)-Date.parse(from)>30*86400000)throw Error('Use an inclusive date range of at most 31 days (YYYY-MM-DD).');
 return {from,to,now};
}
export function eventsFor(modules,now=Date.now()){
 const events=[];let undated=0,invalidTimes=0;
 function add(module,s,kind,at,detail={},timeBasis='device_event'){
  if(!Number.isFinite(at)||at<=0){undated++;return;}
  if(at>now+300000){invalidTimes++;return;}
  events.push({module,sessionId:s.id,kind,at,date:localDay(at),timeBasis,concept:safe(s.concept),stage:safe(s.stage||s.status),...detail});
 }
 for(const [module,data] of Object.entries(modules)){
  if(['hendrik-bio-basics-v1','hendrik-imat-bio-v1'].includes(module)){
   for(const s of unique(list(data.sessions))){
    const basics=module==='hendrik-bio-basics-v1';
    if(typeof s.correct==='boolean')add(module,s,'first_answer',s.answeredAt,{correct:s.correct,confidence:safe(s.confidence),unknown:!!s.unknown,questionIndex:Number.isInteger(s.questionIndex)?s.questionIndex:null,delayedProbe:bool(s.delayedProbe),initialProbe:bool(s.initialProbe),targetedPractice:!!s.targetedPractice,independent:basics||!s.assisted,readingMistakeSelfReported:s.error==='Lugesin valesti'});
    if(basics&&typeof s.checkCorrect==='boolean')add(module,s,'immediate_check',s.completedAt,{correct:s.checkCorrect,questionIndex:Number.isInteger(s.checkIndex)?s.checkIndex:null,independent:false});
    // Old IMAT retry arrays have no per-retry timestamps: don't date them at upload.
    if(!basics&&list(s.retryAnswers).length)add(module,s,'immediate_check',s.completedAt||s.answeredAt,{correct:s.targetedPractice&&typeof s.checkCorrect==='boolean'?s.checkCorrect:s.retryErrors?.[0]===null&&s.retryAnswers.length===1&&!!s.completedAt,questionIndex:Number.isInteger(s.retryIndex)?s.retryIndex:2,tries:s.retryAnswers.length,independent:false},s.completedAt?'session_completion_proxy':'first_answer_proxy');
    if(typeof s.support?.correct==='boolean')add(module,s,'support_check',s.support.answeredAt,{correct:s.support.correct,supportId:safe(s.support.id),independent:false});
    if(s.completedAt)add(module,s,'completed_block',s.completedAt,{moreChosen:!!s.moreChosen,extraPractice:!!s.extraPractice});
    else if(!s.answeredAt)add(module,s,'opened_only',s.startedAt,{isStudyEvidence:false});
    else add(module,s,'unfinished',s.answeredAt,{isStudyEvidence:false},'last_known_answer');
   }
   }else if(['hendrik-maths-v1','hendrik-physics-v1','hendrik-chemistry-v1'].includes(module)){
   for(const s of unique(list(data.sessions))){
    if(typeof s.correct==='boolean')add(module,s,'first_answer',s.answeredAt,{correct:s.correct,confidence:safe(s.confidence),unknown:!!s.unknown,questionIndex:Number.isInteger(s.questionIndex)?s.questionIndex:null,initialProbe:bool(s.initialProbe),delayedProbe:s.delayedProbe===true&&!s.assisted,independent:!s.assisted,repeatedQuestion:bool(s.repeatedQuestion),contentVersion:s.contentVersion||null});
    if(typeof s.checkCorrect==='boolean')add(module,s,'immediate_check',s.checkAnsweredAt||s.completedAt,{correct:s.checkCorrect,questionIndex:Number.isInteger(s.checkIndex)?s.checkIndex:null,independent:false},s.checkAnsweredAt?'device_event':'session_completion_proxy');
    if(s.completedAt)add(module,s,'completed_block',s.completedAt,{moreChosen:!!s.moreChosen});
    else add(module,s,s.answeredAt?'unfinished':'opened_only',s.answeredAt||s.startedAt,{isStudyEvidence:false},s.answeredAt?'last_known_answer':'device_event');
   }
  }else if(module==='hendrik-video-practice-v1'){
   for(const s of unique(list(data.sessions))){
    const common={videoId:safe(s.videoId),questionId:safe(s.questionId),questionIndex:Number.isInteger(s.questionIndex)?s.questionIndex:null,contentVersion:Number.isSafeInteger(s.contentVersion)?s.contentVersion:null,ordinaryBlockCredit:false,chainCredit:false,masteryCredit:false};
    // Opening a resource or its application question is operational evidence only.
    add(module,s,'video_open',s.openedAt||s.startedAt,{...common,openedVideo:!!s.openedAt,isStudyEvidence:false},s.openedAt?'device_event':'question_open');
    if(typeof s.correct==='boolean'&&s.answeredAt){
     const independent=s.independent===true&&s.assisted===false;
     add(module,s,'video_application',s.answeredAt,{...common,correct:s.correct,confidence:safe(s.confidence),initialProbe:bool(s.initialProbe),repeatedQuestion:bool(s.repeatedQuestion),assisted:bool(s.assisted),independent,delayedProbe:s.delayedProbe===true&&independent,delayedEligibleAtStart:bool(s.delayedEligibleAtStart),isStudyEvidence:true});
    }
   }
  }else if(module==='hendrik-imat-trial-v1'){
   for(const s of unique(list(data.sessions))){
    // Account ownership does not establish who answered. Older unlabelled trials
    // remain unknown; explicitly labelled guest work is readable but not personal evidence.
    const participant=['learner','guest'].includes(s.participant)?s.participant:null,guest=participant==='guest';
    const common={paper:safe(s.paper),paperTitle:safe(s.paperTitle),paperOrigin:safe(s.paperOrigin),participant,participantName:trialParticipantName(s),repeated:!!s.repeated};
    if(s.timedSubmittedAt){
     add(module,s,'trial_timed_result',s.timedSubmittedAt,{...s.timedResult,...common,expired:!!s.expired,isStudyEvidence:!guest&&!!s.completedAt});
     for(const r of list(s.results))add(module,s,'trial_response',s.timedSubmittedAt,{...common,questionId:safe(r.id),topic:safe(r.topic),correct:bool(r.correct),blank:!!r.blank,extension:!!r.extension,confidence:safe(r.confidence),isStudyEvidence:!guest&&!r.blank},'timed_submission');
     if(s.completedAt&&!guest)add(module,s,'completed_block',s.completedAt,common);
     if(s.secondSubmittedAt)add(module,s,'trial_untimed_result',s.secondSubmittedAt,{...s.secondResult,...common,isStudyEvidence:false});
    }else{const times=Object.values(s.answerTimes||{}).filter(Number.isFinite);add(module,s,times.length?'unfinished':'opened_only',times.length?Math.max(...times):s.startedAt,{...common,isStudyEvidence:false,hasSavedWork:times.length>0});}
   }
  }else if(module==='hendrik-ielts-v1'){
   const sessions=unique(list(data.sessions));
   for(const s of sessions){
    const detail={skill:safe(s.kind),title:safe(s.title)};
    for(const [i,r] of list(s.results).entries())add(module,s,'scored_answer',r.at||s.completedAt,{...detail,questionId:safe(r.id),resultIndex:i,correct:bool(r.correct),blank:!!r.blank,repeated:!!r.repeated,confidence:safe(r.confidence),questionType:safe(r.skill||r.type)},r.at?'device_event':'session_completion_proxy');
    if(s.completedAt)add(module,s,'completed_block',s.completedAt,{...detail,words:Number.isFinite(s.wordCount)?s.wordCount:null,recorded:!!s.recorded});
    else {
     const worked=Object.values(s.answers||{}).some(x=>String(x).trim())||Object.values(s.texts||{}).some(x=>String(x).trim())||s.recorded;
     for(const [id,at] of Object.entries(s.answerTimes||{}))if(String(s.answers?.[id]||'').trim())add(module,s,'saved_response',at,{...detail,questionId:safe(id),correct:null});
     add(module,s,worked?'unfinished':'opened_only',s.updatedAt||s.startedAt,{...detail,isStudyEvidence:false,hasSavedWork:!!worked},'last_session_update');
    }
   }
   for(const e of unique(list(data.evaluations)))if(sessions.some(s=>s.id===e.sessionId&&s.completedAt))add(module,{id:e.sessionId},'external_feedback',e.at,{evaluationId:safe(e.id),skill:safe(e.kind),band:Number.isFinite(e.band)&&e.band>=0&&e.band<=9?e.band:null,source:['ChatGPT','Teacher','Official result'].includes(e.source)?e.source:'External',verified:false,isStudyEvidence:false});
  }else if(['hendrik-bioloogia-v1','hendrik-akadeemiline-v1','hendrik-tekst-v1'].includes(module)){
   const school=module==='hendrik-bioloogia-v1',reading=module==='hendrik-tekst-v1';
   for(const s of unique(module==='hendrik-akadeemiline-v1'?list(data.attempts):[...list(data.sessions),...(data.active?[data.active]:[])])){
    const end=school?(s.completed?s.completedAt:0):s.finished;
    for(const [i,a] of list(reading?s.solo:s.answers).entries())if(typeof a.correct==='boolean')add(module,s,a.type==='self'?'self_rating':'scored_answer',reading?end:a.at,{questionId:safe(a.id),resultIndex:i,correct:a.correct,isStudyEvidence:a.type!=='self'},reading?'session_completion_proxy':'device_event');
    if(end)add(module,s,'completed_block',end);
    else add(module,s,'unfinished',s.startedAt||s.started||s.createdAt,{isStudyEvidence:false},'session_start');
   }
  }else if(module==='hendrik-nerves-feedback-v1')undated+=list(data.firstAnswers).filter(x=>typeof x==='boolean').length;
 }
 events.sort((a,b)=>b.at-a.at||a.module.localeCompare(b.module)||a.sessionId.localeCompare(b.sessionId)||a.kind.localeCompare(b.kind)||(a.resultIndex||0)-(b.resultIndex||0));
 return {events,undated,invalidTimes};
}
export function dailyReport(events,from,to){
 const days=[];
 for(let t=Date.parse(from);t<=Date.parse(to);t+=86400000){const date=new Date(t).toISOString().slice(0,10),today=events.filter(e=>e.date===date),modules=[];
  for(const module of [...new Set(today.map(e=>e.module))]){const rows=today.filter(e=>e.module===module&&e.participant!=='guest'),count=k=>rows.filter(e=>e.kind===k).length,answers=rows.filter(e=>['first_answer','scored_answer'].includes(e.kind)&&typeof e.correct==='boolean'),checks=rows.filter(e=>e.kind==='immediate_check'),delayed=answers.filter(e=>e.delayedProbe===true),evidence=rows.filter(e=>e.isStudyEvidence!==false&&['first_answer','scored_answer','saved_response','immediate_check','support_check','completed_block','video_application'].includes(e.kind));
   const videos=rows.filter(e=>e.kind==='video_application'&&typeof e.correct==='boolean'),videoStats=module==='hendrik-video-practice-v1'?{videoApplications:videos.length,videoCorrect:videos.filter(e=>e.correct).length,videoIndependent:videos.filter(e=>e.independent===true).length,videoIndependentCorrect:videos.filter(e=>e.independent===true&&e.correct).length,videoDelayed:videos.filter(e=>e.delayedProbe===true).length,videoDelayedCorrect:videos.filter(e=>e.delayedProbe===true&&e.correct).length,videoOpened:count('video_open')}:{};
   modules.push({module,completed:count('completed_block'),answers:answers.length,correct:answers.filter(e=>e.correct).length,immediateChecks:checks.length,immediateCorrect:checks.filter(e=>e.correct).length,delayed:delayed.length,delayedCorrect:delayed.filter(e=>e.correct).length,supportChecks:count('support_check'),openedOnly:count('opened_only'),unfinished:count('unfinished'),savedResponses:count('saved_response'),...videoStats,firstActivity:evidence.length?Math.min(...evidence.map(e=>e.at)):null,lastActivity:evidence.length?Math.max(...evidence.map(e=>e.at)):null});
  }
  days.push({date,studyRecorded:modules.some(m=>m.firstActivity!==null),completed:modules.reduce((n,m)=>n+m.completed,0),modules});
 }
 return days;
}
