import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types/program';

const SETTINGS_KEY = '@fivethreeone_settings';

const defaultSettings: Settings = {
  unit: 'kg',
  roundingIncrement: 2.5,
};

interface UseSettingsReturn {
  settings: Settings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          setSettings({ ...defaultSettings, ...JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      try {
        const updated = { ...settings, ...newSettings };
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        setSettings(updated);
      } catch (error) {
        console.error('Failed to save settings:', error);
        throw error;
      }
    },
    [settings]
  );

  const resetSettings = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
  };
};
