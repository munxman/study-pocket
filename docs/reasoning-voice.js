(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else factory(root, root.IELTSAudioStorage).install();
})(typeof window === 'undefined' ? globalThis : window, (root, audioStorage) => {
  'use strict';
  const storage = audioStorage.createRecordingStore('study-biology-reasoning-audio-v1');
  const limit = 60000;
  const notes = new Map();
  const libraries = new Set();
  const stopTracks = stream => stream?.getTracks().forEach(track => track.stop());
  const supported = () => Boolean(root.navigator?.mediaDevices?.getUserMedia && root.MediaRecorder);

  class Note {
    constructor(id, topic) {
      this.id = id;
      this.topic = topic;
      this.store = id.startsWith('demo:') ? audioStorage.createRecordingStore('study-biology-reasoning-demo-v1') : storage;
      this.listeners = new Set();
      this.phase = 'loading';
      this.message = '';
      this.clip = null;
      this.unsaved = false;
      this.temporary = false;
    }
    set(phase, message = '') {
      this.phase = phase;
      this.message = message;
      this.listeners.forEach(f => f());
    }
    async load() {
      try {
        await this.store.purgeExpired();
        this.clip = await this.store.record(this.id);
        this.set('ready');
      } catch {
        this.set('ready', 'Varasemat helimärkust ei saanud selles brauseris avada.');
      }
    }
    clearExpiredPreview() {
      if (!this.temporary && this.clip?.retention === 'week-v1' && this.clip.expiresAt <= Date.now()) {
        this.clip = null;
        if (this.phase === 'ready') this.set('ready', 'Selle salvestise säilitusaeg on lõppenud.');
        this.store.purgeExpired().catch(() => {});
      }
    }
    async start() {
      this.clearExpiredPreview();
      if (this.phase !== 'ready' || !supported()) return;
      const claim = new root.CustomEvent('study-microphone-start', {cancelable:true, detail:{source:'biology-audio'}});
      if (!root.document.dispatchEvent(claim)) {
        this.set('ready', 'Lõpeta kõigepealt pooleliolev helisalvestus.');
        return;
      }
      const attempt = {};
      this.attempt = attempt;
      this.set('request', 'Ootan mikrofoni kasutamise luba…');
      let stream;
      try {
        stream = await root.navigator.mediaDevices.getUserMedia({audio: true});
        if (this.attempt !== attempt) { stopTracks(stream); return; }
        const mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(t => root.MediaRecorder.isTypeSupported?.(t));
        const recorder = new root.MediaRecorder(stream, mime ? {mimeType: mime} : undefined);
        const chunks = [];
        this.recorder = recorder;
        recorder.ondataavailable = e => { if (e.data?.size) chunks.push(e.data); };
        recorder.onerror = () => {
          this.attempt = null;
          stopTracks(stream);
          root.clearTimeout(this.timer);
          this.recorder = null;
          this.set('ready', 'Salvestamine katkes. Saad uuesti proovida.');
        };
        recorder.onstop = async () => {
          stopTracks(stream);
          if (this.attempt !== attempt) return;
          root.clearTimeout(this.timer);
          this.recorder = null;
          const blob = new root.Blob(chunks, {type: chunks[0]?.type || recorder.mimeType || mime});
          if (!blob.size) { this.set('ready', 'Heli ei salvestunud. Saad uuesti proovida.'); return; }
          this.dismissRecovery?.();
          this.clip = {blob, topic:this.topic, at:Date.now()};
          this.temporary = true;
          this.unsaved = false;
          this.set('ready', 'Ajutine salvestis. Kuula seda siin. Säilita see ainult siis, kui soovid hiljem tagasisidet.');
          if (!this.listeners.size && notes.get(this.id) === this) notes.delete(this.id);
        };
        recorder.start();
        this.set('recording', 'Salvestan… Lõpetamiseks vajuta „Peata ja kuula”.');
        this.timer = root.setTimeout(() => this.stop(), limit);
      } catch {
        stopTracks(stream);
        if (this.attempt !== attempt) return;
        this.recorder = null;
        this.set('ready', 'Mikrofoni ei saanud avada. Kontrolli brauseri mikrofoniluba või vasta mõttes.');
      }
    }
    stop() {
      if (this.phase === 'request') {
        this.attempt = null;
        this.set('ready');
      } else if (this.phase === 'recording' && this.recorder?.state === 'recording') {
        this.set('saving', 'Lõpetan salvestamist…');
        this.recorder.stop();
      }
    }
    async keep() {
      if (this.phase !== 'ready' || !this.temporary || !this.clip) return;
      this.set('saving', 'Salvestan…');
      try {
        this.clip = await this.store.keepForWeek(this.id, this.clip);
        this.temporary = false;
        this.unsaved = false;
        this.dismissRecovery?.();
        this.set('ready', 'Säilitatud kuni seitse päeva selles brauseris.');
        libraries.forEach(library => library.refresh());
      } catch (error) {
        this.unsaved = true;
        const reason = error.code === 'limit' ? 'Bioloogia salvestiste piir on täis (3 faili või 10 MiB).'
          : error.code === 'legacy' ? 'Selle ploki varasem helifail on juba alles.' : 'Helifaili ei saanud säilitada.';
        this.set('ready', reason + ' Saad ajutise salvestise alla laadida enne lahkumist.');
        if (!this.listeners.size) showRecovery(this);
      }
    }
    async remove() {
      if (this.phase !== 'ready') return;
      this.set('saving', 'Kustutan…');
      try {
        if (this.temporary) {
          // A discarded preview must not remove any existing recording for this lesson.
          this.clip = await this.store.record(this.id);
        } else {
          await this.store.remove(this.id);
          this.clip = null;
        }
        this.temporary = false;
        this.dismissRecovery?.();
        this.unsaved = false;
        this.set('ready', 'Häälselgitus kustutatud.');
        libraries.forEach(library => library.refresh());
      } catch {
        this.set('ready', 'Kustutamine ebaõnnestus. Proovi uuesti.');
      }
    }
  }

  const document = root.document;
  function el(tag, text) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  }
  function button(label, action) {
    const node = el('button', label);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }
  function clipName(clip) {
    const topic = clip.topic.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').slice(0, 64).replace(/^-|-$/g, '') || 'selgitus';
    return 'bioloogia-' + topic + '-' + new Date(clip.at).toISOString().replace(/[.:]/g, '-') + '.' + audioStorage.extension(clip.blob.type);
  }
  function shareFile(clip, fileName) {
    try {
      if (!root.File || !root.navigator.canShare || !root.navigator.share) return null;
      const file = new root.File([clip.blob], fileName, {type: clip.blob.type});
      return root.navigator.canShare({files: [file]}) ? file : null;
    } catch { return null; }
  }
  function showRecovery(note) {
    if (note.dismissRecovery) return;
    const box = el('aside');
    box.setAttribute('role', 'status');
    const link = el('a', 'Laadi häälselgitus alla');
    link.href = root.URL.createObjectURL(note.clip.blob);
    link.download = clipName(note.clip);
    box.append(el('p', note.message), link);
    document.body.append(box);
    note.dismissRecovery = () => {
      box.remove();
      root.URL.revokeObjectURL(link.href);
      note.dismissRecovery = null;
    };
    box.append(button('Sulge', note.dismissRecovery));
  }
  function install() {
    if (!root.customElements || root.customElements.get('reasoning-voice')) return;
    class Voice extends root.HTMLElement {
      connectedCallback() {
        const id = this.dataset.session;
        if (!id) return;
        let note = notes.get(id);
        if (!note) {
          note = new Note(id, this.dataset.topic || 'Bioloogia');
          notes.set(id, note);
          note.load();
        }
        this.note = note;
        this.panel = this.closest('details');
        this.onToggle = () => { if (!this.panel.open) note.stop(); };
        if (this.panel) {
          if (['request','recording'].includes(note.phase)) this.panel.open = true;
          this.panel.addEventListener('toggle', this.onToggle);
        }
        this.onChange = () => this.render();
        note.listeners.add(this.onChange);
        this.render();
      }
      disconnectedCallback() {
        this.panel?.removeEventListener('toggle', this.onToggle);
        this.note?.listeners.delete(this.onChange);
        this.releaseURL();
        // IMAT redraws the question after an answer choice. The replacement
        // component reattaches synchronously and retains the active recording.
        const note = this.note;
        if (note) Promise.resolve().then(() => {
          if (!note.listeners.size) {
            note.stop();
            if (note.phase === 'ready' && note.unsaved) showRecovery(note);
            if (note.phase === 'ready' && !note.unsaved && notes.get(note.id) === note) notes.delete(note.id);
          }
        });
      }
      releaseURL() {
        if (this.url) root.URL.revokeObjectURL(this.url);
        this.url = null;
      }
      render() {
        const n = this.note;
        this.releaseURL();
        const box = el('div');
        box.className = 'reasoning-voice-controls';
        if (this.dataset.mode !== 'playback') {
          const hint = el('small', 'Helifail on ajutine (kuni 1 min). Kui soovid hiljem tagasisidet, saad faili jätta kuni seitsmeks päevaks sellesse brauserisse.');
          box.append(hint);
          if (n.phase === 'recording' || n.phase === 'request') {
            box.append(button(n.phase === 'request' ? 'Loobu' : 'Peata ja kuula', () => n.stop()));
          } else if (supported()) {
            const record = button(n.clip ? 'Salvesta uus häälselgitus' : 'Salvesta häälselgitus', () => n.start());
            record.insertAdjacentHTML('afterbegin','<svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:.4em"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>');
            record.disabled = n.phase !== 'ready';
            box.append(record);
          } else {
            box.append(el('p', 'See brauser ei toeta helisalvestust. Võid vastata mõttes või valjusti.'));
          }
        }
        const status = el('p', n.message);
        status.setAttribute('role', 'status');
        if (n.phase === 'ready' && n.clip) {
          if (n.temporary) box.append(button('Hoia 7 päeva', () => n.keep()));
          else if (n.clip.expiresAt) box.append(el('small', 'Säilib kuni ' + new Date(n.clip.expiresAt).toLocaleString('et-EE')));
          else box.append(el('small', 'Varasem salvestis. Kustuta see ise, kui sa seda enam ei vaja.'));
          const fileName = clipName(n.clip);
          const audio = el('audio');
          audio.controls = true;
          audio.preload = 'none';
          audio.setAttribute('aria-label', 'Kuula oma häälselgitust');
          this.url = root.URL.createObjectURL(n.clip.blob);
          audio.src = this.url;
          box.append(audio);
          const download = el('a', 'Laadi helifail alla');
          download.href = this.url;
          download.download = fileName;
          box.append(download);
          const file = shareFile(n.clip, fileName);
          if (file) {
            box.append(button('Jaga helifaili…', async () => {
              try { await root.navigator.share({files: [file]}); }
              catch (error) { if (error?.name !== 'AbortError') status.textContent = 'Jagamine ei õnnestunud. Saad helifaili alla laadida.'; }
            }));
          }
          box.append(button(n.temporary ? 'Loobu ajutisest helist' : 'Kustuta häälselgitus', () => {
            if (root.confirm('Kustutan selle häälselgituse sellest brauserist?')) n.remove();
          }));
        }
        box.append(status);
        this.replaceChildren(box);
      }
    }
    class Library extends root.HTMLElement {
      connectedCallback() {
        libraries.add(this);
        this.refresh();
      }
      disconnectedCallback() { libraries.delete(this); }
      async refresh() {
        const version = this.version = (this.version || 0) + 1;
        const box = el('div');
        try {
          await storage.purgeExpired();
          const ids = await storage.keys();
          const summaries = [];
          for (const id of ids) {
            const clip = await storage.record(id);
            if (clip?.blob) summaries.push({id, topic: clip.topic, at: clip.at, expiresAt: clip.expiresAt});
          }
          if (!summaries.length) box.append(el('p', 'Siin ei ole veel bioloogia häälselgitusi.'));
          for (const item of summaries.sort((a,b) => b.at-a.at)) {
            const row = el('details');
            row.append(el('summary', item.topic + ' · ' + new Date(item.at).toLocaleString('et-EE') + (item.expiresAt ? ' · säilib kuni ' + new Date(item.expiresAt).toLocaleDateString('et-EE') : ' · varasem salvestis')));
            row.addEventListener('toggle', () => {
              if (row.open && !row.querySelector('reasoning-voice')) {
                const player = el('reasoning-voice');
                player.dataset.session = item.id;
                player.dataset.mode = 'playback';
                row.append(player);
              } else if (!row.open) row.querySelector('reasoning-voice')?.remove();
            });
            box.append(row);
          }
        } catch { box.append(el('p', 'Salvestisi ei saanud avada. Proovi uuesti.')); }
        if (this.isConnected && version === this.version) this.replaceChildren(box);
      }
    }
    root.customElements.define('reasoning-voice', Voice);
    root.customElements.define('reasoning-voice-library', Library);
    document.addEventListener('study-microphone-start', event => {
      for (const note of notes.values()) {
        if (['request','recording','saving'].includes(note.phase)) { event.preventDefault(); break; }
      }
    });
    const stopAll = () => notes.forEach(note => note.stop());
    root.addEventListener('pagehide', stopAll);
    const refresh = () => {
      notes.forEach(note => note.clearExpiredPreview());
      libraries.forEach(library => library.refresh());
    };
    root.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAll();
      else refresh();
    });
  }
  return {Note, install};
});
