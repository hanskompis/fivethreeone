/**
 * Type definitions for the 5/3/1 program
 */

export interface LiftValues {
  bench: number;
  squat: number;
  ohp: number;
  deadlift: number;
}

export type LiftName = keyof LiftValues;

export type RoundingMode = 'down' | 'nearest' | 'up';

export interface LiftSettings {
  increment: number; // e.g., 2.5, 5, 10 kg
  roundingMode: RoundingMode;
}

export interface Settings {
  unit: 'kg' | 'lbs';
  liftSettings: Record<LiftName, LiftSettings>;
}

export interface WorkoutSet {
  percentage: number;
  weight: number;
  reps: number;
  isAMRAP: boolean;
}

export interface WorkoutDay {
  lift: LiftName;
  liftDisplayName: string;
  sets: WorkoutSet[];
  trainingMax: number;
}

export interface Week {
  weekNumber: 1 | 2 | 3 | 4;
  name: string;
  workouts: WorkoutDay[];
}

export interface Program {
  weeks: Week[];
  settings: Settings;
  lifts: LiftValues;
}

// Week configurations based on 5/3/1 methodology
export const WEEK_CONFIG = {
  1: {
    name: '5s Week',
    percentages: [0.65, 0.75, 0.85],
    reps: [5, 5, 5],
    amrapSet: 2, // 0-indexed, last set is AMRAP
  },
  2: {
    name: '3s Week',
    percentages: [0.7, 0.8, 0.9],
    reps: [3, 3, 3],
    amrapSet: 2,
  },
  3: {
    name: '5/3/1 Week',
    percentages: [0.75, 0.85, 0.95],
    reps: [5, 3, 1],
    amrapSet: 2,
  },
  4: {
    name: 'Deload Week',
    percentages: [0.4, 0.5, 0.6],
    reps: [5, 5, 5],
    amrapSet: -1, // No AMRAP on deload
  },
} as const;

export const LIFT_DISPLAY_NAMES: Record<LiftName, string> = {
  bench: 'Bench Press',
  squat: 'Squat',
  ohp: 'Overhead Press',
  deadlift: 'Deadlift',
};

