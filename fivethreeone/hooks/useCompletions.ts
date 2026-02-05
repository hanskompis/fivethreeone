import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiftName } from '../types/program';

const COMPLETIONS_KEY = '@fivethreeone_completions';

// Week number -> lift name -> completed
export type CompletionState = Record<number, Record<string, boolean>>;

interface UseCompletionsReturn {
  completions: CompletionState;
  isLoading: boolean;
  toggleCompletion: (weekNumber: number, lift: LiftName) => Promise<void>;
  isCompleted: (weekNumber: number, lift: LiftName) => boolean;
  resetCompletions: () => Promise<void>;
}

const defaultCompletions: CompletionState = {
  1: {},
  2: {},
  3: {},
  4: {},
};

export const useCompletions = (): UseCompletionsReturn => {
  const [completions, setCompletions] = useState<CompletionState>(defaultCompletions);
  const [isLoading, setIsLoading] = useState(true);

  // Load completions on mount
  useEffect(() => {
    const loadCompletions = async () => {
      try {
        const saved = await AsyncStorage.getItem(COMPLETIONS_KEY);
        if (saved) {
          setCompletions({ ...defaultCompletions, ...JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Failed to load completions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCompletions();
  }, []);

  const toggleCompletion = useCallback(
    async (weekNumber: number, lift: LiftName) => {
      try {
        const weekCompletions = completions[weekNumber] || {};
        const updated: CompletionState = {
          ...completions,
          [weekNumber]: {
            ...weekCompletions,
            [lift]: !weekCompletions[lift],
          },
        };
        await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(updated));
        setCompletions(updated);
      } catch (error) {
        console.error('Failed to save completion:', error);
        throw error;
      }
    },
    [completions]
  );

  const isCompleted = useCallback(
    (weekNumber: number, lift: LiftName): boolean => {
      return completions[weekNumber]?.[lift] || false;
    },
    [completions]
  );

  const resetCompletions = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(COMPLETIONS_KEY);
      setCompletions(defaultCompletions);
    } catch (error) {
      console.error('Failed to reset completions:', error);
      throw error;
    }
  }, []);

  return { completions, isLoading, toggleCompletion, isCompleted, resetCompletions };
};
