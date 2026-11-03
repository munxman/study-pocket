(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else factory(root).install();
})(typeof window === 'undefined' ? globalThis : window, root => {
  'use strict';
  const microphoneEvent = 'study-microphone-start';
  const document = root.document;
  const recognizer = () => root.SpeechRecognition || root.webkitSpeechRecognition;
  const copy = {
    et: {
      start: 'Dikteeri tekstiks', stop: 'Lõpeta dikteerimine', cancel: 'Lõpeta kohe (säilib kinnitatud tekst)',
      notice: 'Kõne lisatakse muudetava tekstina vastuseväljale. Brauseri kõneteenus võib heli töödelda internetis.',
      keyboard: 'Puuduta vastusevälja ja kasuta klaviatuuri mikrofoni, kui see on olemas, või kirjuta vastus.',
      unavailable: 'See brauser ei toeta äpis dikteerimist.', request: 'Ootan mikrofoni…', listening: 'Kuulan…',
      stopping: 'Ootan kõnetuvastuse lõppu…', end: 'Dikteerimine lõppes. Kontrolli vastuseväljal olevat teksti.',
      blocked: 'Lõpeta esmalt pooleliolev helisalvestus.', limit: 'Vastuseväljal pole selle teksti jaoks piisavalt ruumi.',
      permission: 'Mikrofoni või kõnetuvastuse luba puudub.', language: 'Kõnetuvastus ei toeta siin seda keelt.',
      network: 'Kõneteenus pole kättesaadav.', device: 'Mikrofoni ei saanud avada.', silence: 'Kõnet ei tuvastatud.',
      failure: 'Dikteerimine ei käivitunud või katkes.', field: 'Vastuseväli ei ole praegu muudetav.',
      interim: 'Pooleliolev kõne', focus: 'Ava vastuseväli'
    },
    en: {
      start: 'Dictate into the text box', stop: 'Stop dictation', cancel: 'Finish now (keep confirmed text)',
      notice: 'Speech becomes editable text in your answer. Your browser’s speech service may process audio online.',
      keyboard: 'Tap the answer box and use your keyboard’s microphone if available, or type your response.',
      unavailable: 'In-app dictation is unavailable in this browser.', request: 'Waiting for the microphone…', listening: 'Listening…',
      stopping: 'Waiting for the speech service to finish…', end: 'Dictation ended. Check the text in your answer.',
      blocked: 'Finish the current audio recording first.', limit: 'There is not enough space for this phrase in the answer box.',
      permission: 'Microphone or speech recognition permission was denied.', language: 'The speech service does not support this language here.',
      network: 'The speech service is unavailable.', device: 'The microphone could not open.', silence: 'No speech was detected.',
      failure: 'Dictation could not start or was interrupted.', field: 'The answer box is unavailable for editing.',
      interim: 'Unconfirmed speech', focus: 'Open the answer box'
    }
  };
  const micIcon = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:.35em"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>';

  function notifyMicrophone() {
    return document.dispatchEvent(new root.CustomEvent(microphoneEvent, {cancelable:true,detail:{source:'dictation'}}));
  }

  class Dictation {
    constructor(lang, target, changed, requestMic = notifyMicrophone) {
      this.lang = lang;
      this.target = target;
      this.changed = changed;
      this.requestMic = requestMic;
      this.state = 'idle';
      this.status = '';
      this.interim = '';
      this.api = null;
      this.anchor = null;
    }
    get active() { return this.state !== 'idle'; }
    update(state, status) {
      this.state = state;
      this.status = status;
      this.changed();
    }
    finish(status, abort = false) {
      const old = this.api;
      this.api = null;
      if (old) {
        old.onresult = old.onerror = old.onend = old.onstart = null;
        if (abort) { try { old.abort(); } catch {} }
      }
      this.interim = '';
      this.anchor = null;
      this.update('idle', status);
    }
    insert(chunk) {
      const field = this.target();
      if (!field || field.disabled || field.readOnly) { this.finish('field', true); return false; }
      const value = field.value;
      let cursor = field.selectionEnd ?? value.length;
      // A fresh render may restore the draft but reset its caret to zero.
      if (this.anchor && this.anchor.field !== field && this.anchor.value === value && document?.activeElement !== field) {
        cursor = this.anchor.cursor;
      }
      const before = value.slice(0, cursor), after = value.slice(cursor);
      const startSpace = before && !/[\s(\[“‘-]$/u.test(before) && !/^[.,!?;:%)]/u.test(chunk) ? ' ' : '';
      const endSpace = after && !/^[\s.,!?;:%)\]”’]/u.test(after) && !/[\s(\[“‘-]$/u.test(chunk) ? ' ' : '';
      const insertion = startSpace + chunk + endSpace;
      if (field.maxLength >= 0 && value.length + insertion.length > field.maxLength) {
        this.finish('limit', true);
        return false;
      }
      // Dictation is additive. Even a selection made before clicking the
      // microphone is preserved, with the dictated text inserted after it.
      field.setRangeText(insertion, cursor, cursor, 'end');
      const nextCursor = cursor + startSpace.length + chunk.length;
      field.setSelectionRange(nextCursor, nextCursor);
      this.anchor = {field, cursor: nextCursor, value: field.value};
      field.dispatchEvent(new root.Event('input', {bubbles:true, composed:true}));
      return true;
    }
    start() {
      if (this.active) return;
      const Constructor = recognizer();
      if (!Constructor) { this.update('idle', 'unavailable'); return; }
      const field = this.target();
      if (!field || field.disabled || field.readOnly) { this.update('idle', 'field'); return; }
      if (!this.requestMic()) { this.update('idle', 'blocked'); return; }
      try {
        const api = this.api = new Constructor();
        const finalIndices = new Set();
        api.lang = this.lang;
        api.continuous = true;
        api.interimResults = true;
        api.onstart = () => {
          if (api === this.api && this.state === 'starting') this.update('listening', 'listening');
        };
        api.onresult = event => {
          if (api !== this.api) return;
          const interim = [];
          for (let i=event.resultIndex || 0; i<event.results.length; i++) {
            const result = event.results[i];
            const transcript = (result[0]?.transcript || '').trim();
            if (result.isFinal) {
              if (!transcript || finalIndices.has(i)) continue;
              finalIndices.add(i);
              if (!this.insert(transcript) || this.api !== api) return;
            }
          }
          // Some recognizers keep earlier provisional results in the list.
          for (const result of Array.from(event.results)) {
            if (!result.isFinal && result[0]?.transcript) interim.push(result[0].transcript.trim());
          }
          this.interim = interim.join(' ');
          this.changed();
        };
        api.onerror = event => {
          if (api !== this.api) return;
          const errors = {'not-allowed':'permission','service-not-allowed':'permission','language-not-supported':'language','audio-capture':'device','no-speech':'silence','network':'network','aborted':'end'};
          this.finish(errors[event.error] || 'failure', true);
        };
        api.onend = () => { if (api === this.api) this.finish('end'); };
        this.anchor = {field, cursor: field.selectionEnd ?? field.value.length, value: field.value};
        this.update('starting', 'request');
        api.start();
      } catch { this.finish('failure', true); }
    }
    stop() {
      if (!this.api) return;
      if (this.state === 'stopping') { this.finish('end', true); return; }
      this.update('stopping', 'stopping');
      try { this.api.stop(); } catch { this.finish('end', true); }
    }
  }

  function install() {
    if (!root.customElements || root.customElements.get('study-dictation')) return;
    const controllers = new Map();
    const language = document.documentElement.lang.startsWith('en') ? 'en' : 'et';
    const ui = copy[language];
    class Widget extends root.HTMLElement {
      get active() { return Boolean(this.entry?.controller.active); }
      field() {
        const target = this.getRootNode().getElementById?.(this.dataset.target);
        return target?.tagName === 'TEXTAREA' ? target : null;
      }
      connectedCallback() {
        const lang = this.getAttribute('lang') === 'et-EE' ? 'et-EE' : 'en-GB';
        const key = JSON.stringify([this.dataset.session || '', this.dataset.target]);
        this.key = key;
        let entry = controllers.get(key);
        if (!entry) {
          const widgets = new Set();
          const current = () => Array.from(widgets).find(w => w.isConnected);
          const controller = new Dictation(lang, () => current()?.field(), () => widgets.forEach(w => w.paint()));
          entry = {widgets,controller}; controllers.set(key,entry);
        }
        this.entry = entry;
        entry.widgets.add(this);
        const box = document.createElement('div');
        box.lang = language;
        box.className = 'study-dictation-controls';
        const notice = document.createElement('small');
        const control = this.control = document.createElement('button');
        control.type = 'button';
        const fallback = !recognizer();
        notice.textContent = fallback ? ui.unavailable+' '+ui.keyboard : ui.notice;
        control.addEventListener('click', () => {
          if (fallback) { this.field()?.focus(); return; }
          if (this.active) entry.controller.stop();
          else {
            // The learner may switch the picker without remounting this field.
            entry.controller.lang = this.getAttribute('lang') === 'et-EE' ? 'et-EE' : 'en-GB';
            entry.controller.start();
          }
        });
        const status = this.status = document.createElement('small');
        status.setAttribute('role','status');
        const pending = this.pending = document.createElement('small');
        box.append(control, notice, status, pending);
        this.replaceChildren(box);
        this.paint();
      }
      disconnectedCallback() {
        const {entry,key} = this;
        if (!entry) return;
        entry.widgets.delete(this);
        Promise.resolve().then(() => {
          if (!entry.widgets.size && controllers.get(key) === entry) {
            if (entry.controller.active) entry.controller.finish('end', true);
            controllers.delete(key);
          }
        });
      }
      paint() {
        const run = this.entry.controller;
        const label = !recognizer() ? ui.focus : run.state === 'stopping' ? ui.cancel : run.active ? ui.stop : ui.start;
        if (this.control.dataset.label !== label) {
          this.control.dataset.label = label;
          this.control.textContent = label;
          if (recognizer() && !run.active) this.control.insertAdjacentHTML('afterbegin', micIcon);
        }
        this.control.setAttribute('aria-pressed',String(run.active));
        const error = ['permission','language','network','device','silence','failure'].includes(run.status);
        this.status.textContent = (ui[run.status] || '') + (error ? ' '+ui.keyboard : '');
        this.pending.textContent = run.interim ? ui.interim+' · '+run.interim : '';
      }
    }
    root.customElements.define('study-dictation',Widget);
    const stopAll = () => controllers.forEach(({controller}) => {
      if (controller.active) controller.finish('end', true);
    });
    document.addEventListener(microphoneEvent, stopAll);
    root.addEventListener('pagehide', stopAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  }
  return {Dictation,install};
});
