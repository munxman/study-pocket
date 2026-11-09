const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const C=require('../src/quant-content.js'),E=require('../src/quant-engine.js');
const B=C.subjects.physics,T=B.topics.find(t=>t.id==='atomic_photons');
const NOW=Date.parse('2026-11-09T12:00:00Z');
function scientific(s){
 const match=s.match(/^([0-9]+(?:,[0-9]+)?) × 10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+) /);assert.ok(match,'a number and unit must be readable');
 const digits={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
 return Number(match[1].replace(',','.'))*10**Number([...match[2]].map(c=>digits[c]).join(''));
}
function correctNumber(index,expected){
 const q=T.questions[index],near=x=>Math.abs((x-expected)/expected)<1e-12;
 const matching=q.options.flatMap((o,i)=>near(scientific(o))?[i]:[]);
 assert.deepEqual(matching,[q.answer],'exactly one authored option matches the independent calculation');
}
test('atomic_photons appends one bounded topic without changing any earlier question or key',()=>{
 assert.equal(C.subjects.maths.topics.length,5);assert.equal(B.topics.length,5);assert.equal(B.topics.at(-1).id,'atomic_photons');
 const expected={maths:'e11aa29babaddc8f74d05cdc1c1f45861ea8d3af4b1925bc2bf9a7ee9df67683',physics:'e9d5f5e2e286b75d84006ca34cdc56e6df720a74240325984753e51dbfd601cb'};
 for(const [subject,bank] of Object.entries(C.subjects)){
  const old=bank.topics.slice(0,4).map(t=>({id:t.id,questions:t.questions.map(q=>({prompt:q.prompt,options:q.options,answer:q.answer}))}));
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),expected[subject]);
 }
 assert.equal(T.questions.length,6);assert.equal(new Set(T.questions.map(q=>q.skill)).size,6);
 for(const q of T.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.answer]);assert.ok(q.explanation);}
 assert.match(T.why,/mitte kogu kursus/);assert.match(T.explanation.join(' '),/1 nm = 10⁻⁹ m/);
 assert.ok(T.sources.some(s=>s.url.startsWith('https://openstax.org/')));assert.ok(T.sources.some(s=>s.url==='https://www.opiq.ee/kit/575/chapter/31962'));
});
test('authored numeric answer keys agree independently with SI conversions and photon equations',()=>{
 correctNumber(0,450*1e-9);
 correctNumber(2,6.6e-34*3e14);
 correctNumber(3,6.6e-34*3e8/(400*1e-9));
 const energy600=6.6e-34*3e8/(600e-9),energy300=6.6e-34*3e8/(300e-9);
 assert.equal(energy600/energy300,.5);assert.equal(T.questions[4].options[T.questions[4].answer],'See on poole väiksem.');
 correctNumber(5,3.96e-19/6.6e-34);
 const exampleFrequency=3e8/(600e-9),exampleEnergy=6.6e-34*exampleFrequency;
 assert.ok(Math.abs(exampleFrequency/5e14-1)<1e-12);assert.ok(Math.abs(exampleEnergy/3.3e-19-1)<1e-12);assert.match(T.worked.answer,/3,3 × 10⁻¹⁹ J/);
});
test('qualitative atom question distinguishes probability distribution from a fixed classical orbit',()=>{
 const q=T.questions[1],right=q.options[q.answer];assert.match(right,/tõenäosusjaotuse/);assert.match(right,/mitte kindla klassikalise ringraja/);
 assert.match(q.explanation,/diskreetsed/);assert.equal(q.skill,'orbital_probability_model');
 assert.equal(T.questions[0].skill,'photon_nm_to_metre');assert.equal(T.questions[2].skill,'photon_energy_from_frequency');
});
test('optional topic uses the existing unknown/explanation/check path and preserves older sessions',()=>{
 const s=E.fresh(),old=E.start(s,B,NOW,'pressure');old.selected=2;old.confidence='unsure';const oldCopy=structuredClone(old);
 const a=E.start(s,B,NOW+100,'atomic_photons');assert.equal(a.questionIndex,0);assert.equal(a.stage,'question');assert.equal(s.sessions.length,2);
 assert.equal(E.submit(s,B,NOW+101),true);assert.equal(a.unknown,true);assert.equal(a.stage,'lesson');assert.equal(a.checkIndex,2);assert.equal(a.delayedProbe,false);
 E.beginCheck(s);a.checkSelected=(T.questions[2].answer+1)%4;E.check(s,B,NOW+102);assert.equal(a.checkCorrect,false);assert.equal(a.stage,'done');
 assert.deepEqual(s.sessions.find(x=>x.id===old.id),oldCopy);
 const restored=E.restore(JSON.stringify(s),B);assert.equal(restored.sessions.length,2);assert.equal(E.active(restored).checkCorrect,false);
});
test('first questions rotate through distinct skills; a fresh application remains supported after teaching',()=>{
 const s=E.fresh(),indices=[];
 for(let n=0;n<4;n++){
  const a=E.start(s,B,NOW+n*1000,'atomic_photons');indices.push(a.questionIndex);a.selected=T.questions[a.questionIndex].answer;a.confidence='sure';E.submit(s,B,NOW+n*1000+1);
  assert.equal(a.checkIndex,3);assert.equal(a.delayedProbe,false);E.beginCheck(s);a.checkSelected=T.questions[3].answer;E.check(s,B,NOW+n*1000+2);
 }
 assert.deepEqual(indices,[0,1,4,5]);assert.equal(s.cards.atomic_photons.delayedSuccesses,0);
});
