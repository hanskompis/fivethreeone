import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './useSettings';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('returns default settings initially', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings).toEqual({
      unit: 'kg',
      roundingIncrement: 2.5,
    });
  });

  it('loads saved settings from AsyncStorage', async () => {
    const savedSettings = {
      unit: 'lbs',
      roundingIncrement: 5,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedSettings)
    );

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings).toEqual(savedSettings);
  });

  it('updates settings and saves to AsyncStorage', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateSettings({ roundingIncrement: 5 });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@fivethreeone_settings',
      JSON.stringify({ unit: 'kg', roundingIncrement: 5 })
    );
    expect(result.current.settings.roundingIncrement).toBe(5);
  });

  it('resets settings to defaults', async () => {
    const savedSettings = {
      unit: 'lbs',
      roundingIncrement: 5,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedSettings)
    );

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.settings.unit).toBe('lbs');
    });

    await act(async () => {
      await result.current.resetSettings();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalled();
    expect(result.current.settings).toEqual({
      unit: 'kg',
      roundingIncrement: 2.5,
    });
  });

  it('starts with isLoading true', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.isLoading).toBe(true);
  });
});
