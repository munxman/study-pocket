(function (root) {
  'use strict';
  const KEY = 'hendrik-geometry-sprint-v1';
  const KINDS = ['diagnostic_response', 'practice_response', 'method_response', 'mock_result', 'state'];
  const RESPONSES = KINDS.slice(0, 3);
  const COMMON = ['id', 'kind', 'unitId', 'contentVersion', 'questionId', 'questionIndex', 'topic', 'skill', 'startedAt', 'submittedAt', 'updatedAt', 'timeBasis', 'workingPresent'];
  const RESPONSE = ['correct', 'blank', 'unknown', 'assisted', 'confidence'];
  const MOCK = ['mockMode', 'expired', 'selfMarkedPoints', 'maxPoints', 'itemsWorked'];
  const IDENTITY = ['id', 'kind', 'unitId', 'contentVersion', 'questionId', 'questionIndex', 'topic', 'skill'];
  const object = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const clone = x => JSON.parse(JSON.stringify(x));
  const fail = () => { throw Error('geometry'); };
  const identifier = (x, max = 180) => typeof x === 'string' && x.length > 0 && x.length <= max && /^[A-Za-z0-9_:-]+$/.test(x);
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const timestamp = x => x == null || Number.isSafeInteger(x) && x > 0;
  function fields(x, allowed) {
    if (!object(x) || Object.keys(x).some(k => !allowed.includes(k))) fail();
  }
  function validate(value) {
    fields(value, ['version', 'serial', 'cards', 'sessions']);
    if (value.version !== 1 || !Number.isSafeInteger(value.serial) || value.serial < 0 || !object(value.cards) || Object.keys(value.cards).length || !Array.isArray(value.sessions) || value.sessions.length > 20000) fail();
    const seen = new Set();
    for (const s of value.sessions) {
      if (!object(s) || !KINDS.includes(s.kind)) fail();
      fields(s, [...COMMON, ...(RESPONSES.includes(s.kind) ? RESPONSE : s.kind === 'mock_result' ? MOCK : ['state'])]);
      if (!identifier(s.id) || !identifier(s.unitId) || seen.has(s.id) || !Number.isSafeInteger(s.contentVersion) || s.contentVersion < 1) fail();
      seen.add(s.id);
      if (s.questionId !== undefined && !identifier(s.questionId)) fail();
      if (s.questionIndex !== undefined && (!Number.isSafeInteger(s.questionIndex) || s.questionIndex < 0 || s.questionIndex > 10000)) fail();
      for (const k of ['topic', 'skill']) if (s[k] !== undefined && !identifier(s[k], 100)) fail();
      for (const k of ['startedAt', 'submittedAt', 'updatedAt']) if (!timestamp(s[k])) fail();
      if (!['device_event', 'diagnostic_submission_proxy', 'unknown'].includes(s.timeBasis)) fail();
      if (s.timeBasis === 'diagnostic_submission_proxy' && s.kind !== 'diagnostic_response') fail();
      if (s.kind !== 'state' && (!s.submittedAt) !== (s.timeBasis === 'unknown')) fail();
      if (s.workingPresent !== undefined && typeof s.workingPresent !== 'boolean') fail();
      if (RESPONSES.includes(s.kind)) {
        if (s.correct !== null && typeof s.correct !== 'boolean') fail();
        for (const k of ['blank', 'unknown']) if (s[k] !== undefined && typeof s[k] !== 'boolean') fail();
        if (s.assisted != null && typeof s.assisted !== 'boolean') fail();
        if (s.confidence != null && !['sure', 'unsure', 'guess'].includes(s.confidence)) fail();
        if (s.blank === true && (s.correct !== null || s.unknown === true) || s.unknown === true && s.correct !== false) fail();
      } else if (s.kind === 'mock_result') {
        if (!['timed', 'parts'].includes(s.mockMode)) fail();
        if (s.expired !== undefined && typeof s.expired !== 'boolean') fail();
        if (s.maxPoints !== undefined && (!finite(s.maxPoints) || s.maxPoints < 0 || s.maxPoints > 1000)) fail();
        if (s.selfMarkedPoints !== undefined && (!finite(s.selfMarkedPoints) || s.selfMarkedPoints < 0 || s.maxPoints === undefined || s.selfMarkedPoints > s.maxPoints)) fail();
        if (s.itemsWorked !== undefined && (!Number.isSafeInteger(s.itemsWorked) || s.itemsWorked < 0 || s.itemsWorked > 1000)) fail();
      } else {
        if (!['opened_only', 'unfinished', 'deferred'].includes(s.state) || s.submittedAt != null) fail();
        const at = s.updatedAt || s.startedAt;
        if ((!at) !== (s.timeBasis === 'unknown')) fail();
      }
    }
    return clone(value);
  }
  const fresh = () => ({ version: 1, serial: 0, cards: {}, sessions: [] });
  const identityMatches = (a, b) => IDENTITY.every(k => a[k] === b[k]);
  function merge(base, local, remote) {
    const b = base ? validate(base) : fresh(), l = local ? validate(local) : fresh(), r = remote ? validate(remote) : fresh();
    const prior = new Map(b.sessions.map(s => [s.id, s])), records = new Map(r.sessions.map(s => [s.id, s]));
    for (const incoming of l.sessions) {
      const existing = records.get(incoming.id);
      if (!existing) { records.set(incoming.id, incoming); continue; }
      const anchor = prior.get(incoming.id) || existing;
      // Stable IDs cannot be repurposed to another question, kind or assessment.
      const candidates = [existing, incoming].filter(s => identityMatches(s, anchor));
      if (!candidates.length) { records.set(incoming.id, clone(anchor)); continue; }
      const canonical = candidates.find(s => s === existing) || candidates[0];
      const out = clone(canonical);
      if (out.kind === 'state') {
        const latest = [...candidates].sort((a, c) => (c.updatedAt || c.startedAt || 0) - (a.updatedAt || a.startedAt || 0))[0];
        if (!out.startedAt && latest.startedAt) out.startedAt = latest.startedAt;
        for (const k of ['state', 'updatedAt', 'timeBasis']) if (latest[k] !== undefined) out[k] = latest[k];
      } else if (out.kind === 'mock_result') {
        const latest = [...candidates].sort((a, c) => (c.updatedAt || 0) - (a.updatedAt || 0))[0];
        if ((latest.updatedAt || 0) > (out.updatedAt || 0)) {
          // A later self-mark is metadata, never another timed submission.
          if (latest.selfMarkedPoints !== undefined && (out.maxPoints === undefined || latest.maxPoints === out.maxPoints)) {
            out.maxPoints = latest.maxPoints;
            out.selfMarkedPoints = latest.selfMarkedPoints;
            out.updatedAt = latest.updatedAt;
          }
        }
      } else if (candidates.some(s => s.assisted === true)) out.assisted = true;
      if (candidates.some(s => s.workingPresent === true)) out.workingPresent = true;
      records.set(incoming.id, out);
    }
    return validate({ version: 1, serial: Math.max(b.serial, l.serial, r.serial), cards: {}, sessions: [...records.values()].sort((a, c) => a.id.localeCompare(c.id)) });
  }
  const api = { KEY, KINDS, RESPONSES, fresh, validate, merge };
  root.GeometryReportModel = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
