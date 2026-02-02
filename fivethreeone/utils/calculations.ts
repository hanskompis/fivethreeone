/**
 * 5/3/1 Program Calculation Utilities
 *
 * Based on Jim Wendler's 5/3/1 methodology:
 * - Training Max = 90% of 1RM
 * - Week 1 (5s): 65%, 75%, 85% × 5+ reps
 * - Week 2 (3s): 70%, 80%, 90% × 3+ reps
 * - Week 3 (5/3/1): 75%, 85%, 95% × 1+ reps
 * - Week 4 (Deload): 40%, 50%, 60% × 5 reps
 */

import {
  LiftValues,
  LiftName,
  Settings,
  WorkoutSet,
  WorkoutDay,
  Week,
  Program,
  WEEK_CONFIG,
  LIFT_DISPLAY_NAMES,
} from '../types/program';

/**
 * Calculate Training Max from 1RM (90% of one-rep max)
 */
export const calculateTrainingMax = (oneRepMax: number): number => {
  return oneRepMax * 0.9;
};

/**
 * Round weight to nearest plate increment (rounds down to ensure liftable weight)
 */
export const roundToPlate = (weight: number, increment: number): number => {
  return Math.floor(weight / increment) * increment;
};

/**
 * Calculate the working sets for a specific week
 */
export const calculateWeekSets = (
  trainingMax: number,
  weekNumber: 1 | 2 | 3 | 4,
  roundingIncrement: number
): WorkoutSet[] => {
  const config = WEEK_CONFIG[weekNumber];

  return config.percentages.map((percentage, index) => ({
    percentage: percentage * 100,
    weight: roundToPlate(trainingMax * percentage, roundingIncrement),
    reps: config.reps[index],
    isAMRAP: index === config.amrapSet,
  }));
};

/**
 * Generate a workout day for a specific lift
 */
export const generateWorkoutDay = (
  lift: LiftName,
  oneRepMax: number,
  weekNumber: 1 | 2 | 3 | 4,
  roundingIncrement: number
): WorkoutDay => {
  const trainingMax = calculateTrainingMax(oneRepMax);

  return {
    lift,
    liftDisplayName: LIFT_DISPLAY_NAMES[lift],
    trainingMax: trainingMax,
    sets: calculateWeekSets(trainingMax, weekNumber, roundingIncrement),
  };
};

/**
 * Generate a complete week of workouts
 */
export const generateWeek = (
  lifts: LiftValues,
  weekNumber: 1 | 2 | 3 | 4,
  roundingIncrement: number
): Week => {
  const config = WEEK_CONFIG[weekNumber];
  const liftNames: LiftName[] = ['squat', 'bench', 'deadlift', 'ohp'];

  const workouts = liftNames
    .filter((lift) => lifts[lift] > 0)
    .map((lift) =>
      generateWorkoutDay(lift, lifts[lift], weekNumber, roundingIncrement)
    );

  return {
    weekNumber,
    name: config.name,
    workouts,
  };
};

/**
 * Generate the complete 4-week 5/3/1 program
 */
export const generateFullProgram = (
  lifts: LiftValues,
  settings: Settings
): Program => {
  const weeks: Week[] = [1, 2, 3, 4].map((weekNum) =>
    generateWeek(lifts, weekNum as 1 | 2 | 3 | 4, settings.roundingIncrement)
  );

  return {
    weeks,
    settings,
    lifts,
  };
};

/**
 * Format weight with unit for display
 */
export const formatWeight = (weight: number, unit: 'kg' | 'lbs'): string => {
  return `${weight} ${unit}`;
};

/**
 * Format set for display (e.g., "85 kg × 5+" or "85 kg × 5")
 */
export const formatSet = (set: WorkoutSet, unit: 'kg' | 'lbs'): string => {
  const reps = set.isAMRAP ? `${set.reps}+` : `${set.reps}`;
  return `${set.weight} ${unit} × ${reps}`;
};
