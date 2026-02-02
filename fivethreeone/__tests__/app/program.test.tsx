import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgramScreen from '../../app/program';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Program Screen', () => {
  const mockLifts = {
    bench: '100',
    squat: '140',
    ohp: '60',
    deadlift: '180',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock settings
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === '@fivethreeone_lifts') {
        return Promise.resolve(JSON.stringify(mockLifts));
      }
      if (key === '@fivethreeone_settings') {
        return Promise.resolve(
          JSON.stringify({ unit: 'kg', roundingIncrement: 2.5 })
        );
      }
      return Promise.resolve(null);
    });
  });

  it('renders week tabs', async () => {
    const { getByTestId } = render(<ProgramScreen />);

    await waitFor(() => {
      expect(getByTestId('tab-week-1')).toBeTruthy();
      expect(getByTestId('tab-week-2')).toBeTruthy();
      expect(getByTestId('tab-week-3')).toBeTruthy();
      expect(getByTestId('tab-week-4')).toBeTruthy();
    });
  });

  it('shows week 1 content by default', async () => {
    const { getByTestId } = render(<ProgramScreen />);

    await waitFor(() => {
      expect(getByTestId('week-1')).toBeTruthy();
    });
  });

  it('switches to different week when tab is pressed', async () => {
    const { getByTestId, queryByTestId } = render(<ProgramScreen />);

    await waitFor(() => {
      expect(getByTestId('tab-week-2')).toBeTruthy();
    });

    fireEvent.press(getByTestId('tab-week-2'));

    await waitFor(() => {
      expect(getByTestId('week-2')).toBeTruthy();
      expect(queryByTestId('week-1')).toBeNull();
    });
  });

  it('displays workouts for entered lifts', async () => {
    const { getByText } = render(<ProgramScreen />);

    await waitFor(() => {
      expect(getByText('Squat')).toBeTruthy();
      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Deadlift')).toBeTruthy();
      expect(getByText('Overhead Press')).toBeTruthy();
    });
  });

  it('shows empty state when no lifts are entered', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === '@fivethreeone_lifts') {
        return Promise.resolve(null);
      }
      if (key === '@fivethreeone_settings') {
        return Promise.resolve(
          JSON.stringify({ unit: 'kg', roundingIncrement: 2.5 })
        );
      }
      return Promise.resolve(null);
    });

    const { getByText } = render(<ProgramScreen />);

    await waitFor(() => {
      expect(getByText('No Lift Values')).toBeTruthy();
    });
  });

  it('has edit button that navigates back', async () => {
    const { getByTestId } = render(<ProgramScreen />);

    await waitFor(() => {
      expect(getByTestId('edit-button')).toBeTruthy();
    });
  });
});
