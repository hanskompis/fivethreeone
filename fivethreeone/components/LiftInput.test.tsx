import { render, fireEvent } from '@testing-library/react-native';
import { LiftInput } from './LiftInput';

describe('LiftInput', () => {
  it('renders with label', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <LiftInput
        label="Bench Press"
        value=""
        onChangeText={mockOnChange}
      />
    );

    expect(getByText('Bench Press')).toBeTruthy();
  });

  it('displays the value in the input', () => {
    const mockOnChange = jest.fn();
    const { getByDisplayValue } = render(
      <LiftInput
        label="Squat"
        value="100"
        onChangeText={mockOnChange}
      />
    );

    expect(getByDisplayValue('100')).toBeTruthy();
  });

  it('calls onChangeText when input changes', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <LiftInput
        label="Deadlift"
        value=""
        onChangeText={mockOnChange}
        testID="deadlift"
      />
    );

    const input = getByTestId('deadlift-input');
    fireEvent.changeText(input, '150');

    expect(mockOnChange).toHaveBeenCalledWith('150');
  });

  it('sanitizes non-numeric input', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <LiftInput
        label="OHP"
        value=""
        onChangeText={mockOnChange}
        testID="ohp"
      />
    );

    const input = getByTestId('ohp-input');
    fireEvent.changeText(input, '12abc34');

    expect(mockOnChange).toHaveBeenCalledWith('1234');
  });

  it('allows decimal values', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <LiftInput
        label="Bench"
        value=""
        onChangeText={mockOnChange}
        testID="bench"
      />
    );

    const input = getByTestId('bench-input');
    fireEvent.changeText(input, '102.5');

    expect(mockOnChange).toHaveBeenCalledWith('102.5');
  });

  it('displays kg unit', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <LiftInput
        label="Squat"
        value="100"
        onChangeText={mockOnChange}
      />
    );

    expect(getByText('kg')).toBeTruthy();
  });
});
