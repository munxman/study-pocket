'use strict';
(function(root){
  const keys=['hendrik-imat-bio-v1','hendrik-bioloogia-v1','hendrik-akadeemiline-v1','hendrik-tekst-v1','hendrik-nerves-feedback-v1','hendrik-bio-basics-v1','hendrik-ielts-v1','hendrik-study-chain-v1','hendrik-imat-trial-v1','hendrik-maths-v1','hendrik-physics-v1','hendrik-chemistry-v1','hendrik-video-practice-v1','hendrik-geometry-sprint-v1'];
  const clone=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const clean=x=>object(x)?Object.fromEntries(Object.entries(x).filter(([k])=>!['__proto__','constructor','prototype'].includes(k))):x;
  function normalize(module,value){
    const s=clone(value);if(!s)return s;
    if(module===keys[0]) for(const session of s.sessions||[]){
      if(/^i\d+$/.test(session.id)){
        const old=session.id;session.id=old+'-'+Number(session.startedAt).toString(36)+'-'+session.concept;
        if(s.activeId===old)s.activeId=session.id;
      }
    }
    return s;
  }
  function rank(s){return s?.completedAt||s?.finished||s?.status==='done'?10000+(s?.answers?.length||0):(s?.kind==='quantitative'?((s.answeredAt?100:0)+(s.assisted?10:0)):0)+(s?.answers?.length||s?.solo?.length||0)*100+({lesson:0,intro:0,guide:1,question:2,explanation:3,check:4,feedback:3,retry:4,finish:5,reflection:6,done:7}[s?.stage]||0)+(s?.retryAnswers?.length||0);}
  function record(base,local,remote){
    if(!local)return clone(remote);if(!remote)return clone(local);
    if(same(local,base))return clone(remote);if(same(remote,base))return clone(local);
    const a=rank(local),b=rank(remote);if(a!==b)return clone(a>b?local:remote);
    const v=mergeObject(base,local,remote);
    if(local.closed||remote.closed)v.closed=true;
    if(local.moreChosen||remote.moreChosen)v.moreChosen=true;
    return v;
  }
  function records(base=[],local=[],remote=[]){
    const b=new Map(base.map(s=>[s.id,s])),l=new Map(local.map(s=>[s.id,s])),r=new Map(remote.map(s=>[s.id,s]));
    return [...new Set([...r.keys(),...l.keys()])].map(id=>record(b.get(id),l.get(id),r.get(id))).sort((a,b)=>(a.startedAt||a.createdAt||a.started||0)-(b.startedAt||b.createdAt||b.started||0)||String(a.id).localeCompare(String(b.id)));
  }
  function mergeObject(base,local,remote){
    if(same(local,remote)||same(remote,base))return clone(local);
    if(same(local,base))return clone(remote);
    if(!object(local)||!object(remote))return clone(local===undefined?remote:local);
    const out={};for(const k of new Set([...Object.keys(clean(remote)),...Object.keys(clean(local))])){
      if(k==='sessions'||k==='attempts')out[k]=records(base?.[k],local[k]||[],remote[k]||[]);
      else if(k==='active')out[k]=record(base?.[k],local[k],remote[k]);
      else if(k==='support'){
        // Keep one coherent prerequisite probe; never combine one device's
        // selected answer with another probe's identity or completion time.
        const l=local[k],r=remote[k];
        if(!l||!r)out[k]=clone(l||r);
        else out[k]=clone([l,r].sort((a,b)=>(b.answeredAt||0)-(a.answeredAt||0)||(b.startedAt||0)-(a.startedAt||0)||JSON.stringify(a).localeCompare(JSON.stringify(b)))[0]);
      }
      else if(k==='cards'){
        out[k]={};for(const id of new Set([...Object.keys(clean(remote[k]||{})),...Object.keys(clean(local[k]||{}))])){
          const l=local[k]?.[id],r=remote[k]?.[id];if(!l||!r){out[k][id]=clone(l||r);continue;}
          const lt=Math.max(l.lastAt||0,l.lastExposure||0),rt=Math.max(r.lastAt||0,r.lastExposure||0);
          // Never let an older offline answer erase a more recent lapse.
          out[k][id]=clone(lt!==rt?(lt>rt?l:r):((l.due||0)<=(r.due||0)?l:r));
        }
      }else if(k==='serial')out[k]=Math.max(local[k]||0,remote[k]||0);
      else out[k]=mergeObject(base?.[k],local[k],remote[k]);
    }return out;
  }
function mergeTrial(base,local,remote){
 if(!local)return clone(remote);if(!remote)return clone(local);
 const out={version:1,serial:0,cards:{},sessions:[],activeId:null},map=new Map();
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

function mergeVideo(base,local,remote){
 if(!local)return clone(remote);if(!remote)return clone(local);
 const out=mergeObject(base,{...local,sessions:[]},{...remote,sessions:[]}),map=new Map();
 for(const incoming of [...remote.sessions,...local.sessions]){
  const old=map.get(incoming.id);if(!old){map.set(incoming.id,clone(incoming));continue;}
  // An ID denotes one immutable video/question. Never splice another question's
  // answer into it, including when merging an old offline device or backup.
  const prior=base?.sessions?.find(s=>s.id===incoming.id)||old;
  const sameIdentity=s=>s.videoId===prior.videoId&&s.questionId===prior.questionId&&s.questionIndex===prior.questionIndex;
  const candidates=[old,incoming].filter(sameIdentity);
  if(!candidates.length){map.set(incoming.id,clone(prior));continue;}
  candidates.sort((a,b)=>Number(!!b.answeredAt)-Number(!!a.answeredAt)||(a.answeredAt&&b.answeredAt?a.answeredAt-b.answeredAt:Math.max(b.helpedAt||0,b.openedAt||0,b.startedAt||0)-Math.max(a.helpedAt||0,a.openedAt||0,a.startedAt||0))||JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const winner=candidates.length===2&&!candidates.some(s=>s.answeredAt)?mergeObject(prior,incoming,old):clone(candidates[0]);
  winner.exposures=[...new Map(candidates.flatMap(s=>s.exposures||[]).map(e=>[e.kind+':'+e.at,clone(e)])).values()].sort((a,b)=>a.at-b.at||a.kind.localeCompare(b.kind));
  winner.lastExposureAt=Math.max(...candidates.map(s=>s.lastExposureAt||0));
  // A help exposure before an answer remains support after reconnection. An
  // opening after the saved answer cannot retrospectively change that answer.
  const helps=candidates.map(s=>s.helpedAt).filter(t=>Number.isFinite(t)&&t>0&&(!winner.answeredAt||t<=winner.answeredAt));
  if(helps.length){winner.helpedAt=Math.min(...helps);winner.assisted=true;winner.independent=false;winner.delayedProbe=false;}
  const opens=candidates.map(s=>s.openedAt).filter(t=>Number.isFinite(t)&&t>0);if(opens.length)winner.openedAt=Math.min(...opens);
  map.set(incoming.id,winner);
 }
 out.sessions=[...map.values()].sort((a,b)=>a.startedAt-b.startedAt||String(a.id).localeCompare(String(b.id)));
 const active=out.sessions.find(s=>s.id===out.activeId);
 if(!active)out.activeId=null;
 if(!out.activeId)out.activeId=out.sessions.filter(s=>s.stage==='question').at(-1)?.id||null;
 return out;
}

  function merge(module,base,local,remote){
    if(module==='hendrik-geometry-sprint-v1')return (root.GeometryReportModel||(typeof require==='function'?require('./geometry-report-model.js'):null)).merge(base,local,remote);
    if(module==='hendrik-video-practice-v1')return mergeVideo(base,local,remote);
    if(module==='hendrik-imat-trial-v1')return mergeTrial(base,local,remote);
    if(module==='hendrik-study-chain-v1'){
      const repairs={};for(const x of [remote,local])for(const [d,t] of Object.entries(x?.repairs||{}))if(/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(t)&&t>0)repairs[d]=Math.min(repairs[d]||Infinity,t);
      return {version:1,repairs};
    }
    if(module==='hendrik-ielts-v1'){const english=root.IELTSEngine||(typeof require==='function'?require('./ielts-engine.js'):null);if(english)return english.merge(base,local,remote);}
    base=normalize(module,base);local=normalize(module,local);remote=normalize(module,remote);
    if(!local)return clone(remote);if(!remote)return clone(local);
    const s=mergeObject(base,local,remote);
    if(module===keys[0]||module===keys[5]||module===keys[9]||module===keys[10]){
      const a=s.sessions.find(a=>a.id===s.activeId);
      if(!a||a.closed)s.activeId=null;
      if(!s.activeId){const open=s.sessions.filter(a=>!a.closed&&a.stage!=='done');s.activeId=open.at(-1)?.id||null;}
    }else if(module===keys[1]||module===keys[3]){
      if(s.active&&s.sessions.some(a=>a.id===s.active.id))s.active=null;
    }else if(module===keys[4]){
      if((remote.updatedAt||0)>(local.updatedAt||0))return clone(remote);
    }
    return s;
  }
  const api={keys,same,clone,normalize,merge};root.StudySyncModel=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
