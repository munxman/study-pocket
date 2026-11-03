const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/teachback-model.js'),B=require('../src/basics-content.js'),I=require('../src/imat-content.js');
const T=Date.UTC(2026,10,3,18),D=86400000;
const blank=()=>({sessions:[],cards:{}});
function question(concept){return {id:'active-'+concept,concept,startedAt:T,stage:'question',assisted:false,selected:null};}
function done(concept,at,fields={}){return {id:concept+'-'+at,concept,stage:'done',answeredAt:at,completedAt:at+10,questionIndex:0,correct:true,checkCorrect:true,delayedProbe:true,assisted:false,...fields};}
function rec(module,sessions,history=[],otherState=blank(),extra={}){
  const session=sessions.at(-1),state={sessions,cards:{[session.concept]:{attempts:session.answeredAt?1:0,interval:3*D,due:T+3*D}}};
  return M.recommend({module,session,state,otherState,history,now:T+50,...extra});
}
test('Every current biology concept has an appropriate field; genetics maps across both course languages',()=>{
 for(const [m,b] of [['basics',B],['imat',I]])for(const c of b.concepts)assert.ok(M.groupFor(m,c.id),m+'/'+c.id);
 assert.equal(M.groupFor('hendrik-bio-basics-v1','chromosomes'),M.groupFor('imat','dna-rna'));
 assert.equal(M.groupFor('basics','no-such-topic'),null);
});
test('An entry is possible before first exposure; earlier translated study, cards, help, or absent data prevent retrospective baseline',()=>{
 const q=question('dna-rna');
 assert.equal(rec('imat',[q]).stage,'entry');
 for(const other of [null,{sessions:[done('dna_structure',T-D)]},{sessions:[],cards:{chromosomes:{lastExposure:T-D}}}])assert.equal(rec('imat',[q],[],other),null);
 for(const fields of [{assisted:true},{selected:2},{taughtAt:T},{stage:'lesson'},{closed:true}])assert.equal(rec('imat',[{...q,...fields}]),null);
 const before={module:'imat',group:'genes',sessionId:q.id,state:{sessions:[q]},otherState:blank()};
 assert.equal(M.isEntryFresh(before),true);
 assert.equal(M.isEntryFresh({...before,state:{sessions:[q,done('replication',T+20)]}}),false);
});
test('Invitations are optional and limited across modules by Tallinn day. Only rebinding the original offer retains it',()=>{
 const q=question('xlinked'), h={module:'basics',group:'genes',stage:'entry',sessionId:'other',at:T};
 assert.equal(rec('imat',[q],[h]),null);
 const yesterday={...h,at:T-D};assert.equal(rec('imat',[q],[yesterday]).stage,'entry');
 const same={module:'imat',group:'inheritance',stage:'entry',sessionId:q.id,at:T};
 assert.equal(rec('imat',[q],[same]).stage,'entry');
 assert.equal(rec('imat',[q],[{...same,skipped:true}]),null);
});
test('Two misses on distinct study days trigger optional repair, even after a correct supported followup or before unfinished legacy retry',()=>{
 const older=done('xlinked',T-D,{correct:false}),now=done('xlinked',T,{checkCorrect:false});
 assert.equal(rec('imat',[older,now]).stage,'repair');
 assert.equal(rec('imat',[older,{...now,correct:false,checkCorrect:true}]).stage,'repair');
 assert.equal(rec('imat',[older,{...now,correct:false,stage:'feedback',completedAt:0}]).stage,'repair');
 assert.equal(rec('imat',[older,{...now,correct:false,stage:'retry',retrySubmitted:true,completedAt:0}]).stage,'repair');
 assert.equal(rec('imat',[{...older,answeredAt:T-60000},now]),null);
 assert.equal(rec('imat',[{...older,id:now.id},now]),null);
 assert.equal(rec('imat',[done('autosomal',T-D,{correct:false}),now]),null);
 assert.equal(rec('imat',[done('xlinked',T-30*D,{correct:false}),now]),null);
});
test('Consolidation uses multiple dates, concepts and actual spacing. Older missing flags and support earn no delayed evidence',()=>{
 const cases=[done('dna-rna',T-4*D,{delayedProbe:null}),done('replication',T-2*D),done('translation',T)];
 const base=rec('imat',cases);assert.equal(base.stage,'consolidation');assert.equal(base.baseline,'missing');assert.equal(base.lang,'en-GB');
 const h={stage:'entry',module:'imat',group:'genes',at:T-8*D,completed:true,entryFresh:true};
 assert.equal(rec('imat',cases,[h]).baseline,'available');
 for(const missing of [{...h,entryFresh:false},{...h,module:'basics'}])assert.equal(rec('imat',cases,[missing]).baseline,'missing');
 for(const patch of [{delayedProbe:null},{assisted:true},{extraPractice:true},{correct:false},{checkCorrect:false}])assert.equal(rec('imat',[cases[0],{...cases[1],...patch},cases[2]]),null);
 assert.equal(rec('imat',cases,[],blank(),{state:{sessions:cases,cards:{translation:{due:T+100,interval:D}}}}),null);
 assert.equal(rec('imat',cases,[{...h,stage:'repair',at:T-D}]).stage,'consolidation');
});
test('One-concept fields require two known question indices across independent delayed dates before consolidation',()=>{
 const old=done('immunity',T-3*D),next=done('immunity',T,{questionIndex:1});
 assert.equal(rec('basics',[old,next]).stage,'consolidation');
 assert.equal(rec('basics',[{...old,questionIndex:undefined},next]),null);
 assert.equal(rec('basics',[{...old,questionIndex:1},next]),null);
});
