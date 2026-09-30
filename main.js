import { createStore } from './program/store.js';
import { html } from './ui/html.js';
import { App } from './ui/App.js';

// ?theme=light|dark forces a colour scheme (handy for checking both); otherwise the system setting applies.
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme');
if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;

async function start() {
  const rootEl = document.getElementById('root');

  // Archived program: only reachable by typing ?legacy=1, never linked.
  if (params.get('legacy') === '1') {
    rootEl.innerHTML = '';
    const { loadLegacy } = await import('./legacy/load.js');
    await loadLegacy();
    return;
  }

  const store = createStore(window.storage);
  await store.load();
  window.ReactDOM.createRoot(rootEl).render(html`<${App} store=${store} />`);
}

start();
