import { render } from '@testing-library/react-native';
import { WorkoutDay } from './WorkoutDay';
import { WorkoutDay as WorkoutDayType } from '../types/program';

describe('WorkoutDay', () => {
  const mockWorkout: WorkoutDayType = {
    lift: 'bench',
    liftDisplayName: 'Bench Press',
    trainingMax: 90,
    sets: [
      { percentage: 65, weight: 57.5, reps: 5, isAMRAP: false },
      { percentage: 75, weight: 67.5, reps: 5, isAMRAP: false },
      { percentage: 85, weight: 77.5, reps: 5, isAMRAP: true },
    ],
  };

  it('renders lift display name', () => {
    const { getByText } = render(
      <WorkoutDay workout={mockWorkout} unit="kg" />
    );

    expect(getByText('Bench Press')).toBeTruthy();
  });

  it('renders training max', () => {
    const { getByText } = render(
      <WorkoutDay workout={mockWorkout} unit="kg" />
    );

    expect(getByText('TM: 90 kg')).toBeTruthy();
  });

  it('renders all three sets', () => {
    const { getByTestId } = render(
      <WorkoutDay workout={mockWorkout} unit="kg" />
    );

    expect(getByTestId('set-row-1')).toBeTruthy();
    expect(getByTestId('set-row-2')).toBeTruthy();
    expect(getByTestId('set-row-3')).toBeTruthy();
  });

  it('has testID with lift name', () => {
    const { getByTestId } = render(
      <WorkoutDay workout={mockWorkout} unit="kg" />
    );

    expect(getByTestId('workout-bench')).toBeTruthy();
  });
});
