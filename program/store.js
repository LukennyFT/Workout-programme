// @ts-check
import { defaultState, loadState, saveState, tickKey, noteKey, validateState } from './state.js';
import { MAX_LEVEL } from './resolve.js';

/** @typedef {import('./types').ProgramState} ProgramState */
/** @typedef {import('./types').WeekKey} WeekKey */
/** @typedef {import('./types').LadderKey} LadderKey */
/** @typedef {import('./types').StorageLike} StorageLike */

/**
 * The one shared store. Both skins read and write through this, so flipping skins keeps
 * the same week, levels, ticks and notes. No React and no styling in here.
 * @param {StorageLike | undefined | null} storage
 */
export function createStore(storage) {
  let state = defaultState();
  /** @type {Set<() => void>} */
  const listeners = new Set();

  /** @param {ProgramState} next */
  function commit(next) {
    state = next;
    listeners.forEach((l) => l());
    void saveState(storage, state);
  }

  return {
    getState: () => state,
    /** @param {() => void} fn */
    subscribe(fn) {
      listeners.add(fn);
      return () => void listeners.delete(fn);
    },
    /** Read persisted state (migrated and validated), then write it back so storage is current. */
    async load() {
      state = await loadState(storage);
      listeners.forEach((l) => l());
      await saveState(storage, state);
    },
    /** @param {unknown} week */
    setWeek(week) {
      commit({ ...state, week: validateState({ week }).week });
    },
    /** @param {LadderKey} key @param {number} value */
    setLevel(key, value) {
      if (!Number.isInteger(value) || value < 0 || value > MAX_LEVEL[key]) return;
      commit({ ...state, levels: { ...state.levels, [key]: value } });
    },
    /** @param {number} si @param {number} ei @param {number} k */
    toggleTick(si, ei, k) {
      const key = tickKey(state.week, si, ei, k);
      const ticks = { ...state.ticks };
      if (ticks[key]) delete ticks[key];
      else ticks[key] = true;
      commit({ ...state, ticks });
    },
    /** Clears ticks for the selected week only. Notes are kept. */
    clearWeekTicks() {
      const prefix = `${state.week}|`;
      const ticks = Object.fromEntries(Object.entries(state.ticks).filter(([k]) => !k.startsWith(prefix)));
      commit({ ...state, ticks });
    },
    /** @param {number} si @param {number} ei @param {string} text */
    setNote(si, ei, text) {
      const notes = { ...state.notes };
      const key = noteKey(state.week, si, ei);
      if (text.trim()) notes[key] = text.slice(0, 2000);
      else delete notes[key];
      commit({ ...state, notes });
    },
  };
}
