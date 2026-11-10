(function(root){
  'use strict';
  function create(ctx){
    const {state,bank,E,el,button,control,working,save,route,go,byId,answer}=ctx;
    function entry(q){state.targeted ||= {version:1,skills:[],items:{},createdAt:Date.now()};return state.targeted.items[q.id] ||= {value:'',working:'',help:false,attempts:[]};}
    function diagram(d){const figure=el('figure',null,'sprint-diagram');const holder=el('div');holder.innerHTML=d.svg;figure.append(holder,el('figcaption',d.note));return figure;}
    function show(skillId,phase='practice'){
      const skill=bank.skills[skillId],q=skill?.[phase];if(!q)return;
      const a=entry(q),box=byId('guided-practice'),done=a.attempts.length>0;
      if(!a.startedAt){a.startedAt=Date.now();save();}
      box.replaceChildren(el('h3',phase==='reserve'?'Värske segakontroll':skill.title));
      box.append(el('p',phase==='practice'?'Üks ülesanne selle konkreetse võtte kohta. Proovi ise või ava allpool näide.':phase==='transfer'?'Uus ülesanne sama võtte kohta. Pane eelmine näide kõrvale ja proovi ise. Abi võib alati avada.':'Vali ise sobiv võte. Teema nimi ja lahendus tulevad pärast vastamist. Võid teha ühe ülesande ja pausi.'));
      const form=el('form'),c=control(q,a.value,v=>{a.value=v;a.updatedAt=Date.now();save();});
      form.append(c.box);if(q.diagram)form.append(diagram(q.diagram));
      const help=el('details');help.append(el('summary','Vajan üht näidet'));
      const rules=el('ul');skill.rules.forEach(s=>rules.append(el('li',s)));help.append(rules);
      const example=el('div',null,'sprint-example');example.append(el('h4','Lahendatud näide'));skill.example.forEach(s=>example.append(el('p',s)));help.append(example);
      help.addEventListener('toggle',()=>{if(help.open&&a.attempts.length&&!a.method){a.methodHelp=true;save();}if(help.open&&!a.attempts.length){a.help=true;a.helpOpened=true;a.updatedAt=Date.now();cb.checked=true;cb.disabled=true;save();}});form.append(help);
      const w=working(a.working,v=>{a.working=v;a.updatedAt=Date.now();save();});form.append(w.label,el('p','Võid lahendada paberil või mõelda valjusti. Kirjutamine ega rääkimine ei ole edasiliikumise tingimus.','minor'));
      const label=el('label'),cb=el('input');cb.type='checkbox';cb.checked=!!a.help;cb.disabled=done||!!a.helpOpened;cb.addEventListener('change',()=>{a.help=cb.checked||!!a.helpOpened;save();});label.append(cb,' Kasutasin näidet või muud abi.');form.append(label);
      c.field.disabled=done;w.field.readOnly=done;
      const feedback=el('div');feedback.setAttribute('role','status');
      const submit=el('button','Kontrollin vastust','primary');submit.type='submit';submit.hidden=done;form.append(submit);
      function commit(unknown){if(a.attempts.length)return;if(!unknown&&!c.field.value.trim()){feedback.textContent='Sisesta vastus või vali „Ma ei tea veel”.';return;}a.attempts.push({value:unknown?'':a.value,working:a.working,correct:!unknown&&E.matches(q,a.value),help:!!a.help||help.open,at:Date.now(),unknown});a.updatedAt=Date.now();save();show(skillId,phase);route();}
      form.addEventListener('submit',e=>{e.preventDefault();commit(false);});
      if(!done)form.append(button('Ma ei tea veel · vaatan selgitust',()=>commit(true)));
      box.append(form,feedback);
      if(done){
        const first=a.attempts[0];feedback.append(el('p',first.correct?'Lõppvastus on õige.':'Siin on üks koht, mille saame üle vaadata.'));
        function explain(){if(!a.feedbackAt){a.feedbackAt=Date.now();save();}show(skillId,phase);}
        // A method choice is shown only after the original numeric answer is
        // frozen. It is optional; help/feedback exposure is retained separately.
        if(q.reason&&!a.method&&!a.feedbackAt&&!first.unknown){
          const reasonBox=el('details');reasonBox.append(el('summary','Soovi korral: miks see võte sobib?'));
          const rf=el('form'),rc=control(q.reason,'',()=>{}),rb=el('button','Kontrollin põhjendust','secondary'),rn=el('p');rb.type='submit';rf.append(rc.box,rb,rn);
          rf.addEventListener('submit',e=>{e.preventDefault();if(!rc.field.value){rn.textContent='Vali üks põhjendus või ava kohe selgitus.';return;}a.method={value:rc.field.value,correct:E.matches(q.reason,rc.field.value),help:!!first.help||!!a.methodHelp||help.open,at:Date.now()};a.feedbackAt=Date.now();save();show(skillId,phase);route();});reasonBox.append(rf);feedback.append(reasonBox);
        }
        if(a.feedbackAt||first.unknown){
          feedback.append(el('p','Vastus: '+answer(q)+'. '+q.explanation));
          if(phase==='reserve')feedback.append(el('p','Võte: '+skill.title+'.'));
          if(a.method)feedback.append(el('p',(a.method.correct?'Põhjenduse valik oli õige. ':'Põhjenduses tasub seda seost kontrollida: ')+q.reason.explanation));
          if(!first.correct)feedback.append(working(a.correction,v=>{a.correction=v;save();},'Üks samm, mille nüüd parandad (soovi korral)').label);
        }else feedback.append(button('Vaatan selgitust',explain));
        feedback.append(el('p',first.help?'See tulemus tuli abiga harjutades.':'Vastasid ilma märgitud abita. Üks õige vastus ei näita veel, kas võte püsib hiljem meeles.','minor'));
        feedback.append(button('Järgmine väike samm',()=>{
          const next=E.nextStep(state,ctx.data,bank);
          if(!state.targeted.skills.includes(skillId)&&phase==='practice'){show(skillId,'transfer');go('harjuta');return;}
          if(phase==='reserve'){const remaining=state.targeted.skills.find(id=>!entry(bank.skills[id].reserve).attempts.length);if(remaining){show(remaining,'reserve');go('harjuta');return;}}
          if(next.kind==='target'){show(next.skill,next.phase);go('harjuta');}else{ctx.showPractice();go('proovitoo');}route();
        },'primary'),button('Praegu lõpetan',()=>{save();route();go('coach-next');}));
      }
      const nav=el('details');nav.append(el('summary','Teine teema või hilisem värske kontroll'));
      for(const id of state.targeted.skills){const s=bank.skills[id];if(!s)continue;nav.append(button(s.title,()=>{show(id,entry(s.practice).attempts.length?'transfer':'practice');}));}
      nav.append(button('Kontrollin ümbermõõdu ja pindala vahet',()=>show('rectangle_perimeter_area','practice')));
      if(state.targeted.skills.every(id=>entry(bank.skills[id].transfer).attempts.length))nav.append(button('Proovin värsket segakontrolli',()=>{const id=state.targeted.skills.find(id=>!entry(bank.skills[id].reserve).attempts.length)||state.targeted.skills[0];show(id,'reserve');}));
      nav.append(button('Lähen proovitöö juurde',()=>go('proovitoo')));box.append(nav);
    }
    return {show};
  }
  root.GeometryTargetUI={create};
  if(typeof module==='object'&&module.exports)module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
