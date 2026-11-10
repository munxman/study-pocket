(function () {
  'use strict';
  const E = typeof module === 'object' && module.exports ? require('./geometry-sprint-engine.js') : globalThis.GeometrySprintEngine;
  if (typeof module === 'object' && module.exports) module.exports = E;
  if (typeof document === 'undefined') return;
  const data = globalThis.GeometrySprintContent;
  const bank = globalThis.GeometrySprintTargets;
  const byId = id => document.getElementById(id);
  const key = 'study-pocket-geometry-coach-v1';
  const duration = 35 * 60 * 1000;
  const fmt = new Intl.NumberFormat('et-EE', { maximumFractionDigits: 6 });
  function read(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
  let storedRaw = null, loadFailure = false, damaged = false, decoded = null;
  try { storedRaw = localStorage.getItem(key); if (storedRaw != null) { try { decoded = JSON.parse(storedRaw); } catch { damaged = true; } } } catch { loadFailure = true; }
  if (storedRaw != null && !damaged && (!decoded || typeof decoded !== 'object' || Array.isArray(decoded) || decoded.version !== 1 || !decoded.diagnostic || !Array.isArray(decoded.diagnostic.values) || !Array.isArray(decoded.diagnostic.working) || !decoded.practice || typeof decoded.practice !== 'object')) damaged = true;
  const state = E.restore(decoded, data, read('study-pocket-geometry-diagnostic-v1'), read('study-pocket-geometry-mock-v1'));
  let lastStoredRaw = storedRaw, blocked = damaged ? 'damaged' : loadFailure ? 'unavailable' : null, recoveryKey = null, otherRaw = null;
  let timer, targetUI;
  state.recordId ||= 'geometry-' + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
  function publishResults() {
    if (blocked || lastStoredRaw !== JSON.stringify(state) || !globalThis.BackupStore || !globalThis.GeometryReportAdapter) return;
    try { const model = globalThis.GeometryReportModel, projected = globalThis.GeometryReportAdapter.project(state, data, bank); if (!projected.sessions.length) return; const previous = globalThis.BackupStore.snapshot().modules[model.KEY] || model.fresh(); const merged = model.merge(null, projected, previous); if (JSON.stringify(merged) !== JSON.stringify(previous)) globalThis.StudySync.storage.setItem(model.KEY, JSON.stringify(merged)); }
    catch { byId('save-status').textContent += ' Geomeetria tulemuste kontole saatmine ootab; kohalik töö on alles.'; }
  }
  globalThis.addEventListener?.('backup-ready', publishResults);
  function el(tag, text, cls) { const n = document.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; return n; }
  function button(text, fn, cls = 'secondary') { const b = el('button', text, cls); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function download(text, name) { const url = URL.createObjectURL(new Blob([text], { type: 'application/json;charset=utf-8' })); const a = el('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function recoveryPanel() {
    let panel = byId('geometry-recovery');
    if (!panel) { panel = el('section', null, 'sprint-panel'); panel.id = 'geometry-recovery'; panel.setAttribute('role', 'status'); byId('save-status').parentNode.append(panel); }
    return panel;
  }
  function recoveryText() { return JSON.stringify({ format: 'geometry-recovery-v1', at: Date.now(), reason: blocked, originalStoredRaw: storedRaw, otherStoredRaw: otherRaw, currentWindow: state }, null, 2); }
  function protectSavedWork(reason, latestRaw) {
    blocked = reason; if (latestRaw !== undefined) otherRaw = latestRaw;
    if (!recoveryKey) recoveryKey = key + '-recovery-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    let recoverySaved = false;
    try { localStorage.setItem(recoveryKey, recoveryText()); recoverySaved = true; } catch {}
    const message = reason === 'conflict' ? 'Teises aknas on uuem töö. Ma ei kirjuta seda selle akna mustandiga üle.' : reason === 'damaged' ? 'Varasemat salvestust ei saanud lugeda. Algne salvestus jääb alles ja seda ei kirjutata üle.' : 'Salvestust ei saanud lugeda. Hoian praeguse töö siin avatuna.';
    byId('save-status').textContent = message + (recoverySaved ? ' Selle akna töö on eraldi taastamiskoopias.' : ' Ära sulge lehte; laadi oma töö koopia alla.');
    const panel = recoveryPanel(); panel.replaceChildren(el('h2', 'Hoiame sinu töö alles'), el('p', message), el('p', 'Laadi koopia alla enne akende sulgemist või uuesti avamist. Koopia sisaldab mõlema akna olemasolevat tööd; midagi ei ühendata oletuse põhjal.'));
    panel.append(button('Laadin taastamiskoopia alla', () => download(recoveryText(), 'geomeetria-taastamiskoopia.json')));
    const area = el('textarea'); area.rows = 5; area.readOnly = true; area.setAttribute('aria-label', 'Geomeetria taastamiskoopia'); area.value = recoveryText(); panel.append(area);
  }
  function showEarlierRecoveries() {
    try {
      const names = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter(k => typeof k === 'string' && k.startsWith(key + '-recovery-'));
      if (!names.length) return;
      const panel = recoveryPanel(); panel.append(el('h2', 'Varasemad taastamiskoopiad'), el('p', 'Need eraldi koopiad on alles. Õppimise jätkamine ei kirjuta neid üle.'));
      names.forEach((name, i) => panel.append(button('Laadin varasema koopia ' + (i + 1) + ' alla', () => { const raw = localStorage.getItem(name); if (raw != null) download(raw, 'geomeetria-taastamiskoopia-' + (i + 1) + '.json'); })));
    } catch {}
  }
  function save() {
    if (blocked) { protectSavedWork(blocked); return false; }
    try {
      const latest = localStorage.getItem(key);
      if (latest !== lastStoredRaw) { protectSavedWork('conflict', latest); return false; }
      const text = JSON.stringify(state); localStorage.setItem(key, text); lastStoredRaw = text;
      byId('save-status').textContent = 'Salvestatud selles brauseris. Võid pausi teha ja samas brauseris jätkata.'; publishResults(); return true;
    }
    catch { byId('save-status').textContent = 'Salvestamine ei õnnestunud. Ära sulge lehte; kopeeri või laadi oma töö allpool alla.'; return false; }
  }
  globalThis.addEventListener?.('storage', event => { if (event.key !== key) return; try { const latest = localStorage.getItem(key); if (latest !== lastStoredRaw) protectSavedWork('conflict', latest); } catch { protectSavedWork('unavailable'); } });
  function go(id) { const n = byId(id); n.scrollIntoView({ block: 'start', behavior: 'smooth' }); n.tabIndex = -1; n.focus({ preventScroll: true }); }
  function answer(q) { return q.choices ? q.choices[q.answer] : fmt.format(q.answer) + (q.unit ? ' ' + q.unit : ''); }
  function control(q, value, change) {
    const box = el('div'); box.append(el('p', q.prompt, 'sprint-question'));
    const label = el('label', null, 'sprint-control'); label.append(el('span', q.unit ? 'Vastus (' + q.unit + ')' : 'Vastus'));
    const field = el(q.choices ? 'select' : 'input'); field.setAttribute('aria-label', q.prompt);
    if (q.choices) { field.className = 'sprint-choice';
      const empty = el('option', 'Vali vastus'); empty.value = ''; field.append(empty);
      q.choices.forEach((text, i) => { const o = el('option', text); o.value = String(i); field.append(o); });
    } else { field.type = 'text'; field.inputMode = 'decimal'; field.autocomplete = 'off'; field.maxLength = 30; }
    field.value = value || '';
    field.addEventListener('input', () => change(field.value)); field.addEventListener('change', () => change(field.value));
    label.append(field); box.append(label); return { box, field };
  }
  function working(value, change, labelText = 'Kuidas mõtlesid? (soovi korral)') {
    const label = el('label', labelText, 'sprint-working'); const field = el('textarea'); field.rows = 3; field.maxLength = 4000;
    field.placeholder = 'Joonis või antud andmed → omadus/valem ja miks see sobib → arvutus → ühik. Võid lahendada paberil või kasutada klaviatuuri dikteerimist.';
    field.value = value || ''; field.addEventListener('input', () => change(field.value)); label.append(field); return { label, field };
  }
  function attempt(topic, index) { state.practice[topic] ||= []; return state.practice[topic][index] ||= { value: '', working: '', help: false, attempts: [] }; }
  function plan() { return state.diagnostic.submitted ? E.rankTopics(data, state.diagnostic.submitted.values) : null; }
  function route() {
    const box = byId('coach-next'), step = E.nextStep(state, data);
    box.replaceChildren(el('h2', 'Üks järgmine samm'));
    const p = plan();
    if (p) box.append(el('p', 'Sinu kaks harjutusteemat: ' + p.topics.map(t => data.topics[t]).join(' · ') + '.'));
    if (step.kind === 'diagnostic') {
      box.append(el('p', 'Alusta ühe ülesandega. Eeldiagnoosi võid jagada 2–5 minuti pikkusteks kordadeks; vastused jäävad alles.'), button('Jätkan eeldiagnoosi', () => go('eeldiagnoos'), 'primary'));
    } else if (step.kind === 'target') {
      box.append(el('p', 'Järgmiseks: ' + bank.skills[step.skill].title + (step.phase === 'practice' ? ' · üks sobiv harjutus.' : ' · uus ülesanne ilma näidet ees hoidmata.')), button('Teen ühe ülesande', () => { targetUI.show(step.skill, step.phase); go('harjuta'); }, 'primary'));
    } else if (step.kind === 'practice') {
      box.append(el('p', 'Järgmiseks: ' + data.topics[step.topic] + ' · ülesanne ' + (step.index + 1) + '/2. Umbes 2–5 min; rohkem aega on täiesti sobiv.'), button('Teen ühe ülesande', () => { showPractice(step.topic, step.index); go('harjuta'); }, 'primary'));
    } else if (step.kind === 'mock') {
      box.append(el('p', state.mock ? (state.mock.mode === 'practice' ? 'Jätka sama ülesannet või tee järgmine väike samm. Osadena harjutusel ei ole taimerit.' : 'Jätka pooleli proovitööd. Ajastatud töö kell käib ka siis, kui leht on suletud.') : 'Põhiharjutuste järel saad proovida teistsuguseid ülesandeid. Vali rahulik 35-minutiline aeg või tee proovitöö osadena, ilma ajasurveta. Edasilükatud lisavõte ei ole lahendatud ülesanne.'), button(state.mock ? 'Jätkan proovitööd' : 'Valin proovitöö viisi', () => go('proovitoo'), 'primary'));
    } else box.append(el('p', 'Vaata üle lahenduskäigud, mitte ainult lõppvastused. Kiirkordus jääb neljapäeval enne kontrolltööd.'), button('Vaatan lahenduskäike', () => go(state.mock?.revealed === false ? 'mock-reveal' : 'mock-key'), 'primary'));
    box.append(button('Praegu paus', () => { if (!save()) { byId('pause-note').textContent = 'Töö pole salvestatud. Hoia leht lahti ja kasuta allpool töö koopia salvestamist.'; return; } byId('pause-note').textContent = state.mock && !state.mock.finished && state.mock.mode !== 'practice' ? 'Ajastatud töö kell jätkub. Kui paus on vajalik, vali proovitöö juures „Jätkan osadena”.' : 'Paus sobib. Järgmisel avamisel ootab sama järgmine samm.'; }));
  }
  function showDiagnostic() {
    const d = state.diagnostic, list = byId('diagnostic-questions'); list.replaceChildren();
    byId('diagnostic-submit').hidden = !!d.submitted || d.index < data.diagnostic.length - 1;
    byId('diagnostic-nav').replaceChildren();
    if (d.submitted) {
      byId('diagnostic-form').hidden = true;
      const values = d.submitted.values, p = plan(), earned = data.diagnostic.map((q, i) => values[i].trim() !== '' && E.matches(q, values[i]));
      const answered = values.filter(v => v.trim() !== '').length;
      const box = byId('diagnostic-result'); box.hidden = false;
      box.replaceChildren(el('h3', answered ? 'Eeldiagnoos: ' + earned.filter(Boolean).length + '/' + answered + ' vastatud ülesandest õige' : 'Alustame põhivõttest · oskused veel hindamata'), el('p', (data.diagnostic.length - answered) + ' jäeti vastamata. Vastamata ei tähenda, et sa ei oska. See lühitest ei ole koolihinne.'));
      const reasons = { errors: 'siin tuli viga', unanswered: 'vajab veel kontrollimist', transfer: 'proovime teistsugust rakendust' };
      p.topics.forEach(t => box.append(el('p', data.topics[t] + ' — ' + reasons[p.reasons[t]] + '.')));
      box.append(button('Alustan esimest harjutusteemat', () => { const step = E.nextStep(state, data); if (step.kind === 'target') targetUI.show(step.skill, step.phase); else if (step.kind === 'practice') showPractice(step.topic, step.index); go('harjuta'); }, 'primary'));
      const details = el('details'); details.append(el('summary', 'Vaata eeldiagnoosi vastuseid ja selgitusi'));
      data.diagnostic.forEach((q, i) => details.append(el('p', (i + 1) + '. ' + (values[i].trim() === '' ? 'Vastamata. ' : earned[i] ? 'Õige. ' : 'Vaatame üle. ') + q.explanation)));
      box.append(details); return;
    }
    const i = d.index, q = data.diagnostic[i], item = el('li'); list.start = i + 1;
    byId('diagnostic-position').textContent = 'Ülesanne ' + (i + 1) + '/' + data.diagnostic.length;
    const { box } = control(q, d.values[i], v => { d.values[i] = v; d.updatedAt = Date.now(); save(); }); item.append(box);
    item.append(working(d.working[i], v => { d.working[i] = v; d.updatedAt = Date.now(); save(); }).label); list.append(item);
    const nav = byId('diagnostic-nav');
    if (i > 0) nav.append(button('Eelmine', () => { d.index--; save(); showDiagnostic(); }));
    if (i < data.diagnostic.length - 1) nav.append(button('Salvesta ja järgmine', () => { d.index++; save(); showDiagnostic(); }, 'primary'));
    nav.append(button('Jätan praegu vahele', () => { if (d.index < data.diagnostic.length - 1) d.index++; save(); showDiagnostic(); }));
  }
  function finishDiagnostic() {
    const d = state.diagnostic; if (d.submitted) return;
    const p = E.rankTopics(data, d.values);
    d.submitted = { values: [...d.values], working: [...d.working], at: Date.now(), topics: p.topics, reasons: p.reasons };
    if (bank && !state.targeted) state.targeted = E.targetPlan(state, data, bank, Date.now());
    save(); showDiagnostic(); showPractice(); route(); go('diagnostic-result');
  }
  byId('diagnostic-form').addEventListener('submit', event => {
    event.preventDefault(); const d = state.diagnostic;
    if (d.submitted) return;
    if (d.index < data.diagnostic.length - 1) { d.index++; save(); showDiagnostic(); return; }
    if (!d.values.some(v => v.trim() !== '')) {
      byId('diagnostic-position').textContent = 'Kõik jäid praegu vastamata. See ei ole ebaõnnestumine ega tõend nõrkusest. Võid alustada ühe lihtsa näitega ja seejärel proovida ise.';
      if (!byId('diagnostic-unassessed')) { const b = button('Alustan põhivõtetest · oskused veel hindamata', finishDiagnostic, 'primary'); b.id = 'diagnostic-unassessed'; byId('diagnostic-nav').append(b); }
      return;
    }
    finishDiagnostic();
  });
  function lessonBody(lesson) {
    const box = el('div'), list = el('ul'); lesson.rules.forEach(r => list.append(el('li', r))); box.append(list);
    const diagram = byId('diagram-' + lesson.topic); if (diagram) box.append(diagram.content.cloneNode(true));
    const example = el('div', null, 'sprint-example'); example.append(el('h4', 'Lahendatud näide')); lesson.example.forEach(s => example.append(el('p', s))); box.append(example); return box;
  }
  function showPractice(topic, index) {
    const container = byId('guided-practice'), p = plan(); container.replaceChildren();
    if (!p) { container.append(el('p', 'Eeldiagnoosi järel valin sulle kaks teemat. Soovi korral saad allpool ise teema avada.')); return; }
    const next = E.nextStep(state, data);
    if (!topic && next.kind === 'target' && targetUI) { targetUI.show(next.skill, next.phase); return; }
    if (!topic && next.kind === 'practice') { topic = next.topic; index = next.index; }
    if (!topic) {
      container.append(el('h3', 'Järgmine valik: proovitöö'), el('p', 'Harjutatud vastused ei tähenda veel kindlat oskust. Proovitöös kontrollid teistsuguste ülesannetega, kas oskad meetodi ise valida. Edasilükatud lisavõte jääb soovi korral teemade juurde.'), button('Edasi proovitöö juurde', () => go('proovitoo'), 'primary'));
      if (bank && targetUI) {
        if (!state.targeted) container.append(button('Proovin eeldiagnoosi vea kohta värsket ülesannet', () => { state.targeted = E.targetPlan(state, data, bank, Date.now()); save(); showPractice(); route(); }));
        else {
          const nextSkill = state.targeted.skills.find(id => !state.targeted.items[bank.skills[id].reserve.id]?.attempts.length);
          if (nextSkill) container.append(button('Soovi korral: üks värske segakontroll', () => { targetUI.show(nextSkill, 'reserve'); go('harjuta'); }));
          container.append(button('Kontrollin ümbermõõdu ja pindala vahet', () => targetUI.show('rectangle_perimeter_area', 'practice')));
        }
      } return;
    }
    const lesson = data.lessons.find(l => l.topic === topic), q = lesson.practice[index], a = attempt(topic, index), done = a.attempts.length > 0;
    container.append(el('h3', data.topics[topic] + ' · ' + (index + 1) + '/2'), el('p', index === 0 ? 'Proovi ise või ava üks näide. Pärast harjutame järgmist ülesannet ilma näidet ees hoidmata.' : 'Pane eelmine näide kõrvale. Vali ise sobiv võte ja põhjenda seda. Kui vajad abi, võid näite avada.'));
    if (topic === 'mixed' && index === 1 && !done) container.append(el('p', 'Koosinusteoreem on siin lisavõte. Kui aeg on napp, keskendu enne nurkadele, kõrgusele, pindalale ja selgele lahenduskäigule.'), button('Jätan lisavõtte hilisemaks', () => { a.deferredAt = Date.now(); save(); showPractice(); route(); go('coach-next'); }));
    const help = el('details'); help.append(el('summary', 'Vajan selgitust või lahendatud näidet'), lessonBody(lesson));
    help.addEventListener('toggle', () => { if (help.open && !a.attempts.length) { a.help = true; a.helpOpened = true; cb.checked = true; cb.disabled = true; save(); } }); container.append(help);
    const form = el('form'), { box, field } = control(q, a.value, v => { a.value = v; save(); }); form.append(box);
    const w = working(a.working, v => { a.working = v; save(); }); form.append(w.label);
    form.append(el('p', 'Kirjutamine ei ole kohustuslik: selgita endale või paberil, miks võte sobib. Tekstist ei arvutata automaatset arusaamise hinnet.', 'minor'));
    const hl = el('label'), cb = el('input'); cb.type = 'checkbox'; cb.checked = !!a.help; cb.disabled = done || !!a.helpOpened; cb.addEventListener('change', () => { a.help = cb.checked || !!a.helpOpened; save(); }); hl.append(cb, ' Kasutasin selle ülesande juures näidet või muud abi.'); form.append(hl);
    const submit = el('button', 'Kontrollin vastust', 'primary'); submit.type = 'submit'; submit.hidden = done; field.disabled = done; w.field.readOnly = done; form.append(submit);
    const feedback = el('div'); feedback.setAttribute('role', 'status'); form.append(feedback);
    function result() {
      const last = a.attempts[0]; if (!last) return;
      feedback.replaceChildren(el('p', (last.correct ? 'Vastus on õige. ' : 'Siin on üks parandatav koht. Õige vastus: ' + answer(q) + '. ') + q.explanation));
      feedback.append(el('p', last.help ? 'See oli abiga harjutus; hiljem proovi ilma abita.' : 'Vastasid ilma märgitud abita. Vaata ka põhjendust; sama korra edu ei tõesta veel hilisemat iseseisvat oskust.', 'minor'));
      if (!last.correct) feedback.append(working(a.correction, v => { a.correction = v; save(); }, 'Millise sammu parandad? (soovi korral, algne vastus jääb alles)').label);
      feedback.append(button('Järgmine väike samm', () => { showPractice(); route(); const step = E.nextStep(state, data); go(step.kind === 'practice' ? 'harjuta' : 'proovitoo'); }, 'primary'));
      feedback.append(button('Praegu lõpetan', () => { save(); route(); go('coach-next'); }));
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); if (a.attempts.length) return;
      if (field.value.trim() === '') { feedback.textContent = 'Sisesta vastus või vali „Ma ei tea veel”.'; return; }
      a.attempts.push({ value: a.value, working: a.working, correct: E.matches(q, a.value), help: !!a.help || help.open, at: Date.now(), unknown: false });
      save(); showPractice(topic, index); route();
    });
    if (!done) form.append(button('Ma ei tea veel · vaatan selgitust', () => { a.attempts.push({ value: '', working: a.working, correct: false, help: !!a.help || help.open, at: Date.now(), unknown: true }); save(); showPractice(topic, index); route(); }));
    result(); container.append(form);
    const nav = el('p'); p.topics.forEach(t => nav.append(button(data.topics[t], () => { const i = data.lessons.find(l => l.topic === t).practice.findIndex((_, j) => !attempt(t, j).attempts.length); showPractice(t, i < 0 ? 0 : i); }))); container.append(nav);
  }
  const lessons = byId('lessons');
  data.lessons.forEach(lesson => { const d = el('details', null, 'sprint-lesson'); d.id = 'lesson-' + lesson.topic; d.append(el('summary', lesson.title), lessonBody(lesson)); lessons.append(d); });
  data.warmup.forEach((q, i) => {
    const d = el('details', null, 'sprint-lesson'); d.append(el('summary', data.topics[q.topic])); const form = el('form'), c = control(q, '', () => {}), feedback = el('p'); form.append(c.box);
    const b = el('button', 'Kontrolli', 'secondary'); b.type = 'submit'; form.append(b, feedback); form.addEventListener('submit', e => { e.preventDefault(); feedback.textContent = (E.matches(q, c.field.value) ? 'Õige. ' : 'Vastus: ' + answer(q) + '. ') + q.explanation; }); d.append(form); byId('warmup-questions').append(d);
  });
  const markFields = data.mock.map((q, i) => {
    const li = el('li'); li.append(el('h4', q.title)); const steps = el('ol'); q.marks.forEach(m => steps.append(el('li', m))); li.append(steps);
    const label = el('label', 'Minu punktihinnang ', 'sprint-control'), f = el('select'); f.setAttribute('aria-label', 'Ülesanne ' + (i + 1) + ': teenitud punktid');
    for (let n = -1; n <= q.marks.length; n++) { const o = el('option', n < 0 ? 'Vali' : n + '/' + q.marks.length); o.value = n < 0 ? '' : String(n); f.append(o); }
    label.append(f); li.append(label); byId('mock-marking').append(li);
    f.addEventListener('change', () => { if (!state.mock?.finished) return; state.mock.marks[i] = f.value; state.mock.marksUpdatedAt = Date.now(); save(); showMarks(); }); return f;
  });
  function showMarks() {
    const m = state.mock, box = byId('mock-result'), marks = m.marks || [], done = marks.filter(v => v !== '').length;
    box.replaceChildren(el('h4', done === data.mock.length ? 'Enesehinnang: ' + marks.reduce((n, v) => n + Number(v), 0) + '/24 punkti' : 'Üle vaadatud ' + done + '/' + data.mock.length + ' ülesannet'));
    box.append(el('p', 'See on sinu punktihinnang, mitte automaatselt kontrollitud lahenduskäik ega koolihinne. Õige lõpparv üksi ei tõenda põhjendust. Märgi üks samm, mida nüüd oskad paremini, ja üks, mida tahad üle vaadata.'));
    const note = working(m.review, v => { m.review = v; save(); }, 'Minu tähelepanek lahenduskäigust (soovi korral)'); box.append(note.label);
  }
  function timedActive() { return state.mock && !state.mock.finished && state.mock.mode !== 'practice'; }
  function expire() {
    if (timedActive() && Date.now() >= state.mock.started + duration) { state.mock.finished = true; state.mock.expired = true; state.mock.finishedAt = state.mock.started + duration; state.mock.revealed = false; save(); return true; } return false;
  }
  function showMock() {
    clearInterval(timer); const m = state.mock;
    byId('mock-options').hidden = !!m; byId('mock-work').hidden = !m; byId('mock-key').hidden = !m?.finished || m.revealed === false;
    if (!m) return;
    expire(); m.mode ||= 'timed';
    m.working = data.mock.map((_, i) => typeof m.working?.[i] === 'string' ? m.working[i] : '');
    m.marks = data.mock.map((q, i) => /^\d+$/.test(String(m.marks?.[i] ?? '')) && Number(m.marks[i]) <= q.marks.length ? String(m.marks[i]) : '');
    m.index = Math.max(0, Math.min(data.mock.length - 1, Number.isInteger(m.index) ? m.index : 0));
    byId('mock-clock').hidden = m.mode === 'practice' || !!m.finished;
    byId('mock-notice').textContent = m.mode === 'practice' ? 'Osadena harjutus · ajalimiidita. See ei ole võrreldav katkematu 35 minuti proovitööga.' : m.expired ? '35 minutit on täis. Salvestatud töö on lukustatud; ava lahendused, kui oled valmis üle vaatama.' : m.finished ? 'Ajastatud töö lõpetatud.' : 'Kell käib ka taustal. Vali pausiks „Jätkan osadena”; siis muutub töö ajalimiidita harjutuseks.';
    const questions = byId('mock-questions'); questions.replaceChildren(); questions.start = m.index + 1;
    const q = data.mock[m.index], li = el('li'); li.append(el('h3', q.title + ' · ' + q.marks.length + ' p'), el('p', q.prompt, 'sprint-question'));
    const w = working(m.working[m.index], v => { if (expire()) { showMock(); route(); return; } if (!m.finished) { m.working[m.index] = v; m.updatedAt = Date.now(); save(); } }, 'Minu lahenduskäik (võid teha ka paberil)'); w.field.readOnly = !!m.finished; li.append(w.label); questions.append(li);
    const nav = byId('mock-nav'); nav.replaceChildren(el('p', 'Ülesanne ' + (m.index + 1) + '/' + data.mock.length));
    if (m.index > 0) nav.append(button('Eelmine ülesanne', () => { m.index--; save(); showMock(); }));
    if (m.index < data.mock.length - 1) nav.append(button('Järgmine ülesanne', () => { m.index++; save(); showMock(); }, 'primary'));
    if (!m.finished && m.mode === 'practice') nav.append(button('Salvestan ja teen pausi', () => { save(); route(); go('coach-next'); }));
    if (timedActive()) nav.append(button('Jätkan osadena · ajastatud proov lõpeb', () => { if (expire()) { showMock(); route(); return; } m.mode = 'practice'; m.interruptedTimed = true; m.convertedAt = Date.now(); save(); showMock(); route(); }));
    byId('mock-finish').hidden = !!m.finished;
    const reveal = byId('mock-reveal'); reveal.hidden = !m.finished || m.revealed !== false;
    if (m.finished && m.revealed !== false) { byId('mock-key').hidden = false; markFields.forEach((f, i) => { f.value = m.marks[i] ?? ''; }); showMarks(); }
    if (timedActive()) {
      function tick() { if (expire()) { showMock(); route(); return; } const left = Math.max(0, Math.ceil((m.started + duration - Date.now()) / 1000)); byId('mock-clock').textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); }
      tick(); timer = setInterval(tick, 1000);
    }
  }
  function startMock(mode) {
    if (state.mock) return;
    state.mock = { mode, started: Date.now(), finished: false, index: 0, working: data.mock.map(() => ''), marks: data.mock.map(() => '') };
    save(); showMock(); route(); go('mock-work');
  }
  byId('mock-start').addEventListener('click', () => startMock('timed'));
  byId('mock-short').addEventListener('click', () => startMock('practice'));
  byId('mock-finish').addEventListener('click', () => { if (!state.mock || state.mock.finished) return; if (expire()) { showMock(); route(); return; } state.mock.finished = true; state.mock.finishedAt = Date.now(); state.mock.revealed = true; save(); showMock(); route(); go('mock-key'); });
  byId('mock-reveal').addEventListener('click', () => { state.mock.revealed = true; save(); showMock(); go('mock-key'); });
  function reviewText() {
    const lines = ['Geomeetria töö ülevaatuseks', 'Palun kontrolli minu meetodit ja põhjendust. Küsi vajadusel üks täpsustav küsimus; ära kirjuta uut kontrolltööd minu eest. See on harjutus, mitte ametlik tulemus.'];
    const diagnostic = state.diagnostic.submitted || state.diagnostic;
    lines.push('\nEeldiagnoos — ' + (state.diagnostic.submitted ? 'esitatud' : 'pooleli mustand') + ' (põhjendus pole automaatselt hinnatud)');
    data.diagnostic.forEach((q, i) => lines.push(q.prompt, 'Minu vastus: ' + (diagnostic.values[i] || 'vastamata'), 'Minu mõttekäik: ' + (diagnostic.working[i] || 'salvestamata')));
    for (const lesson of data.lessons) lesson.practice.forEach((q, i) => { const a = state.practice[lesson.topic]?.[i]; if (a) { const t = a.attempts?.[0] || a; lines.push('\nHarjutus' + (a.attempts?.length ? ' — esitatud: ' : ' — pooleli mustand: ') + q.prompt, 'Minu vastus: ' + (t.value || 'vastamata'), 'Kasutasin abi: ' + (t.help ? 'jah' : 'ei märkinud'), 'Minu mõttekäik: ' + (t.working || 'salvestamata')); if (a.correction) lines.push('Minu hilisem parandus: ' + a.correction); } });
    for (const [id,a] of Object.entries(state.targeted?.items || {})) { const f = E.targetQuestion(bank,id); if (!f) continue; const t = a.attempts?.[0] || a; lines.push('\nTäpne harjutus: ' + f.question.prompt, 'Minu vastus: ' + (t.value || 'vastamata'), 'Minu mõttekäik: ' + (t.working || 'salvestamata')); if(a.method) lines.push('Põhjenduse valik: ' + f.question.reason.choices[Number(a.method.value)]); if(a.correction) lines.push('Minu hilisem parandus: ' + a.correction); }
    if (state.mock) { const m = state.mock; lines.push('\nProovitöö: ' + (m.mode === 'practice' ? 'osadena / ajalimiidita' : '35 minuti vormis') + (m.finished ? ' — lõpetatud' : ' — pooleli')); data.mock.forEach((q, i) => lines.push(q.prompt, 'Minu töö: ' + (m.working?.[i] || 'paberil / salvestamata'), 'Minu enda punktihinnang: ' + (m.marks?.[i] ?? 'märkimata'))); if (m.review) lines.push('Minu tähelepanek: ' + m.review); }
    return lines.join('\n');
  }
  byId('copy-work').addEventListener('click', async () => { const text = reviewText(); try { await navigator.clipboard.writeText(text); byId('share-status').textContent = 'Kopeeritud. Kleebi ainult sinna, kuhu soovid oma tööd ülevaatuseks jagada.'; } catch { const area = byId('share-text'); area.hidden = false; area.value = text; area.focus(); area.select(); byId('share-status').textContent = 'Automaatne kopeerimine ei õnnestunud. Kopeeri valitud tekst või laadi fail alla.'; } });
  byId('download-work').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([reviewText()], { type: 'text/plain;charset=utf-8' })); const a = el('a'); a.href = url; a.download = 'minu-geomeetria-too-ulevaatus.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  byId('save-status').textContent = 'Mõttekäigud jäävad sellesse brauserisse. Ühendatud äpis saadetakse kontole ainult tulemused ja ülesannete viited.';
  if (blocked) protectSavedWork(blocked);
  else showEarlierRecoveries();
  if (bank && globalThis.GeometryTargetUI) targetUI = globalThis.GeometryTargetUI.create({state, bank, E, data, el, button, control, working, save, route, go, byId, answer, showPractice});
  showDiagnostic(); showPractice(); showMock(); route();
  if (!blocked) save();
})();
