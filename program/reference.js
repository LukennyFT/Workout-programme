// @ts-check
// Appendix C reference copy. No styling.

export const BLOCK_INTRO =
  'Effort is measured in reps in reserve: two in reserve means you could have done two more clean reps.';

/** @type {[title: string, text: string][]} */
export const BLOCK_WEEKS = [
  ['Base week', 'Two reps in reserve. Use the lower end of each rep range and settle your working weights and steps.'],
  ['Add volume', 'Two reps in reserve. Add a rep to each set, or a fifth set on pull-ups and dips.'],
  ['Push', 'One rep in reserve on the last set. Aim for the top of every range. If you hit the top on every set in two sessions running, move up a step or add weight.'],
  ['Deload', 'Use the deload week: same movements, about half the sets, three to four reps in reserve, no maximal attempts.'],
];

export const BLOCK_NOTE =
  'The block follows your training, not the calendar. If the rota gives you a lean, on-call or nights week, run it as maintenance and pick the block up at the same week afterwards. Deload after three hard weeks, or sooner if two sessions in a row go backwards.';

/** @type {[title: string, text: string][]} */
export const ROTA_RULES = [
  ['Choose the week on Sunday.', 'Four free days: standard. Three: lean. A run of on-call long days: on call. A run of nights: nights. Third hard week done: deload.'],
  ['Sleep first.', 'After a night shift, sleep before you train. With under six hours, skip jumps and dragon flag attempts and keep pulling and pushing at about two to three reps in reserve.'],
  ['Long days are not gym days.', 'You cannot get to a gym mid-shift, so train on days off, short days, or the edges of a run. On long days, use the equipment-free ward snacks in the on-call and nights weeks.'],
  ['Protect your legs.', 'Do the legs session at least a day before a run of ward shifts. Sore legs on a thirteen-hour day are not worth it.'],
  ['Do not make up missed sessions.', 'Take the next session in the list. A missed session is not owed back.'],
];

/** @type {[title: string, text: string][]} */
export const FUEL_RULES = [
  ['Building while staying lean.', 'Eat around maintenance on rest days and slightly above it on training days. Aim for slow gain, roughly a quarter to half a kilo a month. If your waist grows faster than that, trim intake.'],
  ['Protein.', '1.6 to 2.2 g per kg of body weight across three or four meals. Keep tinned fish, yoghurt and protein bars in your locker for shifts.'],
  ['Creatine.', '3 to 5 g of creatine monohydrate daily is one of the best-supported supplements for strength and lean mass.'],
  ['Tendons.', 'Jumps, dips and dragon flags load elbows, shoulders and Achilles. If a joint hurts, as opposed to muscle soreness, drop one step on that ladder for the week. If your elbows ache, drop the overhead ring triceps extension first.'],
];

export const HERO_TITLE = 'Ring program for a shift-work rota';
export const HERO_TEXT =
  'Five weekly programs built around a full dragon flag, more pull-ups, explosive power and lean muscle. Pick the week you actually have.';
export const LEVELS_TEXT =
  'Choose the hardest step you can do with clean form. Every session below updates to match. Move up when the ladders further down say so.';
export const LADDERS_TEXT = 'Your current step is highlighted. Each entry says what to hit before moving up.';
export const SAVE_NOTE = 'Ticks and steps are saved in this browser only.';
