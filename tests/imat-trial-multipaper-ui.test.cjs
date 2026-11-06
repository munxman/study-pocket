const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const E=require('../src/imat-trial-engine.js'),OLD=require('../src/imat-trial-content.js'),NEW=require('../src/imat-trial-transfer-content.js');
const NOW=Date.parse('2026-11-06T15:00:00Z');
function screen(initial=E.fresh(),search=''){
 let time=NOW,saved=JSON.stringify(initial),click,input,interval;
 const nodes={trial:{innerHTML:'',querySelector:()=>nodes.start,addEventListener:(name,fn)=>name==='input'?input=fn:click=fn},start:{disabled:true},'trial-save':{textContent:''},'confirm-submit':{innerHTML:''},'trial-clock':{textContent:''}};
 class Clock extends Date{static now(){return time;}}
 const context={ImatTrialEngine:E,IMAT_TRIAL:OLD,IMAT_TRIAL_TRANSFER:NEW,Date:Clock,URLSearchParams,location:{search},
   StudySyncModel:{keys:[E.KEY]},StudySync:{storage:{getItem:key=>key===E.KEY?saved:null,setItem:(_key,v)=>saved=v},subscribe(){}},
   document:{hidden:false,getElementById:id=>nodes[id],addEventListener(){}},setInterval:fn=>interval=fn};context.window=context;
 vm.createContext(context);vm.runInContext(fs.readFileSync('src/imat-trial.js','utf8'),context);
 return {get html(){return nodes.trial.innerHTML;},read:()=>JSON.parse(saved),click(dataset){click({target:{closest:()=>({dataset,disabled:false})}});},input(value){input({target:{id:'trial-guest-name',value}});},get canStart(){return !nodes.start.disabled;},tick(value){time=value;interval();}};
}
test('default is the new original simulation and starting requires explicit participant choice',()=>{
 const h=screen();assert.match(h.html,/Uued küsimused/);assert.match(h.html,/mitte varasemast eksamist/);assert.match(h.html,/data-do="start" class="primary" disabled/);
 assert.match(h.html,/Kas oled Hendrik\?/);assert.match(h.html,/Jah, olen Hendrik/);assert.match(h.html,/Ei, olen külaline/);
 h.click({do:'start'});assert.equal(h.read().sessions.length,0);
 h.click({participant:'learner'});h.click({do:'start'});const a=E.active(h.read());assert.equal(a.paper,NEW.id);assert.equal(a.participant,'learner');assert.ok(h.html.includes(NEW.questions[0].prompt));assert.ok(!h.html.includes(NEW.questions[0].explanation));
 h.click({answer:String(NEW.questions[0].answer)});h.click({do:'confirm'});assert.match(h.html,/Õigeid vastuseid pole veel näidatud/);assert.ok(!h.html.includes(NEW.questions[0].explanation));
 h.click({do:'second'});assert.ok(!h.html.includes(NEW.questions[0].explanation));h.click({do:'confirm'});assert.ok(h.html.includes(NEW.questions[0].explanation));assert.equal(E.active(h.read()).timedResult.correct,1);
});
test('new guest trials require a nickname and show it safely in their result and history',()=>{
 const h=screen();h.click({participant:'guest'});assert.match(h.html,/Sinu nimi või hüüdnimi/);
 h.click({do:'start'});assert.equal(h.read().sessions.length,0);h.input(' \n\t ');assert.equal(h.canStart,false);h.click({do:'start'});assert.equal(h.read().sessions.length,0);
 h.input('  QA  külaline <b>  ');assert.equal(h.canStart,true);h.click({do:'start'});const a=E.active(h.read());assert.equal(a.participant,'guest');assert.equal(a.participantName,'QA külaline <b>');
 h.click({do:'confirm'});h.click({do:'review'});assert.match(h.html,/QA külaline &lt;b&gt;/);assert.doesNotMatch(h.html,/QA külaline <b>/);
 h.click({do:'leave'});assert.match(h.html,/QA külaline &lt;b&gt;/);assert.match(h.html,/aria-pressed="false">Jah, olen Hendrik/);
});
test('choosing the learner after typing a guest nickname does not retain that nickname',()=>{
 const h=screen();h.click({participant:'guest'});h.input('QA külaline');h.click({participant:'learner'});h.click({do:'start'});
 assert.equal(E.active(h.read()).participant,'learner');assert.equal(E.active(h.read()).participantName,undefined);
});
test('the new-paper entry resumes an old trial with the old questions and original expiry',()=>{
 const state=E.fresh(),a=E.start(state,OLD,NOW-600000);E.answer(a,OLD.questions[0].id,OLD.questions[0].answer,NOW-1000);
 const h=screen(state,'?paper='+NEW.id);assert.match(h.html,/Varasem proov on veel pooleli/);assert.ok(h.html.includes(OLD.questions[0].prompt));assert.ok(!h.html.includes(NEW.questions[0].prompt));
 assert.equal(E.active(h.read()).participant,undefined);h.tick(a.deadline+1000);assert.equal(E.active(h.read()).timedSubmittedAt,a.deadline);assert.equal(E.active(h.read()).timedResult.correct,1);assert.equal(E.active(h.read()).results[0].id,OLD.questions[0].id);
});
test('reviewed history opens with its original bank and remains unchanged when the fresh default is offered',()=>{
 const s=E.fresh(),a=E.start(s,OLD,NOW-10000);E.answer(a,OLD.questions[0].id,OLD.questions[0].answer,NOW-9000);E.freeze(a,OLD,NOW-8000);E.review(a,OLD,NOW-7000);
 const before=structuredClone(a),h=screen(s);assert.match(h.html,/Uued küsimused/);assert.deepEqual(h.read().sessions[0],before);
 h.click({history:a.id});assert.ok(h.html.includes(OLD.questions[0].explanation));assert.match(h.html,/Ametlik IMAT 2025/);assert.ok(!h.html.includes(NEW.questions[0].explanation));assert.deepEqual(h.read().sessions[0],before);
});
test('guest choice remains explicit and selecting the old official set never calls it a fresh official paper',()=>{
 const h=screen();h.click({paper:OLD.id});assert.match(h.html,/2025/);h.click({participant:'guest'});h.input('QA külaline');h.click({do:'start'});const a=E.active(h.read());assert.equal(a.paper,OLD.id);assert.equal(a.participant,'guest');h.click({do:'confirm'});h.click({do:'review'});assert.match(h.html,/Külalise katse jääb eraldi/);
});
test('an unavailable historical paper stays unchanged instead of being scored against the new simulation',()=>{
 const s=E.fresh(),a=E.start(s,OLD,NOW-3600000);a.paper='unavailable-paper';const before=structuredClone(s),h=screen(s);
 assert.match(h.html,/Neid ei hinnata teise komplekti järgi/);h.tick(NOW+3600000);assert.deepEqual(h.read(),before);
});
