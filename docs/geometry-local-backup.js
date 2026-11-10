(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GeometryLocalBackup = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const FORMAT = 'study-pocket-geometry-local-v1';
  const COACH = 'study-pocket-geometry-coach-v1';
  const KEYS = [COACH, 'study-pocket-geometry-diagnostic-v1', 'study-pocket-geometry-mock-v1'];
  const LIMITS = { bytes: 20000000, entryBytes: 2000000, entries: 256, depth: 40 };
  const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const bytes = text => typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length * 3;
  const fail = code => { const error = new Error(code); error.code = code; throw error; };
  const allowed = key => typeof key === 'string' && key.length <= 220 && (KEYS.includes(key) || key.startsWith(COACH + '-recovery-') || KEYS.some(base => key.startsWith(base + '-before-import-')));
  function safe(value, depth = 0) {
    if (depth > LIMITS.depth) fail('geometry_backup_depth');
    if (typeof value === 'number' && !Number.isFinite(value)) fail('geometry_backup_number');
    if (Array.isArray(value)) { if (value.length > 20000) fail('geometry_backup_array'); value.forEach(x => safe(x, depth + 1)); }
    else if (object(value)) for (const [key, item] of Object.entries(value)) { if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('geometry_backup_unsafe_key'); safe(item, depth + 1); }
  }
  const texts = value => Array.isArray(value) && value.length <= 1000 && value.every(x => typeof x === 'string' && x.length <= 20000);
  const time = value => value == null || Number.isSafeInteger(value) && value >= 0;
  function mock(value) {
    return object(value) && Number.isFinite(value.started) && value.started >= 0 && typeof value.finished === 'boolean' && (value.mode == null || ['timed', 'practice'].includes(value.mode)) && (value.working == null || texts(value.working)) && (value.marks == null || texts(value.marks)) && time(value.finishedAt);
  }
  function coach(value) {
    if (!object(value) || value.version !== 1 || !object(value.diagnostic) || !object(value.practice)) return false;
    const d = value.diagnostic;
    if (!texts(d.values) || !texts(d.working) || !Number.isInteger(d.index) || d.index < 0 || d.index >= Math.max(1, d.values.length)) return false;
    if (d.submitted != null && (!object(d.submitted) || !texts(d.submitted.values) || !texts(d.submitted.working) || !time(d.submitted.at))) return false;
    for (const attempts of Object.values(value.practice)) {
      if (!Array.isArray(attempts) || attempts.length > 1000) return false;
      for (const a of attempts) if (a != null && (!object(a) || !Array.isArray(a.attempts) || a.attempts.some(t => !object(t) || typeof t.correct !== 'boolean' || !time(t.at)))) return false;
    }
    return value.mock == null || mock(value.mock);
  }
  function classify(key, raw) {
    let value;
    try { value = JSON.parse(raw); } catch { return { restorable: false, reason: 'unreadable_json' }; }
    safe(value);
    if (!KEYS.includes(key)) return { restorable: false, reason: 'recovery_copy' };
    if (key === COACH && coach(value)) return { restorable: true };
    if (key === KEYS[1] && texts(value) && value.length === 8) return { restorable: true };
    if (key === KEYS[2] && mock(value)) return { restorable: true };
    return { restorable: false, reason: 'unsupported_or_damaged_state' };
  }
  function parse(input) {
    let text;
    try { text = typeof input === 'string' ? input : JSON.stringify(input); } catch { fail('geometry_backup_json'); }
    if (typeof text !== 'string' || bytes(text) > LIMITS.bytes) fail('geometry_backup_size');
    let value; try { value = JSON.parse(text); } catch { fail('geometry_backup_json'); }
    safe(value);
    if (!object(value) || value.format !== FORMAT || value.version !== 1 || !Number.isSafeInteger(value.exportedAt) || value.exportedAt < 0 || !Array.isArray(value.entries) || value.entries.length > LIMITS.entries) fail('geometry_backup_format');
    if (Object.keys(value).some(k => !['format', 'version', 'exportedAt', 'entries'].includes(k))) fail('geometry_backup_format');
    const seen = new Set();
    for (const entry of value.entries) {
      if (!object(entry) || Object.keys(entry).some(k => !['key', 'raw'].includes(k)) || !allowed(entry.key) || seen.has(entry.key) || typeof entry.raw !== 'string' || bytes(entry.raw) > LIMITS.entryBytes) fail('geometry_backup_entry');
      seen.add(entry.key); classify(entry.key, entry.raw);
    }
    return value;
  }
  function capture(storage, options = {}) {
    const keys = new Set(KEYS);
    try { for (let i = 0; i < storage.length; i++) { const key = storage.key(i); if (allowed(key)) keys.add(key); } } catch { fail('geometry_storage_unavailable'); }
    const entries = [];
    try { for (const key of [...keys].sort()) { const raw = storage.getItem(key); if (raw != null) entries.push({ key, raw }); } } catch { fail('geometry_storage_unavailable'); }
    return parse({ format: FORMAT, version: 1, exportedAt: options.now ?? Date.now(), entries });
  }
  function stringify(value) { return JSON.stringify(parse(value), null, 2); }
  function preview(storage, input) {
    const value = parse(input), expected = [], restorable = [], conflicts = [], unreadable = [], identical = [];
    for (const entry of value.entries) {
      let raw; try { raw = storage.getItem(entry.key); } catch { fail('geometry_storage_unavailable'); }
      expected.push({ key: entry.key, raw });
      const kind = classify(entry.key, entry.raw);
      if (raw === entry.raw) { identical.push(entry.key); continue; }
      if (kind.restorable) { restorable.push(entry.key); if (raw != null) conflicts.push(entry.key); }
      else unreadable.push({ key: entry.key, reason: kind.reason });
    }
    return { entries: value.entries.length, restorable, conflicts, unreadable, identical, requiresConfirmation: conflicts.length > 0, expected };
  }
  function fingerprint(text) { let hash = 2166136261; for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16); }
  function restore(storage, input, options = {}) {
    const value = parse(input), plan = preview(storage, value);
    if (!Array.isArray(options.expected)) fail('geometry_preview_required');
    if (JSON.stringify(plan.expected) !== JSON.stringify(options.expected)) fail('geometry_storage_changed');
    if (plan.requiresConfirmation && options.confirmConflicts !== true) fail('geometry_confirmation_required');
    const archives = [], restored = [], retained = [], mutations = [];
    const read = key => { try { return storage.getItem(key); } catch { fail('geometry_storage_unavailable'); } };
    function preserve(base, raw) {
      const stem = base + '-' + fingerprint(raw); let key = stem, suffix = 0;
      while (read(key) != null && read(key) !== raw) key = stem + '-' + (++suffix);
      if (read(key) == null) { try { storage.setItem(key, raw); } catch { fail('geometry_prior_copy_failed'); } if (read(key) !== raw) fail('geometry_prior_copy_failed'); }
      archives.push(key); return key;
    }
    // Preserve every replaced record before changing any canonical key. Invalid
    // imports remain recovery copies; importing never activates damaged state.
    for (const entry of value.entries) {
      const before = read(entry.key); if (before === entry.raw) continue;
      if (classify(entry.key, entry.raw).restorable) {
        if (before != null) preserve(entry.key + '-before-import', before);
        mutations.push({ ...entry, before });
      } else {
        if (!KEYS.includes(entry.key) && before == null) {
          try { storage.setItem(entry.key, entry.raw); } catch { fail('geometry_prior_copy_failed'); }
          if (read(entry.key) !== entry.raw) fail('geometry_prior_copy_failed'); retained.push(entry.key);
        } else retained.push(preserve((KEYS.includes(entry.key) ? entry.key + '-before-import-incoming' : COACH + '-recovery-import'), entry.raw));
      }
    }
    // Recheck canonical targets after archiving in case another window saved.
    if (mutations.some(entry => read(entry.key) !== entry.before)) fail('geometry_storage_changed');
    try {
      for (const entry of mutations) {
        if (read(entry.key) !== entry.before) fail('geometry_storage_changed');
        storage.setItem(entry.key, entry.raw); restored.push(entry.key);
        if (read(entry.key) !== entry.raw) fail('geometry_restore_failed');
      }
    } catch (cause) {
      // Roll back only our exact writes; never erase a concurrent window's work.
      let rollbackFailed = false;
      for (const entry of mutations.filter(entry => restored.includes(entry.key)).reverse()) {
        try { if (storage.getItem(entry.key) === entry.raw) { if (entry.before == null) storage.removeItem(entry.key); else storage.setItem(entry.key, entry.before); } else rollbackFailed = true; } catch { rollbackFailed = true; }
      }
      const error = new Error(rollbackFailed ? 'geometry_restore_recovery_needed' : cause.code || 'geometry_restore_failed'); error.code = error.message; error.archives = archives; throw error;
    }
    return { restored, retained, identical: plan.identical, archives, at: options.now ?? Date.now(), answerDatesChanged: false };
  }
  return { FORMAT, COACH, KEYS, LIMITS, capture, parse, stringify, preview, restore };
});
