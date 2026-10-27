(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BackupModel=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 const FORMAT='study-pocket-v1',STORE='study-pocket:saved:v1';
 const keys=['hendrik-bio-basics-v1','hendrik-imat-bio-v1','hendrik-ielts-v1','hendrik-study-chain-v1'];
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const clone=x=>JSON.parse(JSON.stringify(x));
 function safe(value,depth=0){if(depth>40)throw Error('Backup is too deeply nested');if(typeof value==='number'&&!Number.isFinite(value))throw Error('Invalid number');if(typeof value==='string'&&value.length>500000)throw Error('Text is too long');if(Array.isArray(value)){if(value.length>50000)throw Error('Too many records');for(const x of value)safe(x,depth+1);}else if(object(value)){for(const [k,v]of Object.entries(value)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Invalid field');safe(v,depth+1);}}}
 function validateModule(key,value){
  if(!keys.includes(key)||!object(value)||value.version!==1)throw Error('Unknown study format');safe(value);
  if(key===keys[3]){if(!object(value.repairs))throw Error('Invalid chain');return clone(value);}
  if(!Array.isArray(value.sessions)||!object(value.cards))throw Error('Incomplete study history');
  const seen=new Set();for(const a of value.sessions){if(!object(a)||typeof a.id!=='string'||!a.id||seen.has(a.id))throw Error('Invalid or duplicate session');seen.add(a.id);}
  if(key===keys[2]&&!Array.isArray(value.evaluations))throw Error('Missing English feedback');
  if(key!==keys[2]&&(!Number.isSafeInteger(value.serial)||value.serial<0))throw Error('Invalid lesson counter');
  return clone(value);
 }
 function fresh(now=Date.now()){return {format:FORMAT,version:1,updatedAt:now,modules:{},transferNote:'Browser-local practice. Not automatically synced to the main app.'};}
 function parse(text){if(typeof text!=='string'||text.length>20000000)throw Error('Backup file is too large');const d=JSON.parse(text);safe(d);if(!object(d)||d.format!==FORMAT||d.version!==1||!object(d.modules)||!Number.isFinite(d.updatedAt))throw Error('This is not a Study Pocket backup');const out=fresh(d.updatedAt);for(const [k,v]of Object.entries(d.modules))out.modules[k]=validateModule(k,v);return out;}
 function merge(a,b,mergeModule,now=Date.now()){const out=fresh(now);for(const k of keys){const left=a.modules[k],right=b.modules[k];if(left&&right)out.modules[k]=validateModule(k,mergeModule(k,null,left,right));else if(left||right)out.modules[k]=validateModule(k,left||right);}return out;}
 function summary(d){return keys.slice(0,3).map(key=>{const all=d.modules[key]?.sessions||[],done=all.filter(a=>a.completedAt),answered=all.filter(a=>a.answeredAt||a.completedAt||Object.values(a.answers||{}).some(Boolean)||Object.values(a.texts||{}).some(x=>String(x).trim()));return {key,completed:done.length,unfinished:answered.filter(a=>!a.completedAt).length,opened:all.length-answered.length};});}
 return {FORMAT,STORE,keys,fresh,parse,merge,summary,validateModule,clone};
});
