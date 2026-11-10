(function (root) {
  'use strict';

  const plain = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
  const safeKeys = (value) => Object.keys(value).filter((key) => !['__proto__', 'prototype', 'constructor'].includes(key));
  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (plain(value)) {
      const result = {};
      for (const key of safeKeys(value)) result[key] = clone(value[key]);
      return result;
    }
    return typeof value === 'number' && !Number.isFinite(value) ? null : value;
  }
  const text = (value) => typeof value === 'string' ? value : typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
  const questions = (data) => Array.isArray(data?.diagnostic) ? data.diagnostic : [];
  const topicIds = (data) => safeKeys(plain(data?.topics) ? data.topics : {});
  const valuesFor = (values, data) => questions(data).map((_question, index) => text(Array.isArray(values) ? values[index] : ''));

  function matches(question, value) {
    if (!plain(question)) return false;
    let input = text(value).trim();
    if (Array.isArray(question.choices)) return input !== '' && input === String(question.answer);
    if (/^[+-]?\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:[.,]\d+)?$/.test(input)) input = input.replace(/[ \u00a0\u202f]/g, '');
    if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(input) || !Number.isFinite(question.answer)) return false;
    return Math.abs(Number(input.replace(',', '.')) - question.answer) < 1e-8;
  }

  function rankTopics(data, submittedValues) {
    const ids = topicIds(data);
    const stats = ids.map((topic) => ({ topic, answered: 0, correct: 0, missed: 0, omitted: 0 }));
    const lookup = new Map(stats.map((stat) => [stat.topic, stat]));
    const values = valuesFor(submittedValues, data);
    questions(data).forEach((question, index) => {
      const stat = lookup.get(question.topic);
      if (!stat) return;
      if (!values[index].trim()) { stat.omitted++; return; }
      stat.answered++;
      if (matches(question, values[index])) stat.correct++;
      else stat.missed++;
    });
    const order = (a, b) => ids.indexOf(a.topic) - ids.indexOf(b.topic);
    const errors = stats.filter((stat) => stat.missed > 0).sort((a, b) =>
      b.missed / b.answered - a.missed / a.answered || b.missed - a.missed || order(a, b));
    const unanswered = stats.filter((stat) => !stat.missed && (stat.omitted || !stat.answered)).sort((a, b) =>
      Number(b.answered === 0) - Number(a.answered === 0) || b.omitted - a.omitted || order(a, b));
    const transfer = stats.filter((stat) => !stat.missed && !stat.omitted && stat.answered > 0);
    const topics = [], reasons = {};
    for (const [group, reason] of [[errors, 'errors'], [unanswered, 'unanswered'], [transfer, 'transfer']]) {
      for (const stat of group) {
        if (topics.length === 2) break;
        topics.push(stat.topic);
        reasons[stat.topic] = reason;
      }
    }
    return { topics, reasons, stats };
  }

  function fresh(data) {
    return { version: 1, diagnostic: { values: valuesFor([], data), working: valuesFor([], data), index: 0, submitted: null }, practice: {}, mock: null };
  }

  function submittedSnapshot(raw, data) {
    if (!plain(raw) || !Array.isArray(raw.values) || raw.values.length !== questions(data).length) return null;
    const values = valuesFor(raw.values, data), rank = rankTopics(data, values);
    const snapshot = { ...clone(raw), values, working: valuesFor(raw.working, data), at: Number.isFinite(raw.at) && raw.at >= 0 ? raw.at : null, topics: rank.topics, reasons: rank.reasons };
    return snapshot;
  }

  function validMock(raw) {
    if (!plain(raw) || !Number.isFinite(raw.started) || raw.started < 0) return null;
    const result = clone(raw);
    result.finished = raw.finished === true;
    if (raw.marks !== undefined) result.marks = Array.isArray(raw.marks) ? raw.marks.map(text) : [];
    return result;
  }

  function restore(raw, data, legacyDiagnostic, legacyMock) {
    const state = fresh(data);
    const valid = plain(raw) && raw.version === 1 && plain(raw.diagnostic);
    if (valid) {
      state.diagnostic.values = valuesFor(raw.diagnostic.values, data);
      state.diagnostic.working = valuesFor(raw.diagnostic.working, data);
      const index = Number.isInteger(raw.diagnostic.index) ? raw.diagnostic.index : 0;
      state.diagnostic.index = Math.max(0, Math.min(questions(data).length - 1, index));
      state.diagnostic.submitted = submittedSnapshot(raw.diagnostic.submitted, data);
      for (const topic of topicIds(data)) {
        const rawTopic = plain(raw.practice) ? raw.practice[topic] : null;
        if (!plain(rawTopic) && !Array.isArray(rawTopic)) continue;
        state.practice[topic] = [];
        const lesson = Array.isArray(data?.lessons) ? data.lessons.find((item) => item.topic === topic) : null;
        const length = Array.isArray(lesson?.practice) ? lesson.practice.length : 0;
        for (let index = 0; index < length; index++) {
          const item = rawTopic[index];
          if (!plain(item)) continue;
          state.practice[topic][index] = { ...clone(item), attempts: Array.isArray(item.attempts) ? item.attempts.filter((attempt) => plain(attempt) && typeof attempt.correct === 'boolean').map(clone) : [] };
        }
      }
      state.mock = validMock(raw.mock);
      return state;
    }
    if (Array.isArray(legacyDiagnostic) && legacyDiagnostic.length === questions(data).length) {
      state.diagnostic.values = valuesFor(legacyDiagnostic, data);
      state.diagnostic.submitted = submittedSnapshot({ values: legacyDiagnostic, working: [], at: null }, data);
    }
    state.mock = validMock(legacyMock);
    return state;
  }

  function nextStep(state, data) {
    const safe = restore(state, data);
    // A started paper remains the active task; ordinary short practice never
    // silently pauses or restarts its wall-clock assessment timer.
    if (safe.mock) return { kind: safe.mock.finished ? 'review' : 'mock' };
    if (!safe.diagnostic.submitted) return { kind: 'diagnostic', index: safe.diagnostic.index };
    for (const topic of safe.diagnostic.submitted.topics) {
      const lesson = Array.isArray(data?.lessons) ? data.lessons.find((item) => item.topic === topic) : null;
      const count = Math.min(2, Array.isArray(lesson?.practice) ? lesson.practice.length : 0);
      for (let index = 0; index < count; index++) {
        const item = safe.practice[topic]?.[index];
        const optionalDeferred = topic === 'mixed' && index === 1 && Number.isFinite(item?.deferredAt) && item.deferredAt > 0;
        if (!item?.attempts.length && !optionalDeferred) return { kind: 'practice', topic, index };
      }
    }
    return { kind: 'mock' };
  }

  const api = { fresh, restore, rankTopics, matches, nextStep };
  root.GeometrySprintEngine = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
