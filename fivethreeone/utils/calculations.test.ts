import {
  calculateTrainingMax,
  roundToPlate,
  calculateWeekSets,
  generateWorkoutDay,
  generateWeek,
  generateFullProgram,
  formatWeight,
  formatSet,
} from './calculations';
import { LiftValues, Settings, WorkoutSet } from '../types/program';

describe('calculateTrainingMax', () => {
  it('calculates 90% of 1RM', () => {
    expect(calculateTrainingMax(100)).toBe(90);
    expect(calculateTrainingMax(200)).toBe(180);
    expect(calculateTrainingMax(150)).toBe(135);
    expect(calculateTrainingMax(67.5)).toBe(60.75);
  });

  it('handles decimal values', () => {
    expect(calculateTrainingMax(105)).toBe(94.5);
  });
});

describe('roundToPlate', () => {
  it('rounds down to nearest 2.5 kg increment', () => {
    expect(roundToPlate(97.5, 2.5)).toBe(97.5);
    expect(roundToPlate(98, 2.5)).toBe(97.5);
    expect(roundToPlate(99, 2.5)).toBe(97.5);
    expect(roundToPlate(100, 2.5)).toBe(100);
  });

  it('rounds down to nearest 5 kg increment', () => {
    expect(roundToPlate(97, 5)).toBe(95);
    expect(roundToPlate(99, 5)).toBe(95);
    expect(roundToPlate(100, 5)).toBe(100);
  });

  it('rounds down to nearest 1.25 kg increment', () => {
    expect(roundToPlate(51.3, 1.25)).toBe(51.25);
    expect(roundToPlate(52, 1.25)).toBe(51.25);
  });

  it('handles exact matches', () => {
    expect(roundToPlate(100, 2.5)).toBe(100);
    expect(roundToPlate(100, 5)).toBe(100);
  });
});

describe('calculateWeekSets', () => {
  const trainingMax = 100;
  const increment = 2.5;

  it('calculates Week 1 (5s) correctly', () => {
    const sets = calculateWeekSets(trainingMax, 1, increment);

    expect(sets).toHaveLength(3);
    expect(sets[0]).toEqual({
      percentage: 65,
      weight: 65,
      reps: 5,
      isAMRAP: false,
    });
    expect(sets[1]).toEqual({
      percentage: 75,
      weight: 75,
      reps: 5,
      isAMRAP: false,
    });
    expect(sets[2]).toEqual({
      percentage: 85,
      weight: 85,
      reps: 5,
      isAMRAP: true,
    });
  });

  it('calculates Week 2 (3s) correctly', () => {
    const sets = calculateWeekSets(trainingMax, 2, increment);

    expect(sets).toHaveLength(3);
    expect(sets[0]).toEqual({
      percentage: 70,
      weight: 70,
      reps: 3,
      isAMRAP: false,
    });
    expect(sets[1]).toEqual({
      percentage: 80,
      weight: 80,
      reps: 3,
      isAMRAP: false,
    });
    expect(sets[2]).toEqual({
      percentage: 90,
      weight: 90,
      reps: 3,
      isAMRAP: true,
    });
  });

  it('calculates Week 3 (5/3/1) correctly', () => {
    const sets = calculateWeekSets(trainingMax, 3, increment);

    expect(sets).toHaveLength(3);
    expect(sets[0]).toEqual({
      percentage: 75,
      weight: 75,
      reps: 5,
      isAMRAP: false,
    });
    expect(sets[1]).toEqual({
      percentage: 85,
      weight: 85,
      reps: 3,
      isAMRAP: false,
    });
    expect(sets[2]).toEqual({
      percentage: 95,
      weight: 95,
      reps: 1,
      isAMRAP: true,
    });
  });

  it('calculates Week 4 (Deload) correctly - no AMRAP', () => {
    const sets = calculateWeekSets(trainingMax, 4, increment);

    expect(sets).toHaveLength(3);
    expect(sets[0]).toEqual({
      percentage: 40,
      weight: 40,
      reps: 5,
      isAMRAP: false,
    });
    expect(sets[1]).toEqual({
      percentage: 50,
      weight: 50,
      reps: 5,
      isAMRAP: false,
    });
    expect(sets[2]).toEqual({
      percentage: 60,
      weight: 60,
      reps: 5,
      isAMRAP: false,
    });
  });

  it('rounds weights properly for realistic values', () => {
    // 200 kg bench 1RM → 180 kg TM
    const tm = 180;
    const sets = calculateWeekSets(tm, 1, 2.5);

    // 65% of 180 = 117, rounds down to 115 (46 × 2.5)
    // 75% of 180 = 135, rounds to 135 (exact)
    // 85% of 180 = 153, rounds down to 152.5 (61 × 2.5)
    expect(sets[0].weight).toBe(115);
    expect(sets[1].weight).toBe(135);
    expect(sets[2].weight).toBe(152.5);
  });
});

describe('generateWorkoutDay', () => {
  it('generates a workout day with correct structure', () => {
    const workout = generateWorkoutDay('bench', 100, 1, 2.5);

    expect(workout.lift).toBe('bench');
    expect(workout.liftDisplayName).toBe('Bench Press');
    expect(workout.trainingMax).toBe(90);
    expect(workout.sets).toHaveLength(3);
  });

  it('uses correct display names for all lifts', () => {
    expect(generateWorkoutDay('squat', 100, 1, 2.5).liftDisplayName).toBe(
      'Squat'
    );
    expect(generateWorkoutDay('ohp', 100, 1, 2.5).liftDisplayName).toBe(
      'Overhead Press'
    );
    expect(generateWorkoutDay('deadlift', 100, 1, 2.5).liftDisplayName).toBe(
      'Deadlift'
    );
  });
});

describe('generateWeek', () => {
  const lifts: LiftValues = {
    bench: 100,
    squat: 140,
    ohp: 60,
    deadlift: 180,
  };

  it('generates all four workouts for a week', () => {
    const week = generateWeek(lifts, 1, 2.5);

    expect(week.weekNumber).toBe(1);
    expect(week.name).toBe('5s Week');
    expect(week.workouts).toHaveLength(4);
  });

  it('skips lifts with zero value', () => {
    const partialLifts: LiftValues = {
      bench: 100,
      squat: 0,
      ohp: 0,
      deadlift: 180,
    };

    const week = generateWeek(partialLifts, 1, 2.5);
    expect(week.workouts).toHaveLength(2);
    expect(week.workouts.map((w) => w.lift)).toEqual(['bench', 'deadlift']);
  });

  it('has correct week names', () => {
    expect(generateWeek(lifts, 1, 2.5).name).toBe('5s Week');
    expect(generateWeek(lifts, 2, 2.5).name).toBe('3s Week');
    expect(generateWeek(lifts, 3, 2.5).name).toBe('5/3/1 Week');
    expect(generateWeek(lifts, 4, 2.5).name).toBe('Deload Week');
  });
});

describe('generateFullProgram', () => {
  const lifts: LiftValues = {
    bench: 100,
    squat: 140,
    ohp: 60,
    deadlift: 180,
  };

  const settings: Settings = {
    unit: 'kg',
    roundingIncrement: 2.5,
  };

  it('generates a complete 4-week program', () => {
    const program = generateFullProgram(lifts, settings);

    expect(program.weeks).toHaveLength(4);
    expect(program.settings).toEqual(settings);
    expect(program.lifts).toEqual(lifts);
  });

  it('contains correct week progression', () => {
    const program = generateFullProgram(lifts, settings);

    expect(program.weeks[0].weekNumber).toBe(1);
    expect(program.weeks[1].weekNumber).toBe(2);
    expect(program.weeks[2].weekNumber).toBe(3);
    expect(program.weeks[3].weekNumber).toBe(4);
  });
});

describe('formatWeight', () => {
  it('formats weight with kg unit', () => {
    expect(formatWeight(100, 'kg')).toBe('100 kg');
  });

  it('formats weight with lbs unit', () => {
    expect(formatWeight(225, 'lbs')).toBe('225 lbs');
  });
});

describe('formatSet', () => {
  it('formats regular set without AMRAP indicator', () => {
    const set: WorkoutSet = {
      percentage: 65,
      weight: 65,
      reps: 5,
      isAMRAP: false,
    };
    expect(formatSet(set, 'kg')).toBe('65 kg × 5');
  });

  it('formats AMRAP set with + indicator', () => {
    const set: WorkoutSet = {
      percentage: 85,
      weight: 85,
      reps: 5,
      isAMRAP: true,
    };
    expect(formatSet(set, 'kg')).toBe('85 kg × 5+');
  });

  it('works with lbs unit', () => {
    const set: WorkoutSet = {
      percentage: 90,
      weight: 200,
      reps: 3,
      isAMRAP: true,
    };
    expect(formatSet(set, 'lbs')).toBe('200 lbs × 3+');
  });
});
