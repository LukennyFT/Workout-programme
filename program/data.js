// @ts-check
// Program content. Appendices A and B of the brief are the source; no styling in here.

/** @typedef {import('./types').Ladder} Ladder */
/** @typedef {import('./types').WeekType} WeekType */
/** @typedef {import('./types').WeekKey} WeekKey */
/** @typedef {import('./types').ExerciseSpec} ExerciseSpec */
/** @typedef {import('./types').Variant} Variant */
/** @typedef {import('./types').LadderKey} LadderKey */

/** @type {Ladder[]} */
export const LADDERS = [
  {
    key: 'df',
    title: 'Dragon flag',
    steps: [
      { name: 'Lying tuck raises', moveUpWhen: '4 × 12 with a 3 s lowering and a flat lower back.' },
      { name: 'Tuck dragon flag', moveUpWhen: '4 × 8 with the hips fully lifted and no swinging.' },
      { name: 'Advanced tuck dragon flag', moveUpWhen: '4 × 6 clean.' },
      { name: 'Single-leg dragon flag', moveUpWhen: '4 × 5 on each leg.' },
      { name: 'Straddle dragon flag', moveUpWhen: '4 × 5 with straight legs.' },
      { name: 'Full dragon flag negatives', moveUpWhen: '5 × 4 with a 5 s lowering and a straight body from shoulders to toes.' },
      { name: 'Full dragon flag', moveUpWhen: 'You are here. Build reps and holds.' },
    ],
  },
  {
    key: 'pu',
    title: 'Pull-ups',
    steps: [
      { name: 'Eccentric pull-ups', moveUpWhen: 'One clean strict rep, or 5 × 3 eccentrics with a 5 s lowering.' },
      { name: 'Strict pull-ups, up to 5', moveUpWhen: 'A max of 6 strict reps.' },
      { name: 'Strict pull-ups, 6 to 9', moveUpWhen: 'A max of 10 strict reps.' },
      { name: 'Strict pull-ups, 10 or more', moveUpWhen: '5 × 5 with 10 kg added.' },
      { name: 'Weighted and ring pull-ups', moveUpWhen: 'You are here. Add weight slowly.' },
    ],
  },
  {
    key: 'push',
    title: 'Dips and push-ups',
    steps: [
      { name: 'Ring push-ups', moveUpWhen: '4 × 12 with steady rings.' },
      { name: 'Ring push-ups, feet raised', moveUpWhen: '4 × 10 with the hands turning out at the top.' },
      { name: 'Ring dip negatives', moveUpWhen: '4 × 5 with a 5 s lowering and a 30 s support hold.' },
      { name: 'Ring dips', moveUpWhen: '4 × 10 clean with the rings turned out.' },
      { name: 'Weighted ring dips', moveUpWhen: 'You are here. Add weight slowly.' },
    ],
  },
  {
    key: 'roller',
    title: 'Ab roller',
    note: 'No roller to hand? Ring fallouts on your knees, 3 × 8–10, are the fallback.',
    steps: [
      { name: 'Kneeling short-range rollouts', moveUpWhen: '3 × 12 with ribs down and no lower back sag.' },
      { name: 'Kneeling full-range rollouts', moveUpWhen: '3 × 10 without the hips dropping.' },
      { name: 'Kneeling rollouts, 2 s pause at full stretch', moveUpWhen: '3 × 8 with the pause.' },
      { name: 'Standing short-range rollouts', moveUpWhen: '3 × 8 with a straight body.' },
      { name: 'Standing full rollouts', moveUpWhen: 'You are here. Build reps slowly.' },
    ],
  },
];

/** @type {WeekKey[]} */
export const WEEK_ORDER = ['standard', 'lean', 'oncall', 'nights', 'deload'];

// ---- spec builders (plain data out) ----

/** @param {string} name @param {number} sets @param {string} reps @param {string} rest @param {string} cue @returns {ExerciseSpec} */
const fx = (name, sets, reps, rest, cue) => ({ kind: 'fixed', name, sets, dose: `${sets} × ${reps}`, rest, cue });

/** @param {LadderKey} ladder @param {Variant} variant @param {number} [sets] @returns {ExerciseSpec} */
const lad = (ladder, variant, sets) => (sets === undefined ? { kind: 'ladder', ladder, variant } : { kind: 'ladder', ladder, variant, sets });

const df = (/** @type {number} */ s) => lad('df', 'dragonFlag', s);
const heavyPull = (/** @type {number} */ s) => lad('pu', 'heavyPull', s);
const explosivePull = (/** @type {number} */ s) => lad('pu', 'explosivePull', s);
const volumeBlock = () => lad('pu', 'volumeBlock');
const mainPush = (/** @type {number} */ s) => lad('push', 'mainPush', s);
const abRoller = (/** @type {number} */ s) => lad('roller', 'abRoller', s);

const CUE = {
  rowsFeet: 'Rings at waist height, feet on a bench. Chest to the rings, 1 s squeeze, 2 s lowering.',
  rowsPalmsUp: 'Rings at waist height. Elbows tight to the ribs, curl the rings to your lower chest.',
  facePulls: 'Rings at head height. Pull toward your forehead with the elbows high.',
  curls: 'Lean back with palms up and keep the elbows still. Curl the hands to your temples.',
  box: 'Jump onto a box and land quietly, then step down. Reset for every rep. Pick a height you can land softly.',
  broad: 'Jump for distance and hold the landing for 2 s. Walk back between reps.',
  bss: '3 s lowering. Add a loaded backpack once you hit the top of the range on every set.',
  pistol: 'Lower the box as you improve. Hold a ring for balance if needed.',
  ham: 'Heels in the rings, hips up. Curl the rings toward you.',
  calf: 'Pause at the top and lower slowly.',
  support: 'Arms straight, rings by your hips, palms facing forward. Add 5 s each week.',
  pike: 'Hips high, head travels between the hands. Try ring pike push-ups when this feels easy.',
  flys: 'Rings low with a slight bend in the elbows. Stop where the shoulders feel loaded but comfortable.',
  pushPlus: 'Rings low, feet on the floor. At the top, push the rings away until the shoulder blades spread apart and hold for 1 s.',
  skull: 'Rings at chest height, lean forward with the arms angled slightly overhead. Bend the elbows to bring the forehead toward the hands, 3 s down, then extend.',
  overhead: 'Face away from the anchor with the rings at chest height, lean forward with the arms overhead. Bend the elbows to lower your head between the hands, then extend. This adds elbow load on top of dips and heavy pulling: if your elbows ache, drop this one first.',
  legRaise: 'No swing. Toes to bar if you can, otherwise knees to elbows.',
  hollow: 'Lower back pinned to the floor, ribs down.',
  lsit: 'Arms locked, shoulders pushed down. Tuck if the legs will not stay straight.',
  clap: 'Push up off the floor hard. Rest fully. Swap for fast push-ups if your wrists complain.',
  hang: 'Shoulders active, ribs down.',
};

const SCAP = ' Scapular push-ups 2 × 10: arms straight, push the floor away so the shoulder blades spread, then let them come back together.';

const rowsFeet = (/** @type {number} */ s, reps = '8–10') => fx('Ring rows, feet raised', s, reps, '90 s', CUE.rowsFeet);
const rowsPalmsUp = (/** @type {number} */ s) => fx('Ring rows, palms up', s, '10–12', '75 s', CUE.rowsPalmsUp);
const facePulls = (/** @type {number} */ s) => fx('Ring face pulls', s, '12–15', '60 s', CUE.facePulls);
const curls = (/** @type {number} */ s) => fx('Ring biceps curls', s, '10–12', '60 s', CUE.curls);
const boxJumps = (/** @type {number} */ s, reps = '4 reps') => fx('Box jumps', s, reps, '90 s', CUE.box);
const broad = (/** @type {number} */ s) => fx('Broad jumps', s, '3 reps', '90 s', CUE.broad);
const bss = (/** @type {number} */ s, /** @type {string} */ reps) => fx('Bulgarian split squat, back foot in a ring', s, reps, '2 min', CUE.bss);
const pistol = (/** @type {number} */ s) => fx('Pistol squat to a box', s, '4–6 per leg', '90 s', CUE.pistol);
const hamCurl = (/** @type {number} */ s, /** @type {string} */ reps) => fx('Ring hamstring curls', s, reps, '90 s', CUE.ham);
const calf = (/** @type {number} */ s) => fx('Single-leg calf raises', s, '12–15 per leg', '60 s', CUE.calf);
const support = (/** @type {number} */ s, /** @type {string} */ reps) => fx('Ring support hold, rings turned out', s, reps, '90 s', CUE.support);
const pike = (/** @type {number} */ s, /** @type {string} */ reps) => fx('Pike push-ups, feet raised', s, reps, '90 s', CUE.pike);
const flys = (/** @type {number} */ s) => fx('Ring flys', s, '8–12', '60 s', CUE.flys);
const pushPlus = (/** @type {number} */ s, /** @type {string} */ reps) => fx('Ring push-up plus', s, reps, '60 s', CUE.pushPlus);
const skull = (/** @type {number} */ s, reps = '10–12') => fx('Ring skull crushers', s, reps, '60 s', CUE.skull);
const overhead = (/** @type {number} */ s) => fx('Overhead ring triceps extension', s, '10–12', '60 s', CUE.overhead);
const legRaise = (/** @type {number} */ s) => fx('Hanging leg raises', s, '8–12', '60 s', CUE.legRaise);
const hollowRocks = (/** @type {number} */ s) => fx('Hollow body rocks', s, '15–20', '45 s', CUE.hollow);
const lsit = (/** @type {number} */ s) => fx('Ring L-sit or tuck-sit hold', s, '10–20 s', '60 s', CUE.lsit);
const clap = (/** @type {number} */ s) => fx('Clap push-ups', s, '3 reps', '90 s', CUE.clap);
const hang = (/** @type {number} */ s) => fx('Dead hang', s, '30 s', '45 s', CUE.hang);

/** @type {Record<WeekKey, WeekType>} */
export const WEEKS = {
  standard: {
    key: 'standard',
    name: 'Standard',
    meta: '4 sessions · 60 min',
    whenToUse:
      'Four free days, or three free days plus a short shift you can train around. This is the full program: pulling twice, legs and power once, pushing and core once, and dragon flag work three times.',
    facts: [['Sessions', '4'], ['Length', 'About 60 min'], ['Effort', '2 reps in reserve']],
    notes: [
      'Keep at least 48 hours between the two pull sessions.',
      'If you can only fit three of the four, use the lean week instead of dropping a random session.',
      'If your elbows start to ache, drop the overhead ring triceps extension first.',
    ],
    sessions: [
      {
        name: 'Pull strength and dragon flag',
        time: '60 min',
        warmUp: 'Scapular pull-ups 2 × 8, dead hang 2 × 20 s, hollow hold 2 × 20 s, then one light set of your first exercise.' + SCAP,
        exercises: [heavyPull(5), rowsFeet(4), df(5), facePulls(3), curls(3)],
      },
      {
        name: 'Legs and power',
        time: '60 min',
        warmUp: 'Ankle and hip circles for 2 min, glute bridges 2 × 12, bodyweight squats 2 × 10, pogo hops 2 × 20.',
        exercises: [boxJumps(4), broad(3), bss(4, '6–10 per leg'), pistol(3), hamCurl(3, '8–12'), calf(3)],
      },
      {
        name: 'Push and core',
        time: '65 min',
        warmUp: 'Shoulder circles, band or ring dislocates 2 × 10, ring support hold 2 × 15 s, push-ups 1 × 10.',
        exercises: [clap(4), mainPush(4), pushPlus(3, '10–15'), support(3, '20–30 s'), pike(3, '6–10'), flys(3), skull(3), df(3), abRoller(3), legRaise(3)],
      },
      {
        name: 'Pull volume and explosive',
        time: '55 min',
        warmUp: 'Scapular pull-ups 2 × 8, dead hang 2 × 20 s, one light explosive rep.' + SCAP,
        exercises: [explosivePull(4), volumeBlock(), rowsPalmsUp(3), overhead(3), df(3), hollowRocks(3), lsit(4)],
      },
    ],
  },
  lean: {
    key: 'lean',
    name: 'Lean',
    meta: '3 sessions · 50 min',
    whenToUse: 'Three free days. Every movement pattern is still trained, with legs and power squeezed into one shorter session.',
    facts: [['Sessions', '3'], ['Length', '45–55 min'], ['Effort', '2 reps in reserve']],
    notes: [
      'Pull-ups and the dragon flag get two exposures instead of three.',
      'Take the sessions in order. Do not make up missed ones.',
    ],
    sessions: [
      {
        name: 'Pull and core',
        time: '45 min',
        warmUp: 'Scapular pull-ups 2 × 8, dead hang 2 × 20 s, hollow hold 2 × 20 s.' + SCAP,
        exercises: [heavyPull(4), rowsFeet(3), df(4), facePulls(3), hollowRocks(3)],
      },
      {
        name: 'Legs, power and push',
        time: '50 min',
        warmUp: 'Ankle and hip circles for 2 min, glute bridges 2 × 12, bodyweight squats 2 × 10, pogo hops 2 × 20.',
        exercises: [boxJumps(3), bss(3, '6–8 per leg'), hamCurl(3, '8–10'), mainPush(3), support(2, '20–30 s')],
      },
      {
        name: 'Push, pull and core',
        time: '60 min',
        warmUp: 'Shoulder circles, ring dislocates 2 × 10, scapular pull-ups 2 × 8, ring support hold 2 × 15 s.' + SCAP,
        exercises: [explosivePull(3), mainPush(4), pushPlus(2, '10–15'), rowsPalmsUp(4), pike(3, '6–8'), skull(3), df(3), abRoller(3), lsit(3)],
      },
    ],
  },
  oncall: {
    key: 'oncall',
    name: 'On call',
    meta: '2 sessions · 35 min',
    whenToUse:
      'Long days on site with no chance of getting to the gym in between. Training happens at the edges: the day before the run starts and the first day after it ends, or before a shift if you can do it without cutting into sleep.',
    facts: [['Sessions', '2 plus ward snacks'], ['Length', '30–35 min'], ['Effort', '2–3 reps in reserve']],
    notes: [
      'Best slots are the day before the run and the first day after it. Skip a post-shift session if you are wiped out. Sleep beats a rushed workout.',
      'No jumps or heavy dragon flag attempts straight after a long day. Only train hard when you are alert.',
      'Expect to maintain, not progress. That is the right target for this week.',
    ],
    snacks: [
      ['Stair calf raises', '2 × 15 per leg on a step while you wait for a lift or a handover.'],
      ['Split squats', '2 × 10 per leg in a quiet corridor or side room.'],
      ['Wall or desk push-ups', '2 × 12 in a real gap in the day.'],
      ['Hollow or plank hold', '2 × 30 s in a quiet room, only if there is a genuine gap.'],
      ['Eat properly', 'A thirteen-hour day is where protein goes missing. Pack it the night before.'],
    ],
    sessions: [
      {
        name: 'Upper body and core',
        time: '35 min',
        warmUp: 'Scapular pull-ups 2 × 8, dead hang 2 × 20 s, ring support hold 2 × 15 s.' + SCAP,
        exercises: [heavyPull(4), mainPush(3), df(4), rowsFeet(3), hollowRocks(3)],
      },
      {
        name: 'Legs and power',
        time: '35 min',
        warmUp: 'Ankle and hip circles for 2 min, glute bridges 2 × 12, pogo hops 2 × 20.',
        exercises: [broad(3), bss(4, '6–8 per leg'), explosivePull(3), hamCurl(3, '10'), calf(2), lsit(3)],
      },
    ],
  },
  nights: {
    key: 'nights',
    name: 'Nights',
    meta: '1 session · 30 min',
    whenToUse: 'A run of nights, or any week where sleep is the priority. The goal is to keep what you have built, not to add to it.',
    facts: [['Sessions', '1 plus snacks'], ['Length', '30 min'], ['Effort', '3 reps in reserve']],
    notes: [
      'Train once, after you have slept, ideally on the first day off after the run.',
      'With under six hours of sleep, skip the jumps and swap dragon flag reps for slow tuck raises.',
    ],
    snacks: [
      ['Ward snacks', 'Stair calf raises 2 × 15 per leg, split squats 2 × 10 per leg, or wall push-ups 2 × 12, only in a real gap. Stay well short of tired.'],
      ['Mobility', '5 min of hip flexor stretches and thoracic rotations before bed.'],
      ['Eat properly', 'Pack protein for the shift. Long days are where it goes missing.'],
    ],
    sessions: [
      {
        name: 'Whole body minimum',
        time: '30 min',
        warmUp: 'Scapular pull-ups 2 × 8, dead hang 1 × 20 s, bodyweight squats 1 × 10.' + SCAP,
        exercises: [heavyPull(3), mainPush(3), df(3), bss(2, '6–8 per leg'), broad(2), hang(2)],
      },
    ],
  },
  deload: {
    key: 'deload',
    name: 'Deload',
    meta: '3 sessions · 35 min',
    whenToUse:
      'Every third hard week, when two sessions in a row go backwards, or when elbows and shoulders feel grumpy. Same movements, about half the sets, and no maximal attempts.',
    facts: [['Sessions', '3'], ['Length', '30–35 min'], ['Effort', '3–4 reps in reserve']],
    notes: [
      'Keep positions and weights the same as the week before. Cut sets, not technique.',
      'Use a low box and stop every jump well short of your best.',
    ],
    sessions: [
      {
        name: 'Pull and core, easy',
        time: '35 min',
        warmUp: 'Scapular pull-ups 2 × 8, dead hang 2 × 20 s.' + SCAP,
        exercises: [
          heavyPull(3),
          fx('Ring rows, feet raised', 2, '8', '90 s', 'Easy pace, 2 s lowering.'),
          df(2),
          facePulls(2),
          hollowRocks(2),
        ],
      },
      {
        name: 'Legs and push, easy',
        time: '40 min',
        warmUp: 'Ankle and hip circles for 2 min, glute bridges 2 × 12, ring support hold 2 × 15 s.',
        exercises: [boxJumps(2, '3 reps'), bss(2, '6 per leg'), hamCurl(2, '8'), mainPush(3), pushPlus(2, '10'), support(2, '20 s'), skull(2, '8'), calf(2)],
      },
      {
        name: 'Skills and mobility',
        time: '30 min',
        warmUp: 'Five easy minutes of shoulder and hip circles.',
        exercises: [
          support(3, '20 s'),
          df(3),
          hang(3),
          fx('Ring L-sit or tuck-sit hold', 2, '10–20 s', '60 s', CUE.lsit),
          { kind: 'fixed', name: 'Mobility', sets: 1, dose: '10 min', rest: '', cue: 'Hip flexor stretch, thoracic rotations, shoulder extension stretch. Breathe slowly.' },
        ],
      },
    ],
  },
};
