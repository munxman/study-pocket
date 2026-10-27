'use strict';
(function(root){
  const keys=['hendrik-imat-bio-v1','hendrik-bioloogia-v1','hendrik-akadeemiline-v1','hendrik-tekst-v1','hendrik-nerves-feedback-v1','hendrik-bio-basics-v1','hendrik-ielts-v1','hendrik-study-chain-v1'];
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
  function rank(s){return s?.completedAt||s?.finished||s?.status==='done'?10000+(s?.answers?.length||0):(s?.answers?.length||s?.solo?.length||0)*100+({lesson:0,intro:0,guide:1,question:2,explanation:3,check:4,feedback:3,retry:4,finish:5,reflection:6,done:7}[s?.stage]||0)+(s?.retryAnswers?.length||0);}
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
  function merge(module,base,local,remote){
    if(module==='hendrik-study-chain-v1'){
      const repairs={};for(const x of [remote,local])for(const [d,t] of Object.entries(x?.repairs||{}))if(/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(t)&&t>0)repairs[d]=Math.min(repairs[d]||Infinity,t);
      return {version:1,repairs};
    }
    if(module==='hendrik-ielts-v1'){const english=root.IELTSEngine||(typeof require==='function'?require('./ielts-engine.js'):null);if(english)return english.merge(base,local,remote);}
    base=normalize(module,base);local=normalize(module,local);remote=normalize(module,remote);
    if(!local)return clone(remote);if(!remote)return clone(local);
    const s=mergeObject(base,local,remote);
    if(module===keys[0]||module===keys[5]){
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
