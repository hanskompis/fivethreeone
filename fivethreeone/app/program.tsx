import { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { generateFullProgram } from '../utils/calculations';
import { LiftValues, Program, Settings } from '../types/program';
import { WeekCard } from '../components/WeekCard';
import { useSettings } from '../hooks/useSettings';

const LIFTS_STORAGE_KEY = '@fivethreeone_lifts';

interface StoredLifts {
  bench: string;
  squat: string;
  ohp: string;
  deadlift: string;
}

export default function ProgramScreen() {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [storedLifts, setStoredLifts] = useState<StoredLifts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Load lift values
  useEffect(() => {
    const loadLifts = async () => {
      try {
        const saved = await AsyncStorage.getItem(LIFTS_STORAGE_KEY);
        if (saved) {
          setStoredLifts(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load lifts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLifts();
  }, []);

  // Convert string values to numbers for calculation
  const liftValues: LiftValues = useMemo(() => {
    if (!storedLifts) {
      return { bench: 0, squat: 0, ohp: 0, deadlift: 0 };
    }
    return {
      bench: parseFloat(storedLifts.bench) || 0,
      squat: parseFloat(storedLifts.squat) || 0,
      ohp: parseFloat(storedLifts.ohp) || 0,
      deadlift: parseFloat(storedLifts.deadlift) || 0,
    };
  }, [storedLifts]);

  // Generate the program
  const program: Program | null = useMemo(() => {
    const hasValues = Object.values(liftValues).some((v) => v > 0);
    if (!hasValues) return null;
    return generateFullProgram(liftValues, settings as Settings);
  }, [liftValues, settings]);

  if (isLoading || settingsLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!program) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Lift Values</Text>
          <Text style={styles.emptyText}>
            Enter your 1RM values to generate a program
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentWeek = program.weeks[selectedWeek - 1];

  return (
    <View style={styles.container}>
      {/* Week selector tabs */}
      <View style={styles.tabsContainer}>
        {program.weeks.map((week) => (
          <TouchableOpacity
            key={week.weekNumber}
            style={[
              styles.tab,
              selectedWeek === week.weekNumber && styles.tabActive,
            ]}
            onPress={() => setSelectedWeek(week.weekNumber)}
            testID={`tab-week-${week.weekNumber}`}
          >
            <Text
              style={[
                styles.tabText,
                selectedWeek === week.weekNumber && styles.tabTextActive,
              ]}
            >
              W{week.weekNumber}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WeekCard week={currentWeek} unit={settings.unit} />

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.back()}
          testID="edit-button"
        >
          <Text style={styles.editButtonText}>Edit Lift Values</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2a2a4e',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#888',
  },
  tabTextActive: {
    color: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  editButton: {
    backgroundColor: '#3a3a6e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
