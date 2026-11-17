(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.MedicalNext=api;})(typeof globalThis!=='undefined'?globalThis:this,root=>{
 'use strict';
 const keys=['hendrik-ielts-v1','hendrik-chemistry-v1','hendrik-imat-bio-v1','hendrik-bio-basics-v1','hendrik-physics-v1','hendrik-maths-v1'];
 const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
 function choose(storage,currentKey,currentState,lang='et',now=Date.now(),deps=root){
  const fallback={href:'./index.html',label:lang==='en'?'My next study step':'Järgmine soovitus'};
  try{
   if(!deps.MedicalPlan||!deps.QuantEngine||!deps.ChemistryContent)return fallback;
   const modules={};
   for(const key of keys){
    const value=key===currentKey?currentState:JSON.parse(storage.getItem(key)||'null');
    if(value!=null&&(!record(value)||!Array.isArray(value.sessions)))return fallback;
    if(value)modules[key]=value;
   }
   const chem=deps.QuantEngine.restore(modules['hendrik-chemistry-v1'],deps.ChemistryContent);
   const chemistry=deps.QuantEngine.recommendSkill(chem,deps.ChemistryContent,now);
   const chemistryAvailable=!!deps.QuantEngine.candidate(chem,deps.ChemistryContent,now);
   const prefs=JSON.parse((deps.localStorage||storage).getItem('opitasku-medical-guidance-v1')||'{}');
   const next=deps.MedicalPlan.build(modules,now,{chemistry,chemistryAvailable,prefs:record(prefs)?prefs:{}}).primary;
   if(!next||!/^\.\/[a-z0-9-]+\.html(?:[?#][a-z0-9_=&%#-]*)?$/i.test(next.href))return fallback;
   const labels=lang==='en'?{ielts:'Next: a short IELTS step',chemistry:'Next: one chemistry skill',biology:'Next: biology practice',physics:'Next: your physics step',maths:'Next: your maths step'}:{ielts:'Edasi: lühike IELTS-i samm',chemistry:'Edasi: üks keemiaoskus',biology:'Edasi: bioloogia',physics:'Edasi: pooleli füüsika',maths:'Edasi: pooleli matemaatika'};
   return {href:next.href,label:labels[next.subject]||fallback.label};
  }catch{return fallback;}
 }
 return {choose};
});
