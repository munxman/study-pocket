'use strict';
// A learner can request a specific practice topic from a saved explanation.
// Keep the request in the URL until the current block has finished.
(function (root) {
  function prepare({concepts, open, current, url, replaceUrl}) {
    const id = url.searchParams.get('practice');
    let requested = concepts.find(concept => concept.id === id);
    function consume() {
      const topic = requested;
      requested = null;
      url.searchParams.delete('practice');
      replaceUrl(url.pathname + url.search + url.hash);
      return topic;
    }
    return {
      get pending() { return requested; },
      resumeOrStart(continued = false) {
        if (!requested) return false;
        const active = current();
        if (active && !active.closed && active.stage !== 'done') {
          if (active.concept === requested.id) consume();
          return true;
        }
        open(consume().id, continued);
        return true;
      }
    };
  }
  root.TeachbackPractice = {prepare};
  if (typeof module === 'object' && module.exports) module.exports = {prepare};
})(typeof window === 'undefined' ? globalThis : window);
