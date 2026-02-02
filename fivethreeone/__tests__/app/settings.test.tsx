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

  it('renders all four lift cards', async () => {
    const { getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Squat')).toBeTruthy();
      expect(getByText('Overhead Press')).toBeTruthy();
      expect(getByText('Deadlift')).toBeTruthy();
    });
  });

  it('expands lift details when header is tapped', async () => {
    const { getByTestId, getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByTestId('lift-header-bench')).toBeTruthy();
    });

    fireEvent.press(getByTestId('lift-header-bench'));

    await waitFor(() => {
      expect(getByText('Weight Increment')).toBeTruthy();
      expect(getByText('Rounding Mode')).toBeTruthy();
    });
  });

  it('renders increment options when lift is expanded', async () => {
    const { getByTestId, getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByTestId('lift-header-bench')).toBeTruthy();
    });

    fireEvent.press(getByTestId('lift-header-bench'));

    await waitFor(() => {
      expect(getByText('2.5 kg')).toBeTruthy();
      expect(getByText('5 kg')).toBeTruthy();
      expect(getByText('10 kg')).toBeTruthy();
    });
  });

  it('renders rounding mode options when lift is expanded', async () => {
    const { getByTestId, getByText } = render(<Settings />);

    await waitFor(() => {
      fireEvent.press(getByTestId('lift-header-squat'));
    });

    await waitFor(() => {
      expect(getByText('Round Down')).toBeTruthy();
      expect(getByText('Round Nearest')).toBeTruthy();
      expect(getByText('Round Up')).toBeTruthy();
    });
  });

  it('saves per-lift increment setting', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      fireEvent.press(getByTestId('lift-header-bench'));
    });

    await waitFor(() => {
      fireEvent.press(getByTestId('bench-increment-5'));
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('saves per-lift rounding mode setting', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      fireEvent.press(getByTestId('lift-header-ohp'));
    });

    await waitFor(() => {
      fireEvent.press(getByTestId('ohp-rounding-nearest'));
    });

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
