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
      liftSettings: {
        bench: { increment: 2.5, roundingMode: 'down' },
        squat: { increment: 2.5, roundingMode: 'down' },
        ohp: { increment: 2.5, roundingMode: 'down' },
        deadlift: { increment: 2.5, roundingMode: 'down' },
      },
    });
  });

  it('loads saved settings from AsyncStorage', async () => {
    const savedSettings = {
      unit: 'lbs',
      liftSettings: {
        bench: { increment: 5, roundingMode: 'down' },
        squat: { increment: 5, roundingMode: 'nearest' },
        ohp: { increment: 2.5, roundingMode: 'up' },
        deadlift: { increment: 10, roundingMode: 'down' },
      },
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

  it('loads settings from AsyncStorage', async () => {
    const savedSettings = {
      unit: 'lbs',
      liftSettings: {
        bench: { increment: 5, roundingMode: 'up' },
        squat: { increment: 10, roundingMode: 'nearest' },
        ohp: { increment: 2.5, roundingMode: 'down' },
        deadlift: { increment: 10, roundingMode: 'down' },
      },
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedSettings)
    );

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings.unit).toBe('lbs');
    expect(result.current.settings.liftSettings.bench.increment).toBe(5);
    expect(result.current.settings.liftSettings.bench.roundingMode).toBe('up');
    expect(result.current.settings.liftSettings.squat.increment).toBe(10);
  });

  it('updates per-lift settings and saves to AsyncStorage', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateSettings({
        liftSettings: {
          ...result.current.settings.liftSettings,
          bench: { increment: 5, roundingMode: 'nearest' },
        },
      });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(result.current.settings.liftSettings.bench.increment).toBe(5);
    expect(result.current.settings.liftSettings.bench.roundingMode).toBe('nearest');
  });

  it('resets settings to defaults', async () => {
    const savedSettings = {
      unit: 'lbs',
      liftSettings: {
        bench: { increment: 5, roundingMode: 'up' },
        squat: { increment: 10, roundingMode: 'nearest' },
        ohp: { increment: 5, roundingMode: 'down' },
        deadlift: { increment: 10, roundingMode: 'up' },
      },
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
      liftSettings: {
        bench: { increment: 2.5, roundingMode: 'down' },
        squat: { increment: 2.5, roundingMode: 'down' },
        ohp: { increment: 2.5, roundingMode: 'down' },
        deadlift: { increment: 2.5, roundingMode: 'down' },
      },
    });
  });

  it('starts with isLoading true', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.isLoading).toBe(true);
  });
});
