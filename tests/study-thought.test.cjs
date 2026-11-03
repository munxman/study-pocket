const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const code = fs.readFileSync('src/study-thought.js','utf8');
function browser(store) {
  const tags = new Map();
  class Node {
    constructor(tag) { this.tag=tag; this.children=[]; this.dataset={}; this.events={}; this.attrs={}; }
    append(...items) { this.children.push(...items); }
    prepend(...items) { this.children.unshift(...items); }
    addEventListener(event, callback) { this.events[event]=callback; }
    get firstChild() { return this.children[0]; }
    hasAttribute(name) { return name in this.attrs; }
    setAttribute(name,value) { this.attrs[name]=value; }
    dispatchEvent(event) { this.events[event.type]?.(); }
  }
  const clipboard = [];
  vm.runInNewContext(code, {
    window:{customElements:true}, customElements:{get:k=>tags.get(k),define:(k,v)=>tags.set(k,v)},
    document:{createElement:t=>new Node(t)}, HTMLElement:Node, CustomEvent:class{constructor(type){this.type=type;}},
    localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
    navigator:{clipboard:{writeText:async t=>clipboard.push(t)}}
  });
  return {clipboard, render(id,lang='et-EE') {
    const note=new (tags.get('study-thought'))();
    note.dataset={session:id,topic:'X-linked inheritance'}; note.lang=lang;
    note.connectedCallback();
    const elements=note.children.flatMap(function flatten(node){return [node,...node.children.flatMap(flatten)];});
    return {area:elements.find(x=>x.tag==='textarea'),dictation:elements.find(x=>x.tag==='study-dictation'),lang:elements.find(x=>x.tag==='select'),status:elements.find(x=>x.tag==='p'),button:label=>elements.find(x=>x.textContent===label)};
  }};
}
test('After a choice redraw or reload a dictated and edited note retains its scope, language and text; sharing is explicit', async()=>{
  const store=new Map([['study-pocket:saved:v1','unchanged']]),first=browser(store);
  let n=first.render('imat-test','en-GB');
  assert.equal(n.dictation.dataset.target,n.area.id);
  assert.equal(n.dictation.dataset.session,'imat-test');
  assert.equal(n.dictation.lang,'en-GB');
  n.lang.value='et-EE'; n.lang.events.change();
  n.area.value='Isa annab pojale Y-kromosoomi'; n.area.events.input();
  n=first.render('imat-test','en-GB'); assert.equal(n.dictation.lang,'et-EE'); assert.equal(n.area.value,'Isa annab pojale Y-kromosoomi');
  const reloaded=browser(store);
  n=reloaded.render('imat-test','en-GB');
  assert.equal(n.area.value,'Isa annab pojale Y-kromosoomi');
  assert.equal(reloaded.render('basics-test').area.value,'');
  assert.equal(reloaded.render('demo:imat-test').area.value,'');
  assert.deepEqual(reloaded.clipboard,[]);
  n.area.value+='.'; n.area.events.input();
  await n.button('Kopeeri tekst').events.click();
  assert.deepEqual(reloaded.clipboard,['X-linked inheritance\nIsa annab pojale Y-kromosoomi.']);
  n.button('Kustuta tekst').events.click();
  assert.equal(reloaded.render('imat-test').area.value,'');
  assert.deepEqual([...store],[['study-pocket:saved:v1','unchanged']]);
});
test('A failed write is labelled and allows copying or editing across a redraw',()=>{
  const store=new Map();store.set=()=>{throw Error('quota');};const b=browser(store),a=b.render('mat');
  a.area.value='draft';a.area.events.input();assert.match(a.status.textContent,/ei saanud püsivalt/);
  assert.equal(b.render('mat').area.value,'draft');
});
