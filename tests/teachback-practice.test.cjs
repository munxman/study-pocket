const {test}=require('node:test');
const assert=require('node:assert/strict');
const {prepare}=require('../src/teachback-practice.js');
const engine=require('../src/imat-engine.js');
const bank=require('../src/imat-english.js')(require('../src/imat-content.js'));

test('returning for chosen practice preserves the unfinished block until voluntary continuation',()=>{
  const state=engine.fresh();
  const first=engine.start(state,bank,1,'enzyme');
  let cleaned;
  const route=prepare({concepts:bank.concepts,current:()=>engine.active(state),
    url:new URL('https://example.test/imat.html?practice=xlinked#learn'),replaceUrl:url=>{cleaned=url;},
    open:id=>{engine.stop(state);engine.start(state,bank,1000,id,true);}
  });
  assert.ok(route.resumeOrStart());
  assert.equal(engine.active(state).id,first.id);
  assert.equal(route.pending.id,'xlinked');
  assert.equal(cleaned,undefined);
  first.stage='done';
  assert.ok(route.resumeOrStart());
  assert.equal(engine.active(state).concept,'xlinked');
  assert.equal(cleaned,'/imat.html#learn');
  assert.equal(route.resumeOrStart(),false);
});
test('invalid requested practice cannot replace the normal entry point',()=>{
  const route=prepare({concepts:bank.concepts,url:new URL('https://example.test/?practice=missing'),
    current(){throw Error('Unexpected state access');},open(){throw Error('Unexpected session');}});
  assert.equal(route.resumeOrStart(),false);
});
