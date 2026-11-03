'use strict';

(() => {
  const panel = document.getElementById('return-cue');
  const form = document.getElementById('cue-form');
  const summary = document.getElementById('cue-summary');
  const input = document.getElementById('cue-input');
  const remove = document.getElementById('cue-remove');
  const status = document.getElementById('cue-status');
  const key = 'opitasku-local-return-cue-v1';
  const prompt = summary.textContent;

  function show(plan) {
    input.value = plan;
    summary.textContent = plan ? 'Minu õppimishetk: ' + plan : prompt;
    remove.hidden = !plan;
  }

  try {
    show((localStorage.getItem(key) || '').slice(0, 80));
    panel.hidden = false;
  } catch {
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const plan = input.value.trim().slice(0, 80);
    if (!plan) {
      status.textContent = 'Kirjuta üks tegevus, mille järel tahad õppida.';
      input.focus();
      return;
    }
    try {
      localStorage.setItem(key, plan);
      show(plan);
      status.textContent = 'Plaan on salvestatud.';
    } catch {
      status.textContent = 'Brauser ei saanud plaani salvestada.';
    }
  });
  remove.addEventListener('click', () => {
    try {
      localStorage.removeItem(key);
      show('');
      status.textContent = 'Plaan on eemaldatud.';
      input.focus();
    } catch {
      status.textContent = 'Brauser ei saanud plaani eemaldada.';
    }
  });
})();
