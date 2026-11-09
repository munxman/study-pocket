(function(root, factory) {
  const api = factory();
  root.VideoEngine = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  'use strict';

  const DAY = 86400000;
  const MODULE_ID = 'hendrik-video-practice-v1';
  const HELP_KINDS = ['video', 'gist', 'explanation'];
  const CONFIDENCES = ['sure', 'unsure'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const validTime = value => Number.isSafeInteger(value) && value > 0;
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const safeId = id => typeof id === 'string' && id.length > 0 && !['__proto__', 'constructor', 'prototype'].includes(id);
  const fresh = () => ({version: 1, serial: 0, cards: {}, sessions: [], activeId: null});
  const active = state => state.sessions.find(session => session.id === state.activeId) || null;

  function video(bank, id) {
    const item = bank?.videos?.find(entry => entry.id === id);
    if (!item || !safeId(item.id) || !Array.isArray(item.questions) || item.questions.length < 2) {
      throw Error('Selle video harjutus vajab kontrollimist.');
    }
    const ids = new Set();
    for (const question of item.questions) {
      if (!safeId(question.id) || ids.has(question.id) || !Array.isArray(question.options) ||
          question.options.length < 2 || !question.options.every(option => typeof option === 'string' && option.length > 0) ||
          !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) {
        throw Error('Video küsimus vajab kontrollimist.');
      }
      ids.add(question.id);
    }
    return item;
  }

  function question(bank, session) {
    const item = video(bank, session.videoId);
    const q = item.questions[session.questionIndex];
    if (!q || q.id !== session.questionId) throw Error('Varasem küsimus ei sobi selle õppepaketiga.');
    return q;
  }

  function restore(raw, bank) {
    if (raw == null) return fresh();
    const state = typeof raw === 'string' ? JSON.parse(raw) : clone(raw);
    if (!object(state) || state.version !== 1 || !Number.isSafeInteger(state.serial) || state.serial < 0 ||
        !object(state.cards) || !Array.isArray(state.sessions)) throw Error('Õpiajalugu vajab kontrollimist.');
    const ids = new Set();
    for (const session of state.sessions) {
      if (!object(session) || !safeId(session.id) || ids.has(session.id) || session.kind !== 'video-practice' ||
          session.concept !== session.videoId || !Number.isInteger(session.questionIndex) || !Number.isSafeInteger(session.contentVersion) || session.contentVersion < 1 ||
          !['question', 'done'].includes(session.stage) || !validTime(session.startedAt) ||
          !Array.isArray(session.exposures) || !['assisted', 'initialProbe', 'repeatedQuestion', 'delayedEligibleAtStart', 'delayedProbe', 'independent'].every(key => typeof session[key] === 'boolean') ||
          ['ordinaryBlockCredit', 'chainCredit', 'masteryCredit'].some(key => session[key] !== false)) {
        throw Error('Varasem videoharjutus vajab kontrollimist.');
      }
      const q = question(bank, session);
      for (const key of ['openedAt', 'helpedAt', 'lastExposureAt', 'answeredAt', 'completedAt']) {
        if (session[key] !== 0 && !validTime(session[key])) throw Error('Harjutuse kuupäev vajab kontrollimist.');
      }
      if (session.selected !== null && (!Number.isInteger(session.selected) || session.selected < 0 || session.selected >= q.options.length)) throw Error('Salvestatud valik vajab kontrollimist.');
      if (session.confidence !== null && !CONFIDENCES.includes(session.confidence)) throw Error('Kindluse valik vajab kontrollimist.');
      for (const exposure of session.exposures) {
        if (!object(exposure) || !HELP_KINDS.includes(exposure.kind) || !validTime(exposure.at)) throw Error('Selgituse vaatamise kirje vajab kontrollimist.');
      }
      if (session.exposures.some(exposure => !session.answeredAt || exposure.at < session.answeredAt) && !session.assisted) throw Error('Selgituse kasutamise kirje vajab kontrollimist.');
      if (session.helpedAt && !session.assisted) throw Error('Selgituse kasutamise kirje vajab kontrollimist.');
      if (session.stage === 'done') {
        if (!validTime(session.answeredAt) || session.completedAt !== session.answeredAt ||
            session.selected === null || !CONFIDENCES.includes(session.confidence) || typeof session.correct !== 'boolean' ||
            !Number.isInteger(session.answerKeyAtSubmission) || session.answerKeyAtSubmission < 0 || session.answerKeyAtSubmission >= q.options.length ||
            session.correct !== (session.selected === session.answerKeyAtSubmission) ||
            session.independent !== !session.assisted || (session.delayedProbe && (!session.independent || session.initialProbe || !session.delayedEligibleAtStart))) {
          throw Error('Salvestatud vastus vajab kontrollimist.');
        }
      } else if (session.answeredAt || session.completedAt || session.correct !== null || session.answerKeyAtSubmission !== null || session.delayedProbe || session.independent) {
        throw Error('Pooleli harjutus vajab kontrollimist.');
      }
      ids.add(session.id);
    }
    if (state.activeId !== null && !ids.has(state.activeId)) throw Error('Pooleli töö viide ei sobi.');
    for (const [id, card] of Object.entries(state.cards)) {
      video(bank, id);
      if (!object(card) || !validTime(card.lastAt) || !validTime(card.lastExposure) || !validTime(card.due) ||
          !Number.isInteger(card.intervalDays) || card.intervalDays < 1 || card.intervalDays > 7 ||
          !Number.isInteger(card.delayedSuccesses) || card.delayedSuccesses < 0 || typeof card.needsHelp !== 'boolean' ||
          !state.sessions.some(session => session.videoId === id && session.stage === 'done')) {
        throw Error('Kordamiskaart vajab kontrollimist.');
      }
    }
    return state;
  }

  function seen(state, id) {
    return new Set(state.sessions.filter(session => session.videoId === id && session.answeredAt).map(session => session.questionIndex));
  }

  function eligible(card, now) {
    return !!card && now >= card.due && now - card.lastExposure >= DAY;
  }

  function start(state, bank, now = Date.now(), videoId) {
    if (!validTime(now)) throw Error('Harjutuse kuupäev vajab kontrollimist.');
    const item = video(bank, videoId);
    const waiting = state.sessions.find(session => session.videoId === videoId && session.stage === 'question');
    if (waiting) {
      question(bank, waiting);
      state.activeId = waiting.id;
      return waiting;
    }
    const answered = state.sessions.filter(session => session.videoId === videoId && session.answeredAt);
    const used = seen(state, videoId);
    const unseenIndex = item.questions.findIndex((q, index) => !used.has(index));
    // Keep the different application untouched until a genuinely later due visit.
    // An explicit same-day repeat stays available, but repeats the last item.
    const due = eligible(state.cards[videoId], now);
    const questionIndex = answered.length === 0 ? 0 : !due ? answered.at(-1).questionIndex :
      unseenIndex >= 0 ? unseenIndex : (answered.at(-1).questionIndex + 1) % item.questions.length;
    state.serial++;
    const id = 'video-' + (globalThis.crypto?.randomUUID?.() || now.toString(36) + '-' + state.serial + '-' + Math.random().toString(36).slice(2));
    const session = {
      id, kind: 'video-practice', videoId, concept: videoId, stage: 'question', contentVersion: 1,
      questionId: item.questions[questionIndex].id, questionIndex, startedAt: now,
      openedAt: 0, helpedAt: 0, lastExposureAt: 0, exposures: [], answeredAt: 0, completedAt: 0,
      selected: null, confidence: null, correct: null, answerKeyAtSubmission: null, assisted: false, independent: false,
      initialProbe: answered.length === 0, repeatedQuestion: used.has(questionIndex),
      delayedEligibleAtStart: eligible(state.cards[videoId], now), delayedProbe: false,
      ordinaryBlockCredit: false, chainCredit: false, masteryCredit: false
    };
    state.sessions.push(session);
    state.activeId = id;
    return session;
  }

  // Call when support is actually shown/opened, including a gist rendered by default.
  // Exposure after submission updates future scheduling but never rewrites the frozen answer.
  function expose(state, kind, now = Date.now()) {
    const session = active(state);
    if (!session || !HELP_KINDS.includes(kind) || !validTime(now)) return false;
    session.exposures.push({kind, at: now});
    if (kind === 'video' && !session.openedAt) session.openedAt = now;
    session.lastExposureAt = Math.max(session.lastExposureAt, now);
    if (!session.answeredAt) {
      session.assisted = true;
      if (!session.helpedAt) session.helpedAt = now;
    }
    const card = own(state.cards, session.videoId) ? state.cards[session.videoId] : null;
    if (card) card.lastExposure = Math.max(card.lastExposure, now);
    return true;
  }

  function submit(state, bank, now = Date.now()) {
    const session = active(state);
    if (!session || session.stage !== 'question' || session.answeredAt || !validTime(now)) return false;
    const q = question(bank, session);
    if (!Number.isInteger(session.selected) || session.selected < 0 || session.selected >= q.options.length || !CONFIDENCES.includes(session.confidence)) return false;
    const old = own(state.cards, session.videoId) ? state.cards[session.videoId] : null;
    session.answerKeyAtSubmission = q.answer;
    session.correct = session.selected === q.answer;
    session.answeredAt = now;
    session.completedAt = now;
    session.stage = 'done';
    session.independent = !session.assisted;
    session.delayedProbe = !session.initialProbe && session.delayedEligibleAtStart && session.independent && eligible(old, now);
    const good = session.delayedProbe && session.correct && session.confidence === 'sure';
    const intervalDays = good ? Math.min(7, (old?.intervalDays || 1) * 2) : 1;
    state.cards[session.videoId] = {
      lastAt: now, lastExposure: Math.max(now, session.lastExposureAt, old?.lastExposure || 0),
      due: now + DAY * intervalDays, intervalDays,
      delayedSuccesses: good ? (old?.delayedSuccesses || 0) + 1 : 0,
      needsHelp: !session.correct || session.confidence !== 'sure'
    };
    return true;
  }

  function dueVideos(state, bank, now = Date.now()) {
    if (!validTime(now)) return [];
    return bank.videos.filter(item => own(state.cards, item.id) && state.cards[item.id].due <= now)
      .sort((a, b) => state.cards[a.id].due - state.cards[b.id].due);
  }

  return {MODULE_ID, DAY, HELP_KINDS, CONFIDENCES, fresh, restore, active, video, question, seen, eligible, start, expose, submit, dueVideos};
});
