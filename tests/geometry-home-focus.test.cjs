const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('src/index.html','utf8');
const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).find(x=>x.includes('geometry-sprint-priority'));
function run(at){const nodes={};for(const id of ['geometry-sprint-priority','other-studies-toggle','other-studies'])nodes[id]={hidden:true,attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this[k]=f}};let timeout;vm.runInNewContext(script,{Date:{now:()=>Date.parse(at),parse:Date.parse},document:{getElementById:id=>nodes[id]},setTimeout:(fn,ms)=>timeout={fn,ms}});return{nodes,timeout};}
test('geometry alone is shown through Thursday; other subject suggestions require an explicit choice',()=>{
 for(const at of ['2026-11-11T02:00:00+02:00','2026-11-12T16:00:00+02:00','2026-11-12T23:59:59+02:00']){const h=run(at);assert.equal(h.nodes['geometry-sprint-priority'].hidden,false);assert.equal(h.nodes['other-studies'].hidden,true);assert.equal(h.nodes['other-studies-toggle'].hidden,false);h.nodes['other-studies-toggle'].click();assert.equal(h.nodes['other-studies'].hidden,false);assert.equal(h.nodes['other-studies-toggle'].attrs['aria-expanded'],'true');h.nodes['other-studies-toggle'].click();assert.equal(h.nodes['other-studies'].hidden,true);assert.ok(h.timeout.ms>0);}
 const others=html.slice(html.indexOf('<div id="other-studies"'));
 assert.ok(others.includes('id="today-plan"'));assert.ok(others.includes('id="video-welcome"'));assert.ok(others.includes('subject=chemistry'));
});
test('normal subject choices return after the retest day without erasing study state',()=>{
 const h=run('2026-11-13T00:00:00+02:00');assert.equal(h.nodes['geometry-sprint-priority'].hidden,true);assert.equal(h.nodes['other-studies'].hidden,false);assert.equal(h.nodes['other-studies-toggle'].hidden,true);assert.equal(h.timeout,undefined);assert.doesNotMatch(script,/localStorage|StudySync|fetch\(/);
});
