import { render } from '@testing-library/react-native';
import { SetRow } from './SetRow';
import { WorkoutSet } from '../types/program';

describe('SetRow', () => {
  const regularSet: WorkoutSet = {
    percentage: 65,
    weight: 65,
    reps: 5,
    isAMRAP: false,
  };

  const amrapSet: WorkoutSet = {
    percentage: 85,
    weight: 85,
    reps: 5,
    isAMRAP: true,
  };

  it('renders set number', () => {
    const { getByText } = render(
      <SetRow set={regularSet} setNumber={1} unit="kg" />
    );

    expect(getByText('1')).toBeTruthy();
  });

  it('renders weight with unit', () => {
    const { getByText } = render(
      <SetRow set={regularSet} setNumber={1} unit="kg" />
    );

    expect(getByText('65 kg')).toBeTruthy();
  });

  it('renders reps without + for regular sets', () => {
    const { getByText } = render(
      <SetRow set={regularSet} setNumber={1} unit="kg" />
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('renders reps with + for AMRAP sets', () => {
    const { getByText } = render(
      <SetRow set={amrapSet} setNumber={3} unit="kg" />
    );

    expect(getByText('5+')).toBeTruthy();
  });

  it('renders percentage', () => {
    const { getByText } = render(
      <SetRow set={regularSet} setNumber={1} unit="kg" />
    );

    expect(getByText('65%')).toBeTruthy();
  });

  it('works with lbs unit', () => {
    const lbsSet: WorkoutSet = {
      percentage: 75,
      weight: 185,
      reps: 5,
      isAMRAP: false,
    };

    const { getByText } = render(
      <SetRow set={lbsSet} setNumber={2} unit="lbs" />
    );

    expect(getByText('185 lbs')).toBeTruthy();
  });
});
