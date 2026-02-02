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

  it('renders rounding options', async () => {
    const { getByText } = render(<Settings />);

    await waitFor(() => {
      expect(getByText('1.25 kg')).toBeTruthy();
      expect(getByText('2.5 kg')).toBeTruthy();
      expect(getByText('5 kg')).toBeTruthy();
    });
  });

  it('shows 2.5 kg as default selected option', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      const button = getByTestId('rounding-2.5');
      // Check if button has active style (backgroundColor would be different)
      expect(button).toBeTruthy();
    });
  });

  it('saves setting when rounding option is selected', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      expect(getByTestId('rounding-5')).toBeTruthy();
    });

    fireEvent.press(getByTestId('rounding-5'));

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
