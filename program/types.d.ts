export type LadderKey = 'df' | 'pu' | 'push' | 'roller';
export type WeekKey = 'standard' | 'lean' | 'oncall' | 'nights' | 'deload';
export type Variant = 'dragonFlag' | 'heavyPull' | 'explosivePull' | 'volumeBlock' | 'mainPush' | 'abRoller';

export interface Ladder {
  key: LadderKey;
  title: string;
  /** Optional line shown under the ladder title. */
  note?: string;
  steps: { name: string; moveUpWhen: string }[];
}

export type ExerciseSpec =
  | { kind: 'fixed'; name: string; sets: number; dose: string; rest: string; cue: string }
  | { kind: 'ladder'; ladder: LadderKey; variant: Variant; sets?: number };

export interface Session {
  name: string;
  time: string;
  warmUp: string;
  exercises: ExerciseSpec[];
}

export interface WeekType {
  key: WeekKey;
  name: string;
  meta: string;
  whenToUse: string;
  facts: [label: string, value: string][];
  notes: string[];
  snacks?: [title: string, text: string][];
  sessions: Session[];
}

export type Levels = Record<LadderKey, number>;

export interface ProgramState {
  /** Program content version, used to migrate positional ticks and notes. */
  v: number;
  week: WeekKey;
  levels: Levels;
  /** key: `${week}|${sessionIdx}|${exerciseIdx}|${setIdx}` */
  ticks: Record<string, true>;
  /** key: `${week}|${sessionIdx}|${exerciseIdx}` */
  notes: Record<string, string>;
}

export interface ResolvedExercise {
  name: string;
  sets: number;
  dose: string;
  rest: string;
  cue: string;
}

export interface StorageLike {
  get(key: string): Promise<{ value: string } | null | undefined>;
  set(key: string, value: string): Promise<unknown>;
}
