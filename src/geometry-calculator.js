'use strict';
// A local scratch calculator: never reads or writes lesson answers or progress.
(()=>{
 const id=x=>document.getElementById(x),engine=globalThis.GeometryCalculator;
 const toggle=id('geometry-calc-toggle'),panel=id('geometry-calc-panel'),close=id('geometry-calc-close');
 if(!toggle||!panel||!engine)return;
 const field=id('geometry-calc-expression'),result=id('geometry-calc-result'),note=id('geometry-calc-note'),form=id('geometry-calc-form'),ans=id('geometry-calc-ans');
 let last=null,finished=false,caret=null;
 function open(value){panel.hidden=!value;toggle.setAttribute('aria-expanded',String(value));if(value)close.focus();else toggle.focus();}
 toggle.addEventListener('click',()=>open(panel.hidden));close.addEventListener('click',()=>open(false));
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();open(false);}});
 const remember=()=>{caret=[field.selectionStart??field.value.length,field.selectionEnd??field.value.length];};
 field.addEventListener('select',remember);field.addEventListener('click',remember);field.addEventListener('keyup',remember);
 field.addEventListener('input',()=>{finished=false;result.value='';note.textContent='';remember();});
 function edit(text){
  const value=field.value,[start,end]=caret||[value.length,value.length];
  const changed=value.slice(0,start)+text+value.slice(end);
  if(changed.length>512){note.textContent='Avaldis on liiga pikk. Arvuta osadena.';return;}
  field.value=changed;
  const next=Math.min(start+text.length,field.value.length);field.setSelectionRange(next,next);caret=[next,next];
  result.value='';note.textContent='';finished=false;
 }
 function reset(){field.value='';result.value='';note.textContent='';last=null;finished=false;caret=[0,0];ans.disabled=true;}
 function calculate(){
  try{const value=engine.calculate(field.value);last=value;result.value=engine.format(value).replace('.',',');note.textContent='Tulemus on arvutatud. Võid selle kopeerida.';ans.disabled=false;finished=true;caret=null;}
  catch(error){result.value='';note.textContent=error.name==='GeometryCalculatorError'?error.message:'Kontrolli avaldist ja proovi uuesti.';finished=false;}
 }
 form.addEventListener('submit',event=>{event.preventDefault();calculate();});
 field.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key==='='){event.preventDefault();event.stopPropagation();calculate();}});
 for(const key of panel.querySelectorAll('[data-calc-key]'))key.addEventListener('click',()=>{
  const value=key.getAttribute('data-calc-key');
  if(value==='clear')return reset();
  if(value==='equals')return calculate();
  if(value==='back'){
   const text=field.value,[start,end]=caret||[text.length,text.length];
   caret=[start===end?Math.max(0,start-1):start,end];return edit('');
  }
  if(value==='answer'){if(last===null)return;if(finished){field.value='';caret=[0,0];}return edit('('+String(last)+')');}
  if(finished){
   if(['+','-','×','÷','^','^2'].includes(value)){field.value='('+String(last)+')';caret=null;}
   else {field.value='';caret=[0,0];}
  }
  edit(value);
 });
 id('geometry-calc-copy').addEventListener('click',async()=>{
  if(!result.value){note.textContent='Arvuta enne tulemus.';return;}
  try{await navigator.clipboard.writeText(result.value);note.textContent='Tulemus kopeeritud.';}
  catch{result.focus();result.select();note.textContent='Tulemus on valitud. Kasuta seadme kopeerimist.';}
 });
 toggle.hidden=false;
})();
