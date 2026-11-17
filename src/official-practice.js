(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OfficialPractice=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const DAY=86400000;
 const resources=[
  {id:'ielts',title:'Järgmine pikem võimalus: ametlik IELTS-i näidis',action:'Ava ametlik IELTS-i harjutus',href:'https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test',reason:'Proovi üht Academic Readingu või Listeningu osa enne vastuste vaatamist. Märgi, milline küsimusetüüp jäi raskeks. Kirjutamise ja rääkimise jaoks küsi oma vastusele tagasisidet.',note:'Vali üks osa, kui sul on rahulikum hetk. Siin saad alati jätkata lühiharjutustega; näidise tulemus ei ole ametlik IELTS-i band.'},
  {id:'sat',title:'Leia rahulik aeg ametlikuks SAT-i prooviks',action:'Vaata ametlikku SAT-i proovi',href:'https://satsuite.collegeboard.org/practice/practice-tests/bluebook',deviceHref:'https://bluebook.collegeboard.org/students/prepare-your-device/approved-devices',reason:'Tee üks seni lahendamata ja läbi vaatamata Bluebooki täistest. Tulemuse oskuste ülevaade aitab valida järgmist harjutamist. Hoia teine test hilisemaks võrdluseks.',note:'Planeeri pikem katkestusteta aeg toetatud arvutis või sobivas iPadis. iPhone’is saad jätkata Õpitasku lühiharjutustega.'},
  {id:'academic',title:'Tartu varuvariandiks: proovi üht ametlikku näidist',action:'Ava TÜ näidisülesanded',href:'https://ut.ee/sites/default/files/2023-02/Akadeemilise%20testi%20n%C3%A4idis%C3%BClesanded.pdf',answersHref:'https://ut.ee/sites/default/files/2023-03/Akadeemilise%20testi%20n%C3%A4idis%C3%BClesanded_vastused.pdf',reason:'Alusta ühest tabeli või diagrammi ülesandest. Lahenda ise, siis võrdle vastusega ja vaata, milline arutlussamm vajas abi.',note:'See on näidis, mitte terve adaptiivne test ega vastuvõtupunktide hinnang. Vastuseid vaata pärast oma katset.'}
 ];
 function suggest(modules,now,{model,bank,prefs={}}={}){
  if(!model||!Number.isSafeInteger(now)||now<=0)return null;
  const valid=key=>model.rows(modules[key],now);
  const english=valid('hendrik-ielts-v1').filter(a=>model.completed(a,true));
  const recent=items=>items.some(a=>a.completedAt>=now-7*DAY);
  const production=english.filter(a=>['writing','speaking'].includes(a.kind));
  const chemistry=valid('hendrik-chemistry-v1').filter(a=>model.completed(a));
  const sat=model.satPrompt(modules,bank,now,prefs);
  const eligible={ielts:recent(production),sat:!!sat,academic:recent(production)&&recent(chemistry)};
  // One optional invitation at a time. Familiarity is a navigation cue, never
  // a readiness threshold or a prerequisite to accessing the official links.
  const pref=id=>prefs.official?.[id]||{};
  if(Number.isSafeInteger(prefs.officialUntil)&&prefs.officialUntil>now)return null;
  return resources.find(r=>eligible[r.id]&&!(Number.isSafeInteger(pref(r.id).doneAt)&&pref(r.id).doneAt>0&&pref(r.id).doneAt<=now)&&!(Number.isSafeInteger(pref(r.id).until)&&pref(r.id).until>now))||null;
 }
 return {resources,suggest};
});
