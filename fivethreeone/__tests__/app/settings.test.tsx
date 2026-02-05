import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Settings from '../../app/settings';

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

describe('Settings Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders the title', async () => {
    const { getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy();
    });
  });

  it('renders per-lift configuration section', async () => {
    const { getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByText('Per-Lift Configuration')).toBeTruthy();
      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Squat')).toBeTruthy();
      expect(getByText('Overhead Press')).toBeTruthy();
      expect(getByText('Deadlift')).toBeTruthy();
    });
  });

  it('expands lift settings when header is pressed', async () => {
    const { getByTestId, getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByTestId('lift-header-bench')).toBeTruthy();
    });

    fireEvent.press(getByTestId('lift-header-bench'));

    await waitFor(() => {
      expect(getByText('Weight Increment')).toBeTruthy();
      expect(getByText('2.5 kg')).toBeTruthy();
      expect(getByText('5 kg')).toBeTruthy();
      expect(getByText('10 kg')).toBeTruthy();
    });
  });

  it('saves lift-specific setting when increment is changed', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      expect(getByTestId('lift-header-bench')).toBeTruthy();
    });

    // Expand the bench press settings
    fireEvent.press(getByTestId('lift-header-bench'));

    await waitFor(() => {
      expect(getByTestId('bench-increment-5')).toBeTruthy();
    });

    // Select 5 kg increment
    fireEvent.press(getByTestId('bench-increment-5'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('renders info about 5/3/1 program', async () => {
    const { getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByText('About 5/3/1')).toBeTruthy();
    });
  });

  it('renders back button', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();
    });
  });
});
