const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const SOURCE=fs.readFileSync('src/start-entry.js','utf8'),BASE='https://example.test/study-pocket/';
test('entry opens study synchronously without consulting tabs, updates, network or learner storage',()=>{
 for(const suffix of ['', '?private-code=secret#pair=private']){
  const navigations=[],historyCalls=[];
  const c={URL,location:{href:BASE+'start.html'+suffix,pathname:'/study-pocket/start.html',replace:x=>navigations.push(x)},history:{replaceState:(_a,_b,x)=>historyCalls.push(x)}};
  for(const key of ['navigator','fetch','localStorage','sessionStorage','indexedDB','caches','setTimeout'])Object.defineProperty(c,key,{get(){throw Error('Study entry must not wait for or touch '+key);}});
  vm.runInNewContext(SOURCE,c);assert.deepEqual(navigations,[BASE+'index.html']);assert.deepEqual(historyCalls,['/study-pocket/start.html']);
 }
});
test('unavailable history API does not prevent studying',()=>{
 const navigations=[];vm.runInNewContext(SOURCE,{URL,location:{href:BASE+'start.html',pathname:'/study-pocket/start.html',replace:x=>navigations.push(x)},history:{replaceState(){throw Error('not available');}}});assert.deepEqual(navigations,[BASE+'index.html']);
});
test('entry contains an ordinary study fallback with no tab-management requirement',()=>{
 const html=fs.readFileSync('src/start.html','utf8');assert.deepEqual([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]),['./start-entry.js']);assert.match(html,/href="\.\/index.html"/);assert.doesNotMatch(html,/Kontrolli uuesti|start-recheck|teises sakis/);
});
