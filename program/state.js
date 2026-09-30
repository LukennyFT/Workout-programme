// @ts-check
import { WEEKS } from './data.js';
import { MAX_LEVEL } from './resolve.js';

/** @typedef {import('./types').ProgramState} ProgramState */
/** @typedef {import('./types').Levels} Levels */
/** @typedef {import('./types').WeekKey} WeekKey */
/** @typedef {import('./types').StorageLike} StorageLike */
/** @typedef {import('./types').ResolvedExercise} ResolvedExercise */

export const STORAGE_KEY = 'ring-program-v1';
/** Bump when exercises are added, removed or reordered, and add a migration below. */
export const STATE_VERSION = 2;
export const DEFAULT_LEVELS = /** @type {Levels} */ ({ df: 1, pu: 2, push: 3, roller: 1 });
const MAX_NOTE = 2000;

/** @returns {ProgramState} */
export function defaultState() {
  return { v: STATE_VERSION, week: 'standard', levels: { ...DEFAULT_LEVELS }, ticks: {}, notes: {} };
}

/** @param {unknown} v @returns {v is Record<string, unknown>} */
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

/** @param {unknown} v @param {number} max @param {number} fallback */
function level(v, max, fallback) {
  const n = typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : NaN;
  return Number.isInteger(n) && n >= 0 && n <= max ? n : fallback;
}

const weekAlt = Object.keys(WEEKS).join('|');
const TICK_KEY = new RegExp(`^(${weekAlt})\\|\\d+\\|\\d+\\|\\d+$`);
const NOTE_KEY = new RegExp(`^(${weekAlt})\\|\\d+\\|\\d+$`);

/**
 * Turn anything read from storage into a valid state. Never throws.
 * Unknown week falls back to standard, bad levels to the defaults, junk ticks and notes are dropped.
 * @param {unknown} raw
 * @returns {ProgramState}
 */
export function validateState(raw) {
  const out = defaultState();
  if (!isObject(raw)) return out;
  if (typeof raw.week === 'string' && Object.prototype.hasOwnProperty.call(WEEKS, raw.week)) {
    out.week = /** @type {WeekKey} */ (raw.week);
  }
  const lv = isObject(raw.levels) ? raw.levels : {};
  out.levels = {
    df: level(lv.df, MAX_LEVEL.df, DEFAULT_LEVELS.df),
    pu: level(lv.pu, MAX_LEVEL.pu, DEFAULT_LEVELS.pu),
    push: level(lv.push, MAX_LEVEL.push, DEFAULT_LEVELS.push),
    // State saved before the roller ladder existed has no roller level: fall back to the default.
    roller: level(lv.roller, MAX_LEVEL.roller, DEFAULT_LEVELS.roller),
  };
  if (isObject(raw.ticks)) {
    for (const [k, v] of Object.entries(raw.ticks)) {
      if (v === true && TICK_KEY.test(k)) out.ticks[k] = true;
    }
  }
  if (isObject(raw.notes)) {
    for (const [k, v] of Object.entries(raw.notes)) {
      if (typeof v === 'string' && v.trim() && NOTE_KEY.test(k)) out.notes[k] = v.slice(0, MAX_NOTE);
    }
  }
  return out;
}

/**
 * v1 to v2 moved exercises within four sessions (push-up plus, skull crushers, roller and overhead
 * extension were added; fallouts and the old triceps extension were swapped out). Ticks and notes are
 * stored by position, so they are re-pointed to the same exercise, and dropped where the exercise is gone.
 * Keyed `${week}|${sessionIdx}`; each value maps old exercise index to new exercise index.
 * @type {Record<string, Record<number, number>>}
 */
const V1_TO_V2 = {
  'standard|2': { 0: 0, 1: 1, 2: 3, 3: 4, 4: 5, 6: 7, 8: 9 },
  'standard|3': { 0: 0, 1: 1, 2: 2, 3: 4, 4: 5, 5: 6 },
  'lean|2': { 0: 0, 1: 1, 2: 3, 3: 4, 4: 6, 6: 8 },
  'deload|1': { 0: 0, 1: 1, 2: 2, 3: 3, 4: 5, 5: 7 },
};

/**
 * @param {string} key position key with the exercise index at `exIdx` (2)
 * @returns {string | null} re-pointed key, or null if that exercise no longer exists
 */
function remapKey(key) {
  const parts = key.split('|');
  const map = V1_TO_V2[`${parts[0]}|${parts[1]}`];
  if (!map) return key;
  const next = map[Number(parts[2])];
  if (next === undefined) return null;
  parts[2] = String(next);
  return parts.join('|');
}

/**
 * Bring stored data up to the current program version. Never throws; leaves non-objects alone.
 * @param {unknown} raw
 * @returns {unknown}
 */
export function migrateState(raw) {
  if (!isObject(raw)) return raw;
  const version = typeof raw.v === 'number' ? raw.v : 1;
  if (version >= STATE_VERSION) return raw;
  /** @param {unknown} src */
  const move = (src) => {
    /** @type {Record<string, unknown>} */
    const out = {};
    if (!isObject(src)) return out;
    for (const [k, v] of Object.entries(src)) {
      const nk = remapKey(k);
      if (nk) out[nk] = v;
    }
    return out;
  };
  return { ...raw, v: STATE_VERSION, ticks: move(raw.ticks), notes: move(raw.notes) };
}

/** Ticks are keyed by position so a level change never orphans them. */
export const tickKey = (/** @type {WeekKey} */ week, /** @type {number} */ si, /** @type {number} */ ei, /** @type {number} */ k) =>
  `${week}|${si}|${ei}|${k}`;
export const noteKey = (/** @type {WeekKey} */ week, /** @type {number} */ si, /** @type {number} */ ei) => `${week}|${si}|${ei}`;

/**
 * Ticked / total sets for one session. Only slots that currently exist are counted.
 * @param {ProgramState} state
 * @param {number} si
 * @param {ResolvedExercise[]} exercises
 */
export function sessionProgress(state, si, exercises) {
  let done = 0;
  let total = 0;
  exercises.forEach((ex, ei) => {
    for (let k = 0; k < ex.sets; k++) {
      total++;
      if (state.ticks[tickKey(state.week, si, ei, k)]) done++;
    }
  });
  return { done, total, complete: total > 0 && done === total };
}

/** @param {StorageLike | undefined | null} storage @returns {Promise<ProgramState>} */
export async function loadState(storage) {
  try {
    const res = storage ? await storage.get(STORAGE_KEY) : null;
    if (!res || typeof res.value !== 'string') return defaultState();
    return validateState(migrateState(JSON.parse(res.value)));
  } catch {
    return defaultState();
  }
}

/** @param {StorageLike | undefined | null} storage @param {ProgramState} state */
export async function saveState(storage, state) {
  try {
    if (storage) await storage.set(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}
