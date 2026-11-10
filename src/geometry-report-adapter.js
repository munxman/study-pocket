(function (root) {
  'use strict';
  const M = root.GeometryReportModel || (typeof require === 'function' ? require('./geometry-report-model.js') : null);
  const E = root.GeometrySprintEngine || (typeof require === 'function' ? require('./geometry-sprint-engine.js') : null);
  const positive = n => Number.isSafeInteger(n) && n > 0 ? n : null;
  const hasText = x => typeof x === 'string' && x.trim().length > 0;
  function project(state, data, bank) {
    const out = M.fresh();
    if (!state || !/^[A-Za-z0-9_:-]{1,100}$/.test(state.recordId || '')) return out;
    const prefix = state.recordId, push = row => out.sessions.push(row);
    const skillFor = index => Object.values(bank?.skills || {}).find(s => s.diagnosticIndex === index);
    const diag = state.diagnostic?.submitted;
    if (diag) data.diagnostic.forEach((q,i) => {
      const skill = skillFor(i), value = diag.values[i] || '', at = positive(diag.at);
      push({id:prefix+':diagnostic:'+i,unitId:prefix+':diagnostic',kind:'diagnostic_response',contentVersion:1,questionId:'geometry-diagnostic-v1-'+i,questionIndex:i,topic:q.topic,...(skill ? {skill:skill.id} : {}),submittedAt:at,timeBasis:at?'diagnostic_submission_proxy':'unknown',correct:hasText(value)?E.matches(q,value):null,blank:!hasText(value),unknown:false,assisted:null,workingPresent:hasText(diag.working?.[i])});
    });
    else if (state.diagnostic && (state.diagnostic.values.some(hasText) || state.diagnostic.working.some(hasText))) {
      const at=positive(state.diagnostic.updatedAt);
      push({id:prefix+':diagnostic:state',unitId:prefix+':diagnostic',kind:'state',contentVersion:1,state:'unfinished',updatedAt:at,timeBasis:at?'device_event':'unknown',workingPresent:state.diagnostic.working.some(hasText)});
    }
    function item(q,a,topic,skill,questionIndex) {
      if (!a) return;
      const unitId=prefix+':'+q.id, first=a.attempts?.[0];
      if (first) {
        const at=positive(first.at);
        push({id:unitId+':answer',unitId,kind:'practice_response',contentVersion:1,questionId:q.id,topic,skill,...(questionIndex!==undefined?{questionIndex}:{}),submittedAt:at,timeBasis:at?'device_event':'unknown',correct:first.correct,blank:false,unknown:first.unknown===true,assisted:typeof first.help==='boolean'?first.help:null,workingPresent:hasText(first.working)});
      } else if (positive(a.deferredAt) || hasText(a.value) || hasText(a.working) || positive(a.startedAt)) {
        const at=positive(a.deferredAt)||positive(a.updatedAt)||positive(a.startedAt);
        push({id:unitId+':state',unitId,kind:'state',contentVersion:1,questionId:q.id,topic,skill,state:positive(a.deferredAt)?'deferred':hasText(a.value)||hasText(a.working)?'unfinished':'opened_only',updatedAt:at,timeBasis:at?'device_event':'unknown',workingPresent:hasText(a.working)});
      }
      if (a.method && typeof a.method.correct==='boolean') {
        const at=positive(a.method.at);
        push({id:unitId+':method',unitId,kind:'method_response',contentVersion:1,questionId:q.id+':reason',topic,skill,submittedAt:at,timeBasis:at?'device_event':'unknown',correct:a.method.correct,blank:false,unknown:false,assisted:typeof a.method.help==='boolean'?a.method.help:null});
      }
    }
    for (const lesson of data.lessons) lesson.practice.forEach((q,i)=>item({...q,id:'geometry-legacy-'+lesson.topic+'-'+i},state.practice?.[lesson.topic]?.[i],lesson.topic,'legacy_'+lesson.topic,i));
    for (const [id,a] of Object.entries(state.targeted?.items||{})) {
      const found=E.targetQuestion(bank,id); if(found)item(found.question,a,found.skill.topic,found.skill.id);
    }
    const mock=state.mock;
    if(mock){
      const unitId=prefix+':mock',startedAt=positive(mock.started),worked=(mock.working||[]).filter(hasText).length;
      if(mock.finished){
        const at=positive(mock.finishedAt),marks=mock.marks||[],fullyMarked=data.mock.every((q,i)=>/^\d+$/.test(String(marks[i]??''))&&Number(marks[i])<=q.marks.length);
        push({id:unitId+':result',unitId,kind:'mock_result',contentVersion:1,questionId:'geometry-mock-v1',startedAt,submittedAt:at,updatedAt:positive(mock.marksUpdatedAt)||at,timeBasis:at?'device_event':'unknown',mockMode:mock.mode==='practice'?'parts':'timed',expired:mock.expired===true,maxPoints:data.mock.reduce((n,q)=>n+q.marks.length,0),...(fullyMarked?{selfMarkedPoints:marks.reduce((n,v)=>n+Number(v),0)}:{}),itemsWorked:worked,workingPresent:worked>0});
      }else{
        const at=positive(mock.updatedAt)||startedAt;
        push({id:unitId+':state',unitId,kind:'state',contentVersion:1,questionId:'geometry-mock-v1',startedAt,updatedAt:at,timeBasis:at?'device_event':'unknown',state:worked?'unfinished':'opened_only',workingPresent:worked>0});
      }
    }
    return M.validate(out);
  }
  root.GeometryReportAdapter={project};
  if(typeof module==='object'&&module.exports)module.exports={project};
})(typeof globalThis!=='undefined'?globalThis:this);
