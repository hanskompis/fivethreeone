import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Index from '../../app/index';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock useCompletions hook
const mockResetCompletions = jest.fn();
jest.mock('../../hooks/useCompletions', () => ({
  useCompletions: () => ({
    resetCompletions: mockResetCompletions,
    isLoading: false,
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('Index Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('renders the title', async () => {
    const { getByText } = render(<Index />);

    await waitFor(() => {
      expect(getByText('Enter Your 1RM')).toBeTruthy();
    });
  });

  it('renders all four lift inputs', async () => {
    const { getByText } = render(<Index />);

    await waitFor(() => {
      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Squat')).toBeTruthy();
      expect(getByText('Overhead Press')).toBeTruthy();
      expect(getByText('Deadlift')).toBeTruthy();
    });
  });

  it('loads saved values from AsyncStorage', async () => {
    const savedLifts = {
      bench: '100',
      squat: '140',
      ohp: '60',
      deadlift: '180',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedLifts)
    );

    const { getByDisplayValue } = render(<Index />);

    await waitFor(() => {
      expect(getByDisplayValue('100')).toBeTruthy();
      expect(getByDisplayValue('140')).toBeTruthy();
      expect(getByDisplayValue('60')).toBeTruthy();
      expect(getByDisplayValue('180')).toBeTruthy();
    });
  });

  it('saves values to AsyncStorage when changed', async () => {
    const { getByTestId } = render(<Index />);

    await waitFor(() => {
      expect(getByTestId('bench-input')).toBeTruthy();
    });

    const benchInput = getByTestId('bench-input');
    fireEvent.changeText(benchInput, '100');

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('disables calculate button when no values entered', async () => {
    const { getByTestId } = render(<Index />);

    await waitFor(() => {
      const button = getByTestId('calculate-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  it('enables calculate button when at least one value is entered', async () => {
    const savedLifts = {
      bench: '100',
      squat: '',
      ohp: '',
      deadlift: '',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedLifts)
    );

    const { getByTestId } = render(<Index />);

    await waitFor(() => {
      const button = getByTestId('calculate-button');
      expect(button.props.accessibilityState?.disabled).toBeFalsy();
    });
  });

  it('resets all values and completions when reset button pressed', async () => {
    const savedLifts = {
      bench: '100',
      squat: '140',
      ohp: '60',
      deadlift: '180',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedLifts)
    );

    const { getByTestId, getByDisplayValue, getAllByText } = render(<Index />);

    // Wait for values to load
    await waitFor(() => {
      expect(getByDisplayValue('100')).toBeTruthy();
    });

    // Press reset button to show dialog
    const resetButton = getByTestId('reset-button');
    fireEvent.press(resetButton);

    // Wait for dialog to appear and confirm - use getAllByText since title appears in both button and dialog
    await waitFor(() => {
      expect(getAllByText('Reset Progress').length).toBeGreaterThan(0);
    });

    // Press the confirm button in the dialog (the second "Reset" text)
    const resetTexts = getAllByText('Reset');
    const confirmButton = resetTexts[resetTexts.length - 1]; // Get the last one (in dialog)
    fireEvent.press(confirmButton);

    // Verify AsyncStorage was updated with empty values
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@fivethreeone_lifts',
        JSON.stringify({
          bench: '',
          squat: '',
          ohp: '',
          deadlift: '',
        })
      );
    });

    // Verify completions were reset
    expect(mockResetCompletions).toHaveBeenCalled();
  });
});
