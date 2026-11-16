(function(root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./video-engine.js') : root.VideoEngine);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SatPracticeModel = api;
})(typeof window !== 'undefined' ? window : globalThis, E => {
  'use strict';

  const sections = Object.freeze({
    maths: Object.freeze(['sat-linear-equation', 'sat-linear-model', 'sat-area-volume', 'sat-mean-median']),
    english: Object.freeze(['sat-inferences', 'sat-quantitative-evidence', 'sat-transitions', 'sat-sentence-boundaries'])
  });
  const getSection = videoId => Object.keys(sections).find(section => sections[section].includes(videoId)) || null;
  const time = value => Number.isSafeInteger(value) && value > 0;
  const attributable = session => session && (session.participant == null || session.participant === 'learner') &&
    !session.paper && !String(session.id || '').startsWith('trial-');

  // Read-only navigation over the existing video-practice module. The caller
  // restores that module with VideoEngine, then explicitly starts/resumes the
  // returned item. No plan, answer, exposure, due date or completion is written.
  // `repeat` requests consent to same-day repetition; resuming a saved attempt
  // does not require another repetition choice. Reasons are stable UI keys.
  function choose(state, bank, now = Date.now(), {section, excludeVideoIds = []} = {}) {
    if (!E || !time(now) || !Array.isArray(bank?.videos) ||
        section !== undefined && section !== 'auto' && !Object.hasOwn(sections, section)) return null;
    const excluded = new Set(Array.isArray(excludeVideoIds) ? excludeVideoIds : []);
    const videos = bank.videos.filter(v => getSection(v.id) && v.domain === 'sat' && v.exams?.includes('SAT'));
    const byId = new Map(videos.map(v => [v.id, v]));
    const raw = Array.isArray(state?.sessions) ? state.sessions : [];
    const counts = new Map();
    for (const a of raw) if (a?.id) counts.set(a.id, (counts.get(a.id) || 0) + 1);
    const valid = raw.filter(a => {
      const v = byId.get(a?.videoId);
      return v && attributable(a) && typeof a.id === 'string' && a.id && counts.get(a.id) === 1 &&
        a.kind === 'video-practice' && a.concept === a.videoId && time(a.startedAt) && a.startedAt <= now &&
        Number.isInteger(a.questionIndex) && v.questions?.[a.questionIndex]?.id === a.questionId &&
        (a.stage === 'question' && !a.answeredAt && !a.completedAt ||
          a.stage === 'done' && time(a.answeredAt) && a.answeredAt >= a.startedAt && a.answeredAt <= now &&
          a.completedAt === a.answeredAt && typeof a.correct === 'boolean' && ['sure', 'unsure'].includes(a.confidence));
    });
    const answered = valid.filter(a => a.stage === 'done').sort((a, b) => a.answeredAt - b.answeredAt || a.id.localeCompare(b.id));
    const auto = !section || section === 'auto';
    if (auto) section = getSection(answered.at(-1)?.videoId) === 'maths' ? 'english' : 'maths';

    const ids = auto ? Object.values(sections).flat() : sections[section];
    const candidates = ids.filter(id => byId.has(id) && !excluded.has(id)).map((videoId, order) => {
      const history = answered.filter(a => a.videoId === videoId);
      // A malformed/future/unknown-participant record cannot become an
      // apparently fresh recommendation: VideoEngine.start still sees the
      // original immutable history, even when no usable due card exists.
      if (raw.some(a => a?.videoId === videoId && !valid.includes(a))) return null;
      const pending = raw.find(a => a?.videoId === videoId && !a.answeredAt);
      const card = state?.cards?.[videoId];
      // A card without matching dated evidence must not imply a fresh baseline.
      if (card && (!history.length || !time(card.lastAt) || card.lastAt !== history.at(-1).answeredAt ||
          !time(card.lastExposure) || card.lastExposure < card.lastAt || card.lastExposure > now || !time(card.due))) return null;
      let unresolved = false;
      for (const a of history) {
        if (!a.correct || a.confidence === 'unsure') unresolved = true;
        // Supported success, immediate success and another skill's result do
        // not clear the original need for later unaided retrieval.
        else if (a.independent === true && a.assisted === false && a.delayedProbe === true &&
                 a.delayedEligibleAtStart === true && a.initialProbe === false) unresolved = false;
      }
      const due = !!history.length && !!card && E.eligible(card, now);
      return {videoId, order, pending, history, unresolved, due, dueAt: card?.due || 0};
    }).filter(Boolean);
    const result = (item, reason, repeat = false) => item ? {
      videoId: item.videoId, section: getSection(item.videoId), reason, repeat, resume: !!item.pending,
      ...(item.pending ? {sessionId: item.pending.id} : {})
    } : null;
    const pending = candidates.filter(x => x.pending).sort((a, b) =>
      Number(b.pending.id === state?.activeId) - Number(a.pending.id === state?.activeId) ||
      a.pending.startedAt - b.pending.startedAt || a.order - b.order);
    if (pending.length) return result(pending[0], 'resume');
    const inSection = candidates.filter(x => getSection(x.videoId) === section);
    const dueOrder = (a, b) => a.dueAt - b.dueAt || a.order - b.order;
    const weak = inSection.filter(x => x.due && x.unresolved).sort(dueOrder);
    if (weak.length) return result(weak[0], 'weak-due');
    const unseen = inSection.find(x => !x.history.length);
    if (unseen) return result(unseen, 'unseen');
    const due = inSection.filter(x => x.due).sort(dueOrder);
    if (due.length) return result(due[0], 'due');
    const recent = inSection.filter(x => x.history.length).sort((a, b) =>
      Number(b.unresolved) - Number(a.unresolved) ||
      a.history.at(-1).answeredAt - b.history.at(-1).answeredAt || a.order - b.order);
    return result(recent[0], 'repeat', true);
  }

  return {sections, getSection, choose};
});
