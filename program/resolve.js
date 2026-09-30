// @ts-check
import { LADDERS, WEEKS } from './data.js';

/** @typedef {import('./types').ExerciseSpec} ExerciseSpec */
/** @typedef {import('./types').Levels} Levels */
/** @typedef {import('./types').ResolvedExercise} ResolvedExercise */
/** @typedef {import('./types').WeekKey} WeekKey */
/** @typedef {import('./types').LadderKey} LadderKey */

/** Highest valid level per ladder. */
export const MAX_LEVEL = /** @type {Record<LadderKey, number>} */ (
  Object.fromEntries(LADDERS.map((l) => [l.key, l.steps.length - 1]))
);

/** Dragon flag work by level (Appendix A). Rest is 2 min at every level. */
const DF = [
  { name: 'Lying tuck raises', reps: '8–12 slow reps', cue: 'Lie on a bench and hold behind your head. Curl knees to chest and lift the hips, 3 s lowering, lower back stays flat.' },
  { name: 'Tuck dragon flag', reps: '5–8 reps', cue: 'Knees to chest, hips and lower back off the bench so only the shoulders touch. 3 s lowering.' },
  { name: 'Advanced tuck dragon flag', reps: '4–6 reps', cue: 'Open the hips so the thighs line up with the torso and the knees stay bent. Straight line from shoulders to hips.' },
  { name: 'Single-leg dragon flag', reps: '3–5 reps per leg', cue: 'One leg straight, the other tucked. Swap legs each set.' },
  { name: 'Straddle dragon flag', reps: '3–5 reps', cue: 'Both legs straight and wide. Keep the hips extended and do not pike.' },
  { name: 'Full dragon flag negatives', reps: '3–4 reps, 5–6 s lowering', cue: 'Lift with a tuck, extend the legs, then lower the straight body slowly. Stop where the body starts to pike.' },
  { name: 'Full dragon flag', reps: '2–5 reps or 3–5 s holds', cue: 'Body straight from shoulders to toes. Add a rep or a second before adding sets.' },
];

const STRICT_CUE = 'Full hang to chin over the bar, no kipping. If your max is 5, do sets of 3.';
/** Heavy pull by pu level. `reps` follows "{s} × ". */
const HEAVY = [
  { name: 'Eccentric pull-ups', reps: '3 reps, 5 s lowering', rest: '2–3 min', cue: 'Jump or step to the top, then lower slowly. Rings or bar.' },
  { name: 'Strict pull-ups', reps: 'max − 2 reps', rest: '2–3 min', cue: STRICT_CUE },
  { name: 'Strict pull-ups', reps: 'max − 2 reps', rest: '2–3 min', cue: STRICT_CUE },
  { name: 'Weighted pull-ups', reps: '5 reps', rest: '2–3 min', cue: 'Start with about 5 kg in a backpack or belt. Add 2.5 kg when every set is clean.' },
  { name: 'Weighted ring pull-ups', reps: '3–5 reps', rest: '2–3 min', cue: 'Turn the rings out at the top. Use a weight you can control on every rep.' },
];

const EMOM_CUE = 'Start a new set every minute for eight minutes. Tick each minute. Stop early if form drops.';
/** Pull volume block by pu level. The level fixes the set count and the whole dose text. */
const VOLUME = [
  { name: 'Ring rows, feet raised', sets: 4, dose: '4 × 10–12', rest: '90 s', cue: 'Rings at waist height, feet on a bench. Chest to the rings, 2 s lowering.' },
  { name: 'Pull-up EMOM', sets: 8, dose: '8 min, half your max reps', rest: 'On the minute', cue: EMOM_CUE },
  { name: 'Pull-up EMOM', sets: 8, dose: '8 min, half your max reps', rest: 'On the minute', cue: EMOM_CUE },
  { name: 'Pull-up EMOM', sets: 10, dose: '10 min, 5 reps', rest: 'On the minute', cue: 'Ten minutes, five reps on the minute. Stop early if form drops.' },
  { name: 'Weighted pull-up EMOM', sets: 10, dose: '10 min, 4 reps', rest: 'On the minute', cue: 'About 60% of your heavy weight. Stop early if form drops.' },
];

const EXPLOSIVE = { name: 'Explosive pull-ups', reps: '3 reps', rest: '2 min', cue: 'Pull as fast as you can and aim for chest to bar. Rest fully. This is speed work, not fatigue work.' };
/** Explosive pull by pu level. */
const POWER = [
  { name: 'Jumping pull-ups', reps: '5 reps', rest: '90 s', cue: 'Jump from the floor, pull fast, lower under control.' },
  EXPLOSIVE, EXPLOSIVE, EXPLOSIVE, EXPLOSIVE,
];

const PLUS_FINISH = ' Finish each rep with a small extra push so the shoulder blades spread.';
/** Main push by push level. Steps 0 and 1 finish with a serratus push. */
const PUSH = [
  { name: 'Ring push-ups', reps: '8–12', cue: `Rings low, feet on the floor. Body straight, rings close to the ribs.${PLUS_FINISH}` },
  { name: 'Ring push-ups, feet raised', reps: '8–10', cue: `Feet on a bench. Turn the hands out at the top for extra chest and support strength.${PLUS_FINISH}` },
  { name: 'Ring dip negatives', reps: '4–5 reps, 5 s lowering', cue: 'Start in a support hold. Lower slowly below the rings, then step out or jump back up.' },
  { name: 'Ring dips', reps: '6–10', cue: 'Rings turned out at the top. Slow and steady, no swinging.' },
  { name: 'Weighted ring dips', reps: '5–8', cue: 'Start with about 5 kg. Add 2.5 kg when every set is clean.' },
];

const ROLL_FINISH = ' Finish each rep by pushing the floor away for 2 s so the shoulder blades spread.';
/** Ab roller work by roller level. Rest is 90 s; every cue ends with the serratus finish. */
const ROLLER = [
  { name: 'Kneeling short-range rollouts', reps: '10–12 reps', cue: `Roll out about arm's length. Ribs down, no lower back sag. Slow out, slow back.${ROLL_FINISH}` },
  { name: 'Kneeling full-range rollouts', reps: '8–10 reps', cue: `Roll out to full stretch and pull back with the abs. Ribs down, no lower back sag.${ROLL_FINISH}` },
  { name: 'Kneeling rollouts, 2 s pause at full stretch', reps: '6–8 reps', cue: `Pause for 2 s at full stretch, then pull back with the abs. Ribs down, no lower back sag.${ROLL_FINISH}` },
  { name: 'Standing short-range rollouts', reps: '5–8 reps', cue: `Roll out about halfway from standing. Keep the body straight.${ROLL_FINISH}` },
  { name: 'Standing full rollouts', reps: '4–6 reps', cue: `Roll out to full stretch from standing. Keep the body straight and build reps slowly.${ROLL_FINISH}` },
];

/**
 * @param {ExerciseSpec} spec
 * @param {Levels} levels
 * @returns {ResolvedExercise}
 */
export function resolveExercise(spec, levels) {
  if (spec.kind === 'fixed') {
    return { name: spec.name, sets: spec.sets, dose: spec.dose, rest: spec.rest, cue: spec.cue };
  }
  const level = levels[spec.ladder];
  const s = spec.sets ?? 0;
  switch (spec.variant) {
    case 'dragonFlag': {
      const t = DF[level];
      return { name: t.name, sets: s, dose: `${s} × ${t.reps}`, rest: '2 min', cue: t.cue };
    }
    case 'heavyPull': {
      const t = HEAVY[level];
      return { name: t.name, sets: s, dose: `${s} × ${t.reps}`, rest: t.rest, cue: t.cue };
    }
    case 'volumeBlock': {
      const t = VOLUME[level];
      return { name: t.name, sets: t.sets, dose: t.dose, rest: t.rest, cue: t.cue };
    }
    case 'explosivePull': {
      const t = POWER[level];
      return { name: t.name, sets: s, dose: `${s} × ${t.reps}`, rest: t.rest, cue: t.cue };
    }
    case 'abRoller': {
      const t = ROLLER[level];
      return { name: t.name, sets: s, dose: `${s} × ${t.reps}`, rest: '90 s', cue: t.cue };
    }
    case 'mainPush': {
      const t = PUSH[level];
      return { name: t.name, sets: s, dose: `${s} × ${t.reps}`, rest: '2 min', cue: t.cue };
    }
    default:
      throw new Error(`Unknown ladder variant: ${/** @type {any} */ (spec).variant}`);
  }
}

/**
 * Every session of a week with its exercises resolved for the given levels.
 * @param {WeekKey} weekKey
 * @param {Levels} levels
 */
export function resolveWeek(weekKey, levels) {
  const week = WEEKS[weekKey];
  return {
    week,
    sessions: week.sessions.map((session) => ({
      session,
      exercises: session.exercises.map((spec) => resolveExercise(spec, levels)),
    })),
  };
}

/**
 * Text under a ladder step: what to hit before moving up.
 * @param {import('./types').Ladder} ladder
 * @param {number} i
 */
export function moveUpText(ladder, i) {
  const t = ladder.steps[i].moveUpWhen;
  return i === ladder.steps.length - 1 ? t : `Move up when you hit ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
}

/** Accessible label for one set tick. @param {ResolvedExercise} ex @param {number} k */
export function tickLabel(ex, k) {
  return `${ex.name}, set ${k + 1} of ${ex.sets}`;
}
