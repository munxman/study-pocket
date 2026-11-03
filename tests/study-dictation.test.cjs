const test = require('node:test');
const assert = require('node:assert/strict');
const factory = require('../src/study-dictation.js');

function field(value, start, end = start) {
  return {
    value,selectionStart:start,selectionEnd:end,maxLength:-1,inputs:0,
    setRangeText(s, start, end) { this.value=this.value.slice(0,start)+s+this.value.slice(end); },
    setSelectionRange(start,end) { this.selectionStart=start;this.selectionEnd=end; },
    dispatchEvent(e){assert.equal(e.type,'input');assert.equal(e.bubbles,true);this.inputs++;}
  };
}
function setup(opts={}) {
  const doc={activeElement:null};
  class Recognition {
    constructor(){fake.last=this;}
    start(){this.onstart?.();}
    stop(){this.stopRequested=true;}
    abort(){this.aborted=true;}
    result(rows, resultIndex=0){this.onresult?.({resultIndex,results:rows.map(([transcript,isFinal])=>({0:{transcript},isFinal}))});}
  }
  const fake={document:doc,Event,...(opts.unsupported?{}:{webkitSpeechRecognition:Recognition})};
  let box=field('Before after',6), notices=[];
  const run = new (factory(fake).Dictation)('et-EE',()=>box,()=>notices.push(run.status),()=>!opts.blocked);
  return {fake,run,notices,get box(){return box;},setBox(f){box=f;},get api(){return fake.last;}};
}
test('Starts only on request, offers interim preview, inserts each final at caret and sends input',()=>{
  const f=setup();assert.equal(f.api,undefined);
  f.run.start();
  assert.equal(f.api.lang,'et-EE');assert.equal(f.api.continuous,true);
  f.api.result([['üks',false]]);assert.equal(f.box.value,'Before after');assert.equal(f.run.interim,'üks');
  f.api.result([['üks',true],['kak',false]]);
  assert.equal(f.box.value,'Before üks after');assert.equal(f.box.inputs,1);
  f.api.result([['üks',true],['kaks',true]]);assert.equal(f.box.value,'Before üks kaks after');assert.equal(f.box.inputs,2);
  f.run.stop();assert.equal(f.api.stopRequested,true);assert.equal(f.run.active,true);
  f.api.result([['üks',true],['kaks',true],['kolm.',true]],2);
  f.api.onend();assert.equal(f.run.active,false);assert.equal(f.box.value,'Before üks kaks kolm. after');
});
test('Protects selected text and restores the insertion point across a same-session redraw',()=>{
  const f=setup();f.setBox(field('A cat sits',2,5));f.run.start();
  f.api.result([['here',true]]);assert.equal(f.box.value,'A cat here sits');
  f.setBox(field(f.box.value,0));f.api.result([['here',true],['now',true]],1);
  assert.equal(f.box.value,'A cat here now sits');
  f.box.setSelectionRange(0,0);f.api.result([['here',true],['now',true],['yes',true]],2);
  assert.equal(f.box.value,'yes A cat here now sits');
});
test('Cancelled or stale results cannot mutate a new session or field',()=>{
  const f=setup();f.run.start(); const old=f.api, delayed=old.onresult;
  f.run.finish('end',true);assert.equal(old.aborted,true);
  f.setBox(field('new answer',0));f.run.start();
  delayed({results:[{0:{transcript:'old answer'},isFinal:true}],resultIndex:0});
  assert.equal(f.box.value,'new answer');
  f.api.result([['valid',true]]);assert.equal(f.box.value,'valid new answer');
});
test('Unsupported browser, competing recorder, permissions and offline service fail without overwriting work',()=>{
  for (const [opts,status] of [[{unsupported:true},'unavailable'],[{blocked:true},'blocked']]) {
    const f=setup(opts);f.run.start();assert.equal(f.api,undefined);assert.equal(f.run.status,status);
  }
  for (const [err,status] of [['not-allowed','permission'],['network','network'],['language-not-supported','language']]) {
    const f=setup();f.run.start();const api=f.api;api.onerror({error:err});
    assert.equal(f.run.active,false);assert.equal(f.run.status,status);assert.equal(f.box.value,'Before after');
  }
});
test('Stops on capacity or unavailable field, preserving the existing response',()=>{
  const f=setup();f.run.start();f.box.maxLength=f.box.value.length;
  f.api.result([['larger',true]]);assert.equal(f.box.value,'Before after');assert.equal(f.run.status,'limit');
  f.box.readOnly=true;f.run.start();assert.equal(f.run.status,'field');assert.equal(f.run.active,false);
});
test('Language selection is read on tap; unsupported browser’s button focuses its editable field',()=>{
  function mount(supported) {
    class Node {
      constructor(){this.dataset={};this.children=[];this.listeners={};this.attributes={};this.isConnected=true;}
      setAttribute(k,v){this.attributes[k]=v;}
      getAttribute(k){return this.attributes[k];}
      addEventListener(k,fn){this.listeners[k]=fn;}
      insertAdjacentHTML(){}
      append(...children){this.children.push(...children);}
      replaceChildren(...children){this.children=children;}
      getRootNode(){return doc;}
    }
    const box={...field('Text',4),tagName:'TEXTAREA',focus(){this.focused=true;}};
    const doc={documentElement:{lang:'et'},createElement:()=>new Node(),getElementById:id=>id==='target'?box:null,
      dispatchEvent:()=>true,addEventListener(){}};
    let Element, api;
    const root={document:doc,Event,CustomEvent,HTMLElement:Node,addEventListener(){},
      customElements:{get(){return null;},define(name,constructor){Element=constructor;}}};
    if(supported)root.webkitSpeechRecognition=class {start(){api=this;this.onstart();}stop(){this.onend();}};
    factory(root).install();
    const widget=new Element();widget.dataset.target='target';widget.setAttribute('lang','en-GB');widget.connectedCallback();
    return {box,widget,get api(){return api;}};
  }
  const yes=mount(true);yes.widget.setAttribute('lang','et-EE');
  yes.widget.control.listeners.click();assert.equal(yes.api.lang,'et-EE');assert.equal(yes.widget.active,true);
  yes.widget.control.listeners.click();assert.equal(yes.widget.active,false);
  yes.widget.setAttribute('lang','en-GB');yes.widget.control.listeners.click();assert.equal(yes.api.lang,'en-GB');
  const no=mount(false);no.widget.control.listeners.click();assert.equal(no.box.focused,true);assert.equal(no.widget.active,false);
});
