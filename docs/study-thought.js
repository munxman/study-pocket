'use strict';
(() => {
  if (!window.customElements || customElements.get('study-thought')) return;
  const prefix = 'opitasku:biology-thought:v1:';
  const volatile = new Map(); // Recover an unsaved edit across lesson redraws on this page.
  const expanded = new Set();
  const languages = [['et-EE', 'Eesti'], ['en-GB', 'English']];
  const el = (tag, text) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  };
  function read(id) {
    if (volatile.has(id)) return volatile.get(id);
    const raw = localStorage.getItem(prefix + id);
    return raw ? JSON.parse(raw) : null;
  }
  function write(id, note) {
    try {
      if (note) localStorage.setItem(prefix + id, JSON.stringify(note));
      else localStorage.removeItem(prefix + id);
      volatile.delete(id);
      return true;
    } catch {
      if (note) volatile.set(id, note);
      return false;
    }
  }
  function action(label, fn) {
    const node = el('button', label);
    node.type = 'button';
    node.addEventListener('click', fn);
    return node;
  }
  class Thought extends HTMLElement {
    connectedCallback() {
      if (this.firstChild) return;
      const id = this.dataset.session, topic = this.dataset.topic || 'Bioloogia';
      if (!id) return;
      let note, readFailed = false;
      try { note = read(id); } catch { readFailed = true; }
      const textarea = el('textarea');
      textarea.id = 'reasoning-text-' + encodeURIComponent(id);
      textarea.rows = 3;
      textarea.value = note?.text || '';
      const lang = el('select');
      for (const [value, label] of languages) {
        const option = el('option', label);
        option.value = value;
        lang.append(option);
      }
      lang.value = note?.lang || this.lang || 'et-EE';
      const dictation = el('study-dictation');
      dictation.dataset.target = textarea.id;
      dictation.dataset.session = id;
      dictation.lang = lang.value;

      const editor = el('details'), summary = el('summary', 'Minu mõttekäik · kirjuta või muuda');
      editor.open = this.hasAttribute('data-edit') || expanded.has(id);
      editor.addEventListener('toggle', () => {
        if (!editor.isConnected) return;
        if (editor.open) expanded.add(id);
        else expanded.delete(id);
      });
      dictation.addEventListener('click', () => { editor.open = true; }, true);
      const inputLabel = el('label', 'Minu selgitus');
      inputLabel.htmlFor = textarea.id;
      const languageLabel = el('label', 'Kõne keel ');
      languageLabel.className = 'thought-language';
      languageLabel.append(lang);
      const status = el('p');
      status.setAttribute('role', 'status');
      const shareText = () => topic + '\n' + textarea.value;
      const copy = action('Kopeeri tekst', async () => {
        try {
          await navigator.clipboard.writeText(shareText());
          status.textContent = 'Tekst on kopeeritud. Saad selle ise õpetajale või vestlusse saata.';
        } catch {
          textarea.focus(); textarea.select();
          status.textContent = 'Tekst on valitud. Kasuta brauseri käsku „Kopeeri”.';
        }
      });
      const share = action('Jaga teksti…', async () => {
        try { await navigator.share({text: shareText()}); }
        catch (error) { if (error.name !== 'AbortError') status.textContent = 'Jagamine ei õnnestunud. Saad teksti kopeerida.'; }
      });
      share.hidden = !navigator.share;
      const remove = action('Kustuta tekst', () => {
        if (!write(id, null)) {
          status.textContent = 'Teksti ei saanud kustutada. Proovi uuesti.';
          return;
        }
        textarea.value = '';
        controls();
        status.textContent = 'Mõttekäik on kustutatud.';
        this.dispatchEvent(new CustomEvent('thought-deleted', {bubbles:true}));
      });
      function controls() {
        copy.disabled = share.disabled = !textarea.value.trim();
        remove.disabled = !textarea.value;
      }
      function save() {
        controls();
        const content = textarea.value;
        const saved = write(id, content ? {text:content, lang:lang.value, topic, at:Date.now()} : null);
        status.textContent = saved ? (content ? 'Salvestatud selles brauseris.' : '') : 'Teksti ei saanud püsivalt salvestada. Kopeeri see enne lehe sulgemist.';
      }
      textarea.addEventListener('input', () => { editor.open = true; save(); });
      lang.addEventListener('change', () => { dictation.lang = lang.value; if (textarea.value) save(); });
      if (volatile.has(id)) status.textContent = 'Tekst pole veel püsivalt salvestatud. Kopeeri see enne lehe sulgemist.';
      if (readFailed) status.textContent = 'Selles brauseris ei saanud varasemat teksti avada.';
      const actions = el('div'); actions.className = 'thought-actions'; actions.append(copy, share, remove);
      editor.append(summary, inputLabel, textarea, el('small', 'Mõttekäik on ainult selles brauseris. Kui soovid õpetajalt tagasisidet, jaga teksti ise.'), actions, status);
      controls();
      // The textarea must exist before the microphone registers its target.
      this.append(editor);
      this.prepend(languageLabel, dictation);
    }
  }
  class Library extends HTMLElement {
    connectedCallback() {
      this.onDelete = () => this.show();
      this.addEventListener('thought-deleted', this.onDelete);
      this.show();
    }
    disconnectedCallback() { this.removeEventListener('thought-deleted', this.onDelete); }
    show() {
      let entries = [];
      try {
        const ids = new Set(volatile.keys());
        for (let n = 0; n < localStorage.length; n++) {
          const key = localStorage.key(n);
          if (key?.startsWith(prefix)) ids.add(key.slice(prefix.length));
        }
        entries = [...ids].filter(id => !id.startsWith('demo:')).map(id => [id, read(id)])
          .filter(([,note]) => typeof note?.text === 'string' && note.text.length)
          .sort(([,a],[,b]) => b.at - a.at);
      } catch {
        this.replaceChildren(el('p','Selle brauseri mõttekäike ei saanud avada.'));
        return;
      }
      this.replaceChildren();
      if (!entries.length) this.append(el('p', 'Selles brauseris pole veel tekstina salvestatud mõttekäike.'));
      for (const [id, note] of entries) {
        const row = el('details');
        row.append(el('summary', note.topic + ' · ' + new Date(note.at).toLocaleString('et-EE')));
        row.addEventListener('toggle', () => {
          if (row.open && !row.querySelector('study-thought')) {
            const editor = el('study-thought');
            editor.dataset.session = id;
            editor.dataset.topic = note.topic;
            editor.setAttribute('data-edit', '');
            row.append(editor);
          } else if (!row.open) row.querySelector('study-thought')?.remove();
        });
        this.append(row);
      }
    }
  }
  customElements.define('study-thought', Thought);
  customElements.define('study-thought-library', Library);
})();
