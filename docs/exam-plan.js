(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.ExamPlan = api;
    var target = root.document && root.document.getElementById('exam-plan');
    if (target && root.ExamPlanContent) target.innerHTML = api.render(root.ExamPlanContent);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var statuses = {confirmed: 'Kinnitatud', planning: 'Planeerimiseesmärk', awaiting: 'Info ootel', 'previous-year': '2026. aasta reeglid'};
  function escape(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  function safeHref(url) { return /^https:\/\/[^\s]+$/.test(url || '') || /^\.\/[a-z0-9-]+\.html(?:\?[a-z0-9_=&-]+)?$/i.test(url || '') ? escape(url) : '#'; }
  function checked(date) { var p = String(date).split('-'); return /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? p[2] + '.' + p[1] + '.' + p[0] : escape(date); }
  function source(content, id) {
    var s = content.sources[id];
    if (!s) return '<small class="exam-plan-source">Allikas vajab kontrolli.</small>';
    return '<small class="exam-plan-source"><a href="' + safeHref(s.url) + '" rel="noopener noreferrer">' + escape(s.title) + '</a> · ' + escape(s.year) + ' · kontrollitud ' + checked(s.checkedAt) + '</small>';
  }
  function badge(status) { return '<span class="exam-plan-badge" data-status="' + escape(status) + '">' + escape(statuses[status] || 'Vajab kontrolli') + '</span>'; }
  function renderDate(content, item) {
    // Unknown/planning dates remain text; no estimated day or countdown is created.
    var value = item.status === 'confirmed' && /^\d{4}-\d{2}-\d{2}$/.test(item.date || '') ? '<time datetime="' + escape(item.date) + '">' + escape(item.label) + '</time>' : escape(item.label);
    return '<li><div class="exam-plan-date-title"><strong>' + escape(item.title) + '</strong>' + badge(item.status) + '</div><p class="exam-plan-date">' + value + '</p><p>' + escape(item.note) + '</p><small>Kehtiv aasta: ' + escape(item.year) + '</small>' + source(content, item.sourceId) + '</li>';
  }
  function renderSat(content) {
    var sat = content.sat;
    if (!sat) return '';
    var rules = sat.tartuRules, format = sat.format;
    var conversions = rules.conversions.map(function (row) { return '<tr><td>' + escape(row.sat) + '</td><td>' + escape(row.academic) + '</td></tr>'; }).join('');
    var dates = sat.possibleDates.map(function (row) { return '<li><strong>' + escape(row.label) + '</strong> · tavaregistreerimine ' + escape(row.registrationLabel) + '</li>'; }).join('');
    return '<section class="backup-card" id="sat-route"><h2>' + escape(sat.title) + '</h2><p>' + escape(sat.intro) + '</p>' +
      '<a class="backup-primary" href="' + safeHref(sat.href) + '">' + escape(sat.action) + '</a>' +
      '<details><summary>Kuidas alustada ja mida tulemus näitab?</summary><ol>' + sat.steps.map(function (step) { return '<li>' + escape(step) + '</li>'; }).join('') + '</ol><p>' + escape(sat.practiceNote) + '</p>' + source(content, 'academicSample') + source(content, 'bluebook') + '</details>' +
      '<details><summary>SAT-i formaat</summary><p>Reading and Writing: ' + escape(format.readingQuestions) + ' küsimust, ' + escape(format.readingMinutes) + ' minutit. Matemaatika: ' + escape(format.mathQuestions) + ' küsimust, ' + escape(format.mathMinutes) + ' minutit. Osade vahel on ' + escape(format.breakMinutes) + '-minutine paus.</p><p>' + escape(sat.formatNote) + '</p>' + source(content, format.sourceId) + '</details>' +
      '<details><summary>SAT ja Tartu: mida praegu teame?</summary>' + badge(rules.status) + '<p>' + escape(rules.note) + '</p><p>' + escape(rules.attemptsNote) + '</p><p>' + escape(rules.eligibilityNote) + '</p>' +
      '<table><caption>Valitud näited TÜ 2026. aasta SAT-i teisendustabelist</caption><thead><tr><th scope="col">SAT-i tulemus</th><th scope="col">Akadeemilise testi punktid</th></tr></thead><tbody>' + conversions + '</tbody></table><p>Need on ametliku tabeli näited, mitte selle äpi lühiharjutuste teisendus ega vastuvõtugarantii.</p>' + source(content, rules.sourceId) + source(content, 'tartu') + '</details>' +
      '<details><summary>Võimalikud SAT-i päevad, mitte broneeringud</summary><ul>' + dates + '</ul><p>' + escape(sat.datesNote) + '</p><p>' + escape(sat.bookingNote) + '</p>' + source(content, 'satDates') + '</details></section>';
  }
  function render(content) {
    var italy = content.italy, tartu = content.tartu;
    var weights = tartu.components.map(function (c) { return '<tr><th scope="row">' + escape(c.title) + '</th><td>' + escape(c.weight) + '%</td></tr>'; }).join('');
    var fields = italy.sections.map(function (s) { return escape(s.name) + ' ' + escape(s.questions); }).join(' · ');
    return '<p class="exam-plan-eyebrow">Meditsiiniõpe ' + escape(content.intakeYear) + '</p><h1>Itaalia sihiks.<br>Tartu võimalus avatuks.</h1>' +
      '<p>Ühised alusteadmised aitavad mõlemal teel. Siin on järgmised rõhuasetused ja ametlikest allikatest kontrollitud tähtajad.</p>' +
      '<section class="backup-card"><h2>Praegune fookus</h2><ul>' + content.focus.map(function (s) { return '<li>' + escape(s) + '</li>'; }).join('') + '</ul><a class="backup-primary" href="./index.html">Tagasi õppima</a></section>' +
      '<section class="backup-card"><h2>' + escape(italy.title) + '</h2><p>' + escape(italy.intro) + '</p><details><summary>IMAT-i formaat ja ainevalik</summary>' + badge(italy.status) + '<p>' + escape(italy.questions) + ' küsimust · ' + escape(italy.minutes) + ' minutit · kuni ' + escape(italy.maximum) + ' punkti.</p><p>' + fields + '.</p><p>Õige +1,5 · vale −0,4 · vastamata 0.</p><p>' + escape(italy.note) + '</p>' + source(content, italy.sourceId) + '</details></section>' +
      '<section class="backup-card"><h2>' + escape(tartu.title) + '</h2><p>Keemia ja füüsika väärivad tähelepanu juba praegu. Eesti keel ning arutlus- ja suhtlemisoskus on eraldi olulised.</p><details><summary>Millest Tartu tulemus koosneb?</summary>' + badge(tartu.status) + '<table><caption>Tartu arstiteaduse 2026. aasta konkursipunktide osakaalud</caption><thead><tr><th scope="col">Tulemus</th><th scope="col">Osakaal</th></tr></thead><tbody>' + weights + '</tbody></table><p>' + escape(tartu.note) + '</p>' + source(content, tartu.sourceId) + '</details></section>' +
      '<section class="backup-card"><h2>Lähimad tähtajad</h2><ul class="exam-plan-dates">' + content.dates.filter(function (d) { return d.kind !== 'information' && d.status !== 'awaiting'; }).map(function (d) { return renderDate(content, d); }).join('') + '</ul><details><summary>Millist 2027. aasta infot veel ootame?</summary><ul class="exam-plan-dates">' + content.dates.filter(function (d) { return d.kind === 'information' || d.status === 'awaiting'; }).map(function (d) { return renderDate(content, d); }).join('') + '</ul></details></section>' +
      '<section class="backup-card"><h2>Mida selles õppepakis harjutada saab?</h2><p>See on alusteadmiste ja valitud seoste õpe, mitte kogu eksamite ainekava. Teemade arv ei näita sinu läbimist ega oskust.</p><details><summary>Vaata aineid ja järgmisi lünki</summary><ul class="exam-plan-coverage">' + content.coverage.map(function (c) { return '<li><h3><a href="' + safeHref(c.href) + '">' + escape(c.title) + '</a> · ' + escape(c.topics) + ' teemat</h3><p>' + escape(c.scope) + '</p><p class="backup-muted">' + escape(c.gap) + '</p></li>'; }).join('') + '</ul><p>' + escape(content.later) + '</p></details></section>' +
      renderSat(content) + '<p class="backup-muted">Plaani allikad kontrollitud ' + checked(content.checkedAt) + '. Välislingid vajavad internetti.</p><a class="backup-secondary" href="./index.html">Valin järgmise sammu</a>';
  }
  return {escape: escape, safeHref: safeHref, renderDate: renderDate, renderSat: renderSat, render: render};
});
