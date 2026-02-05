import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LiftInput } from '../components/LiftInput';
import { useCompletions } from '../hooks/useCompletions';

const STORAGE_KEY = '@fivethreeone_lifts';

interface LiftValues {
  bench: string;
  squat: string;
  ohp: string;
  deadlift: string;
}

const defaultLifts: LiftValues = {
  bench: '',
  squat: '',
  ohp: '',
  deadlift: '',
};

export default function Index() {
  const [lifts, setLifts] = useState<LiftValues>(defaultLifts);
  const [isLoading, setIsLoading] = useState(true);
  const { resetCompletions, isLoading: completionsLoading } = useCompletions();

  // Load saved values on mount
  useEffect(() => {
    const loadLifts = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setLifts(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load lifts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLifts();
  }, []);

  // Save values when they change
  const saveLifts = useCallback(async (newLifts: LiftValues) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLifts));
    } catch (error) {
      console.error('Failed to save lifts:', error);
    }
  }, []);

  const handleLiftChange = (key: keyof LiftValues) => (value: string) => {
    const newLifts = { ...lifts, [key]: value };
    setLifts(newLifts);
    saveLifts(newLifts);
  };

  const handleCalculate = () => {
    // Validate that at least one lift has a value
    const hasValues = Object.values(lifts).some((v) => v && parseFloat(v.replace(',', '.')) > 0);
    if (hasValues) {
      router.push('/program');
    }
  };

  const isValid = Object.values(lifts).some((v) => v && parseFloat(v.replace(',', '.')) > 0);

  const handleReset = async () => {
    try {
      setLifts(defaultLifts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLifts));
      await resetCompletions();
    } catch (error) {
      console.error('Failed to reset:', error);
    }
  };

  if (isLoading || completionsLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Enter Your 1RM</Text>
        <Text style={styles.subtitle}>One Rep Max for each lift</Text>

        <View style={styles.inputsContainer}>
          <LiftInput
            label="Bench Press"
            value={lifts.bench}
            onChangeText={handleLiftChange('bench')}
            testID="bench"
          />
          <LiftInput
            label="Squat"
            value={lifts.squat}
            onChangeText={handleLiftChange('squat')}
            testID="squat"
          />
          <LiftInput
            label="Overhead Press"
            value={lifts.ohp}
            onChangeText={handleLiftChange('ohp')}
            testID="ohp"
          />
          <LiftInput
            label="Deadlift"
            value={lifts.deadlift}
            onChangeText={handleLiftChange('deadlift')}
            testID="deadlift"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleCalculate}
          disabled={!isValid}
          testID="calculate-button"
        >
          <Text style={styles.buttonText}>Go to your Program</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          testID="reset-button"
        >
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputsContainer: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
