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
  describe('down mode (default)', () => {
    it('rounds down to nearest 2.5 kg increment', () => {
      expect(roundToPlate(97.5, 2.5, 'down')).toBe(97.5);
      expect(roundToPlate(98, 2.5, 'down')).toBe(97.5);
      expect(roundToPlate(99, 2.5, 'down')).toBe(97.5);
      expect(roundToPlate(100, 2.5, 'down')).toBe(100);
    });

    it('rounds down to nearest 5 kg increment', () => {
      expect(roundToPlate(97, 5, 'down')).toBe(95);
      expect(roundToPlate(99, 5, 'down')).toBe(95);
      expect(roundToPlate(100, 5, 'down')).toBe(100);
    });

    it('rounds down to nearest 10 kg increment', () => {
      expect(roundToPlate(105, 10, 'down')).toBe(100);
      expect(roundToPlate(119, 10, 'down')).toBe(110);
    });
  });

  describe('nearest mode', () => {
    it('rounds to nearest 2.5 kg increment', () => {
      expect(roundToPlate(97.5, 2.5, 'nearest')).toBe(97.5);
      expect(roundToPlate(98, 2.5, 'nearest')).toBe(97.5);
      expect(roundToPlate(99, 2.5, 'nearest')).toBe(100);
      expect(roundToPlate(98.75, 2.5, 'nearest')).toBe(100);
    });

    it('rounds to nearest 5 kg increment', () => {
      expect(roundToPlate(97, 5, 'nearest')).toBe(95);
      expect(roundToPlate(98, 5, 'nearest')).toBe(100);
      expect(roundToPlate(102.4, 5, 'nearest')).toBe(100);
    });
  });

  describe('up mode', () => {
    it('rounds up to nearest 2.5 kg increment', () => {
      expect(roundToPlate(97.5, 2.5, 'up')).toBe(97.5);
      expect(roundToPlate(98, 2.5, 'up')).toBe(100);
      expect(roundToPlate(95.1, 2.5, 'up')).toBe(97.5);
    });

    it('rounds up to nearest 5 kg increment', () => {
      expect(roundToPlate(97, 5, 'up')).toBe(100);
      expect(roundToPlate(96, 5, 'up')).toBe(100);
      expect(roundToPlate(100, 5, 'up')).toBe(100);
    });
  });

  it('handles exact matches in all modes', () => {
    expect(roundToPlate(100, 2.5, 'down')).toBe(100);
    expect(roundToPlate(100, 2.5, 'nearest')).toBe(100);
    expect(roundToPlate(100, 2.5, 'up')).toBe(100);
  });
});

describe('calculateWeekSets', () => {
  const trainingMax = 100;
  const increment = 2.5;
  const roundingMode = 'down';

  it('calculates Week 1 (5s) correctly', () => {
    const sets = calculateWeekSets(trainingMax, 1, increment, roundingMode);

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
    const sets = calculateWeekSets(trainingMax, 2, increment, roundingMode);

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
    const sets = calculateWeekSets(trainingMax, 3, increment, roundingMode);

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
    const sets = calculateWeekSets(trainingMax, 4, increment, roundingMode);

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
    const sets = calculateWeekSets(tm, 1, 2.5, 'down');

    // 65% of 180 = 117, rounds down to 115 (46 × 2.5)
    // 75% of 180 = 135, rounds to 135 (exact)
    // 85% of 180 = 153, rounds down to 152.5 (61 × 2.5)
    expect(sets[0].weight).toBe(115);
    expect(sets[1].weight).toBe(135);
    expect(sets[2].weight).toBe(152.5);
  });

  it('respects different rounding modes', () => {
    const tm = 100;
    const increment = 10;

    // 85% of 100 = 85
    const setsDown = calculateWeekSets(tm, 1, increment, 'down');
    expect(setsDown[2].weight).toBe(80); // rounds down to 80

    const setsNearest = calculateWeekSets(tm, 1, increment, 'nearest');
    expect(setsNearest[2].weight).toBe(90); // rounds to nearest 90

    const setsUp = calculateWeekSets(tm, 1, increment, 'up');
    expect(setsUp[2].weight).toBe(90); // rounds up to 90
  });
});

describe('generateWorkoutDay', () => {
  it('generates a workout day with correct structure', () => {
    const workout = generateWorkoutDay('bench', 100, 1, 2.5, 'down');

    expect(workout.lift).toBe('bench');
    expect(workout.liftDisplayName).toBe('Bench Press');
    expect(workout.trainingMax).toBe(90);
    expect(workout.sets).toHaveLength(3);
  });

  it('uses correct display names for all lifts', () => {
    expect(generateWorkoutDay('squat', 100, 1, 2.5, 'down').liftDisplayName).toBe(
      'Squat'
    );
    expect(generateWorkoutDay('ohp', 100, 1, 2.5, 'down').liftDisplayName).toBe(
      'Overhead Press'
    );
    expect(generateWorkoutDay('deadlift', 100, 1, 2.5, 'down').liftDisplayName).toBe(
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

  const settings: Settings = {
    unit: 'kg',
    liftSettings: {
      bench: { increment: 2.5, roundingMode: 'down' },
      squat: { increment: 2.5, roundingMode: 'down' },
      ohp: { increment: 2.5, roundingMode: 'down' },
      deadlift: { increment: 2.5, roundingMode: 'down' },
    },
  };

  it('generates all four workouts for a week', () => {
    const week = generateWeek(lifts, 1, settings);

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

    const week = generateWeek(partialLifts, 1, settings);
    expect(week.workouts).toHaveLength(2);
    expect(week.workouts.map((w) => w.lift)).toEqual(['bench', 'deadlift']);
  });

  it('has correct week names', () => {
    expect(generateWeek(lifts, 1, settings).name).toBe('5s Week');
    expect(generateWeek(lifts, 2, settings).name).toBe('3s Week');
    expect(generateWeek(lifts, 3, settings).name).toBe('5/3/1 Week');
    expect(generateWeek(lifts, 4, settings).name).toBe('Deload Week');
  });

  it('uses per-lift settings for rounding', () => {
    const customSettings: Settings = {
      unit: 'kg',
      liftSettings: {
        bench: { increment: 2.5, roundingMode: 'down' },
        squat: { increment: 5, roundingMode: 'nearest' },
        ohp: { increment: 2.5, roundingMode: 'up' },
        deadlift: { increment: 10, roundingMode: 'down' },
      },
    };

    const week = generateWeek(lifts, 1, customSettings);
    
    // Bench: 90 TM × 0.85 = 76.5, rounds down to 75 (2.5 increment)
    const benchWorkout = week.workouts.find(w => w.lift === 'bench');
    expect(benchWorkout?.sets[2].weight).toBe(75);

    // Squat: 126 TM × 0.85 = 107.1, rounds nearest to 105 (5 increment)
    const squatWorkout = week.workouts.find(w => w.lift === 'squat');
    expect(squatWorkout?.sets[2].weight).toBe(105);
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
    liftSettings: {
      bench: { increment: 2.5, roundingMode: 'down' },
      squat: { increment: 2.5, roundingMode: 'down' },
      ohp: { increment: 2.5, roundingMode: 'down' },
      deadlift: { increment: 2.5, roundingMode: 'down' },
    },
  };

  it('generates a complete 4-week program', () => {
    const program = generateFullProgram(lifts, settings);

    expect(program.weeks).toHaveLength(4);
    expect(program.settings).toEqual(settings);
    expect(program.lifts).toEqual(lifts);
  });


  it('applies per-lift settings across all weeks', () => {
    const customSettings: Settings = {
      unit: 'kg',
      liftSettings: {
        bench: { increment: 5, roundingMode: 'down' },
        squat: { increment: 10, roundingMode: 'nearest' },
        ohp: { increment: 2.5, roundingMode: 'up' },
        deadlift: { increment: 5, roundingMode: 'down' },
      },
    };

    const program = generateFullProgram(lifts, customSettings);
    
    // Check Week 1 bench uses 5kg increment
    const benchWeek1 = program.weeks[0].workouts.find(w => w.lift === 'bench');
    expect(benchWeek1?.sets[2].weight).toBe(75); // 85% of 90 = 76.5, rounds down to 75
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
