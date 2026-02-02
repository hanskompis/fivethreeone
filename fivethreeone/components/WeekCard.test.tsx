import { render } from '@testing-library/react-native';
import { WeekCard } from './WeekCard';
import { Week } from '../types/program';

describe('WeekCard', () => {
  const mockWeek: Week = {
    weekNumber: 1,
    name: '5s Week',
    workouts: [
      {
        lift: 'squat',
        liftDisplayName: 'Squat',
        trainingMax: 126,
        sets: [
          { percentage: 65, weight: 82.5, reps: 5, isAMRAP: false },
          { percentage: 75, weight: 95, reps: 5, isAMRAP: false },
          { percentage: 85, weight: 107.5, reps: 5, isAMRAP: true },
        ],
      },
      {
        lift: 'bench',
        liftDisplayName: 'Bench Press',
        trainingMax: 90,
        sets: [
          { percentage: 65, weight: 57.5, reps: 5, isAMRAP: false },
          { percentage: 75, weight: 67.5, reps: 5, isAMRAP: false },
          { percentage: 85, weight: 77.5, reps: 5, isAMRAP: true },
        ],
      },
    ],
  };

  it('renders week number', () => {
    const { getByText } = render(<WeekCard week={mockWeek} unit="kg" />);

    expect(getByText('Week 1')).toBeTruthy();
  });

  it('renders week name', () => {
    const { getByText } = render(<WeekCard week={mockWeek} unit="kg" />);

    expect(getByText('5s Week')).toBeTruthy();
  });

  it('renders all workouts', () => {
    const { getByTestId } = render(<WeekCard week={mockWeek} unit="kg" />);

    expect(getByTestId('workout-squat')).toBeTruthy();
    expect(getByTestId('workout-bench')).toBeTruthy();
  });

  it('has testID with week number', () => {
    const { getByTestId } = render(<WeekCard week={mockWeek} unit="kg" />);

    expect(getByTestId('week-1')).toBeTruthy();
  });

  it('renders lift display names', () => {
    const { getByText } = render(<WeekCard week={mockWeek} unit="kg" />);

    expect(getByText('Squat')).toBeTruthy();
    expect(getByText('Bench Press')).toBeTruthy();
  });
});
