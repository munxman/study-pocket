(function () {
  'use strict';

  function matches(question, value) {
    let input = String(value ?? '').trim();
    if (question.choices) return input === String(question.answer);
    if (/^[+-]?\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:[.,]\d+)?$/.test(input)) {
      input = input.replace(/[ \u00a0\u202f]/g, '');
    }
    if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(input)) return false;
    return Math.abs(Number(input.replace(',', '.')) - question.answer) < 1e-8;
  }

  function topicPriority(questions, earned, maximum) {
    const missed = new Map();
    questions.forEach((question, index) => {
      const loss = maximum(question) - earned[index];
      if (loss > 0) missed.set(question.topic, (missed.get(question.topic) || 0) + loss);
    });
    return [...missed].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([topic]) => topic);
  }

  if (typeof module === 'object' && module.exports) module.exports = { matches, topicPriority };
  if (typeof document === 'undefined') return;

  const data = globalThis.GeometrySprintContent;
  const byId = (id) => document.getElementById(id);
  const diagnosticKey = 'study-pocket-geometry-diagnostic-v1';
  const mockKey = 'study-pocket-geometry-mock-v1';
  const mockDuration = 35 * 60 * 1000;
  const number = new Intl.NumberFormat('et-EE', { maximumFractionDigits: 6 });

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The page works without storage. */ }
  }

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== null && text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function questionControl(question) {
    const wrapper = element('div');
    wrapper.append(element('p', question.prompt, 'sprint-question'));
    const label = element('label', null, 'sprint-control');
    label.append(element('span', question.unit ? 'Vastus (' + question.unit + ')' : 'Vastus'));
    const field = question.choices ? element('select', null, 'sprint-choice') : element('input');
    field.setAttribute('aria-label', question.prompt);
    if (question.choices) {
      const empty = element('option', 'Vali vastus');
      empty.value = '';
      field.append(empty);
      question.choices.forEach((choice, index) => {
        const option = element('option', choice);
        option.value = String(index);
        field.append(option);
      });
    } else {
      field.type = 'text';
      field.inputMode = 'decimal';
      field.autocomplete = 'off';
      field.maxLength = 20;
      field.placeholder = 'Arv';
    }
    label.append(field);
    wrapper.append(label);
    return { wrapper, field };
  }

  function answerText(question) {
    if (question.choices) return question.choices[question.answer];
    return number.format(question.answer) + (question.unit ? ' ' + question.unit : '');
  }

  function practiceLinks(topics) {
    const paragraph = element('p', 'Korda esimesena ');
    topics.forEach((topic, index) => {
      if (index) paragraph.append(' ja ');
      const link = element('a', data.topics[topic]);
      link.href = '#lesson-' + topic;
      link.addEventListener('click', () => { byId('lesson-' + topic).open = true; });
      paragraph.append(link);
    });
    paragraph.append('.');
    return paragraph;
  }

  const diagnosticList = byId('diagnostic-questions');
  const diagnosticFields = data.diagnostic.map((question) => {
    const { wrapper, field } = questionControl(question);
    const item = element('li');
    item.append(wrapper);
    diagnosticList.append(item);
    return field;
  });

  function showDiagnostic(values, focus) {
    const result = byId('diagnostic-result');
    const earned = data.diagnostic.map((question, index) => Number(matches(question, values[index])));
    const total = earned.reduce((sum, point) => sum + point, 0);
    const topics = topicPriority(data.diagnostic, earned, () => 1);
    result.replaceChildren(element('h3', 'Eeldiagnoos: ' + total + '/' + earned.length));
    result.append(topics.length
      ? element('p', 'Võta vead ükshaaval. Loe näide läbi ja tee kohe uus sama tüüpi ülesanne.')
      : element('p', 'Põhivõtted on olemas. Proovitöös näita ka iga vastuse põhjendust.'));
    if (topics.length) result.append(practiceLinks(topics));
    const breakdown = element('ol', null, 'sprint-results');
    data.diagnostic.forEach((question, index) => {
      const item = element('li');
      item.append(
        element('strong', earned[index] ? 'Õige' : values[index] ? 'Vajab kordamist' : 'Vahele jäetud'),
        element('p', 'Vastus: ' + answerText(question) + '. ' + question.explanation)
      );
      breakdown.append(item);
    });
    const details = element('details');
    details.append(element('summary', 'Vaata vastuseid ja selgitusi'), breakdown);
    result.append(details);
    result.hidden = false;
    if (focus) result.focus();
  }

  byId('diagnostic-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const values = diagnosticFields.map((field) => field.value);
    save(diagnosticKey, values);
    showDiagnostic(values, true);
  });

  function checkQuestion(question) {
    const form = element('form', null, 'sprint-inline-form');
    const { wrapper, field } = questionControl(question);
    const button = element('button', 'Kontrolli', 'secondary');
    button.type = 'submit';
    const feedback = element('p', null, 'sprint-feedback');
    feedback.setAttribute('role', 'status');
    feedback.hidden = true;
    field.required = true;
    form.append(wrapper, button, feedback);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const correct = matches(question, field.value);
      feedback.classList.toggle('sprint-missed', !correct);
      feedback.textContent = (correct ? 'Õige. ' : 'Õige vastus: ' + answerText(question) + '. ') + question.explanation;
      feedback.hidden = false;
    });
    return form;
  }

  const lessons = byId('lessons');
  for (const lesson of data.lessons) {
    const details = element('details', null, 'sprint-lesson');
    details.id = 'lesson-' + lesson.topic;
    details.append(element('summary', lesson.title));
    const list = element('ul');
    for (const rule of lesson.rules) list.append(element('li', rule));
    details.append(list);
    const diagram = byId('diagram-' + lesson.topic);
    if (diagram) details.append(diagram.content.cloneNode(true));
    const example = element('div', null, 'sprint-example');
    example.append(element('h3', 'Lahendatud näide'));
    for (const step of lesson.example) example.append(element('p', step));
    details.append(example);
    for (const question of lesson.practice) details.append(checkQuestion(question));
    lessons.append(details);
  }

  for (const question of data.warmup) {
    const details = element('details', null, 'sprint-lesson');
    details.append(element('summary', data.topics[question.topic]), checkQuestion(question));
    byId('warmup-questions').append(details);
  }

  const mockQuestions = byId('mock-questions');
  const mockMarking = byId('mock-marking');
  const maxMarks = data.mock.reduce((sum, question) => sum + question.marks.length, 0);
  const markFields = data.mock.map((question, index) => {
    const work = element('li');
    work.append(
      element('h3', question.title + ' · ' + question.marks.length + ' p'),
      element('p', question.prompt, 'sprint-question')
    );
    mockQuestions.append(work);
    const marking = element('li');
    const steps = element('ol');
    for (const mark of question.marks) steps.append(element('li', mark));
    const label = element('label', 'Sain punkte ', 'sprint-control');
    const select = element('select');
    select.setAttribute('aria-label', 'Ülesanne ' + (index + 1) + ': teenitud punktid');
    const empty = element('option', 'Vali');
    empty.value = '';
    select.append(empty);
    for (let points = 0; points <= question.marks.length; points++) {
      const option = element('option', points + '/' + question.marks.length);
      option.value = String(points);
      select.append(option);
    }
    label.append(select);
    marking.append(element('h3', question.title), steps, label);
    mockMarking.append(marking);
    return select;
  });

  let mock = read(mockKey);
  if (!mock || typeof mock.started !== 'number' || !Number.isFinite(mock.started)) mock = null;
  let timer = 0;

  function showMarks() {
    const result = byId('mock-result');
    const values = markFields.map((field) => field.value);
    const done = values.filter((value) => value !== '').length;
    mock.marks = values;
    save(mockKey, mock);
    if (done < values.length) {
      result.replaceChildren(element('p', 'Märgitud ' + done + '/' + values.length + ' ülesannet.'));
      return;
    }
    const points = values.map(Number);
    const total = points.reduce((sum, value) => sum + value, 0);
    const topics = topicPriority(data.mock, points, (question) => question.marks.length);
    result.replaceChildren(element('h3', 'Proovitöö: ' + total + '/' + maxMarks + ' punkti'));
    if (total >= 22) {
      result.append(element('p', 'Harjutuse siht on täidetud. Näita ka koolitöös, miks su valem või omadus sobib.'));
    } else {
      result.append(element('p', 'Vali üks kaotatud punkt, paranda selle lahenduskäik ja tee uus samatüübiline ülesanne.'));
    }
    if (topics.length) result.append(practiceLinks(topics));
  }

  function updateTimer() {
    const remaining = Math.max(0, Math.ceil((mock.started + mockDuration - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    byId('mock-clock').textContent = minutes + ':' + String(remaining % 60).padStart(2, '0');
    if (!remaining) {
      byId('mock-notice').textContent = '35 minutit on täis. Märgi, kuhu jõudsid, ja ava lahendused.';
      clearInterval(timer);
    }
  }

  function showMock() {
    byId('mock-start').hidden = true;
    byId('mock-work').hidden = false;
    byId('mock-finish').hidden = Boolean(mock.finished);
    byId('mock-key').hidden = !mock.finished;
    byId('mock-clock').hidden = Boolean(mock.finished);
    if (mock.finished) {
      byId('mock-notice').textContent = 'Proovitöö on lõpetatud.';
      markFields.forEach((field, index) => { field.value = mock.marks?.[index] ?? ''; });
      showMarks();
    } else {
      updateTimer();
      if (Date.now() < mock.started + mockDuration) timer = setInterval(updateTimer, 1000);
    }
  }

  byId('mock-start').addEventListener('click', () => {
    mock = { started: Date.now(), finished: false };
    save(mockKey, mock);
    showMock();
    byId('mock-clock').tabIndex = -1;
    byId('mock-clock').focus();
  });
  byId('mock-finish').addEventListener('click', () => {
    clearInterval(timer);
    mock.finished = true;
    save(mockKey, mock);
    showMock();
    byId('key-title').focus();
  });
  for (const field of markFields) field.addEventListener('change', showMarks);

  const savedDiagnostic = read(diagnosticKey);
  if (Array.isArray(savedDiagnostic) && savedDiagnostic.length === diagnosticFields.length) {
    diagnosticFields.forEach((field, index) => { field.value = savedDiagnostic[index]; });
    showDiagnostic(diagnosticFields.map((field) => field.value), false);
  }
  if (mock) showMock();
})();
