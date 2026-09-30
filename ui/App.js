// The ring program UI. Visual identity from docs/reference/ring-program.html; styles in ring.css.
import { html, useState, useRef, useShellBackground, Tick } from './html.js';
import { useProgram } from '../program/useProgram.js';
import { LADDERS, WEEKS, WEEK_ORDER } from '../program/data.js';
import { resolveWeek, moveUpText, tickLabel } from '../program/resolve.js';
import { sessionProgress, tickKey, noteKey } from '../program/state.js';
import * as ref from '../program/reference.js';

function Rings() {
  return html`<svg class="rings" viewBox="0 0 200 250" aria-hidden="true" focusable="false">
    <line class="bar" x1="10" y1="10" x2="190" y2="10" />
    <g transform="translate(58 10)"><g class="swing">
      <rect class="strap" x="-4" y="0" width="8" height="118" />
      <rect class="buckle" x="-7" y="70" width="14" height="16" rx="3" />
      <circle class="ring" cx="0" cy="152" r="32" />
    </g></g>
    <g transform="translate(142 10)"><g class="swing b">
      <rect class="strap" x="-4" y="0" width="8" height="118" />
      <rect class="buckle" x="-7" y="70" width="14" height="16" rx="3" />
      <circle class="ring" cx="0" cy="152" r="32" />
    </g></g>
  </svg>`;
}

function Rules({ items }) {
  return html`<ul class="rules">${items.map(([t, x]) => html`<li key=${t}><strong>${t}</strong>${x}</li>`)}</ul>`;
}

function Exercise({ store, state, si, ei, ex }) {
  const nk = noteKey(state.week, si, ei);
  const note = state.notes[nk] || '';
  const hasNote = note.trim().length > 0;
  // Starts open when there is already a note; after that the reader controls it.
  const [noteOpen, setNoteOpen] = useState(hasNote);
  return html`<li class="ex">
    <div class="ex-head"><span class="ex-name">${ex.name}</span><span class="ex-dose">${ex.dose}</span></div>
    <div class="ex-sub">${ex.rest ? `Rest ${ex.rest}. ` : ''}${ex.cue}</div>
    <div class="sets">
      ${Array.from({ length: ex.sets }, (_, k) => html`<${Tick}
        key=${k}
        cls="tick"
        text=${String(k + 1)}
        label=${tickLabel(ex, k)}
        checked=${!!state.ticks[tickKey(state.week, si, ei, k)]}
        onChange=${() => store.toggleTick(si, ei, k)} />`)}
    </div>
    <details class="note" open=${noteOpen} onToggle=${(e) => setNoteOpen(e.currentTarget.open)}>
      <summary>
        <span>Notes (loads, reps, observations)</span>
        ${hasNote && html`<span class="note-dot" role="img" aria-label="Note saved"></span>`}
      </summary>
      <textarea rows="2" aria-label=${`Notes for ${ex.name}`} placeholder="e.g. 4×10 with 5kg vest, felt strong on set 3"
        value=${note} onInput=${(e) => store.setNote(si, ei, e.target.value)}></textarea>
    </details>
  </li>`;
}

function SessionBlock({ store, state, si, s, exercises }) {
  const [open, setOpen] = useState(si === 0);
  const p = sessionProgress(state, si, exercises);
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
  return html`<details class="session" open=${open} onToggle=${(e) => setOpen(e.currentTarget.open)}>
    <summary>
      <span class="name">
        <h3>${s.name}</h3>
        <span class="time">${s.time}</span>
      </span>
      <span class=${'prog' + (p.complete ? ' full' : '')} aria-label=${`${p.done} of ${p.total} sets done`}>${p.done}/${p.total}</span>
      <span class="bar" aria-hidden="true"><span style=${{ width: pct + '%' }}></span></span>
    </summary>
    <p class="warm"><strong>Warm-up.</strong> ${s.warmUp}</p>
    <ul class="exlist">
      ${exercises.map((ex, ei) => html`<${Exercise} key=${ei} store=${store} state=${state} si=${si} ei=${ei} ex=${ex} />`)}
    </ul>
  </details>`;
}

export function App({ store }) {
  const root = useRef(null);
  useShellBackground(root);
  const state = useProgram(store);

  const { week, sessions } = resolveWeek(state.week, state.levels);

  return html`<div class="skin-ring" ref=${root}>
  <main>
    <header class="hero">
      <div><h1>${ref.HERO_TITLE}</h1><p>${ref.HERO_TEXT}</p></div>
      <${Rings} />
    </header>

    <section aria-labelledby="ring-h-levels">
      <h2 id="ring-h-levels">Your current steps</h2>
      <p class="muted">${ref.LEVELS_TEXT}</p>
      <div class="levels">
        ${LADDERS.map((l) => html`<div class="field" key=${l.key}>
          <label for=${'ring-sel-' + l.key}>${l.title}</label>
          <select id=${'ring-sel-' + l.key} value=${String(state.levels[l.key])}
            onChange=${(e) => store.setLevel(l.key, Number(e.target.value))}>
            ${l.steps.map((s, i) => html`<option key=${i} value=${String(i)}>${s.name}</option>`)}
          </select>
        </div>`)}
      </div>
    </section>

    <section aria-labelledby="ring-h-week">
      <h2 id="ring-h-week">Pick your week</h2>
      <div class="picker" role="group" aria-label="Week type">
        ${WEEK_ORDER.map((k) => html`<button key=${k} type="button" class="week-btn"
          aria-pressed=${k === state.week} onClick=${() => store.setWeek(k)}>
          <span class="t">${WEEKS[k].name}</span><span class="m">${WEEKS[k].meta}</span>
        </button>`)}
      </div>
      <div class="panel" aria-live="polite">
        <h3>${week.name} week</h3>
        <p style=${{ marginTop: '8px' }}>${week.whenToUse}</p>
        <dl class="facts">${week.facts.map(([k, v]) => html`<div key=${k}><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
        <ul class="notes">${week.notes.map((n) => html`<li key=${n}>${n}</li>`)}</ul>
        ${sessions.map(({ session, exercises }, si) => html`<${SessionBlock}
          key=${state.week + si} store=${store} state=${state} si=${si} s=${session} exercises=${exercises} />`)}
        ${week.snacks && html`<div class="snacks"><h3>Between calls</h3>
          <ul class="notes" style=${{ marginTop: '8px' }}>
            ${week.snacks.map(([t, x]) => html`<li key=${t}><strong>${t}.</strong> ${x}</li>`)}
          </ul></div>`}
        <button type="button" class="reset" onClick=${() => store.clearWeekTicks()}>Clear ticks for this week</button>
      </div>
    </section>

    <section aria-labelledby="ring-h-block">
      <h2 id="ring-h-block">Four-week block</h2>
      <p class="muted">${ref.BLOCK_INTRO}</p>
      <ol class="block">${ref.BLOCK_WEEKS.map(([t, x]) => html`<li key=${t}><strong>${t}</strong>${x}</li>`)}</ol>
      <p style=${{ marginTop: '14px' }}>${ref.BLOCK_NOTE}</p>
    </section>

    <section aria-labelledby="ring-h-rota">
      <h2 id="ring-h-rota">Fitting it around the rota</h2>
      <${Rules} items=${ref.ROTA_RULES} />
    </section>

    <section aria-labelledby="ring-h-ladders">
      <h2 id="ring-h-ladders">Progressions</h2>
      <p class="muted">${ref.LADDERS_TEXT}</p>
      <div class="ladders">
        ${LADDERS.map((l) => html`<div class="ladder" key=${l.key}>
          <h3>${l.title}</h3>
          ${l.note && html`<p class="muted ladder-note">${l.note}</p>`}
          <ol>${l.steps.map((s, i) => html`<li key=${i} class=${i === state.levels[l.key] ? 'here' : ''}
            aria-current=${i === state.levels[l.key] ? 'step' : undefined}>
            <b>${s.name}</b><span>${moveUpText(l, i)}</span></li>`)}</ol>
        </div>`)}
      </div>
    </section>

    <section aria-labelledby="ring-h-fuel">
      <h2 id="ring-h-fuel">Fuel and recovery</h2>
      <${Rules} items=${ref.FUEL_RULES} />
    </section>

    <footer>${ref.SAVE_NOTE}</footer>
  </main>
  </div>`;
}
