import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSettings } from '../hooks/useSettings';

const ROUNDING_OPTIONS = [
  { value: 1.25, label: '1.25 kg' },
  { value: 2.5, label: '2.5 kg' },
  { value: 5, label: '5 kg' },
];

export default function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [saving, setSaving] = useState(false);

  const handleRoundingChange = async (value: number) => {
    setSaving(true);
    try {
      await updateSettings({ roundingIncrement: value });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Rounding</Text>
        <Text style={styles.sectionDescription}>
          Round calculated weights to the nearest plate increment
        </Text>

        <View style={styles.optionsContainer}>
          {ROUNDING_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.roundingIncrement === option.value &&
                  styles.optionButtonActive,
              ]}
              onPress={() => handleRoundingChange(option.value)}
              disabled={saving}
              testID={`rounding-${option.value}`}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.roundingIncrement === option.value &&
                    styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About 5/3/1</Text>
        <Text style={styles.infoText}>
          The 5/3/1 program uses 90% of your 1RM as your Training Max. Each
          4-week cycle progresses through different rep ranges:
        </Text>
        <Text style={styles.infoText}>• Week 1: 5/5/5+ reps</Text>
        <Text style={styles.infoText}>• Week 2: 3/3/3+ reps</Text>
        <Text style={styles.infoText}>• Week 3: 5/3/1+ reps</Text>
        <Text style={styles.infoText}>• Week 4: Deload (5/5/5)</Text>
        <Text style={styles.infoText}>
          {'\n'}The + means AMRAP (As Many Reps As Possible).
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        testID="back-button"
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#2a2a4e',
    borderWidth: 2,
    borderColor: '#3a3a6e',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  optionTextActive: {
    color: '#1a1a2e',
  },
  infoSection: {
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#3a3a6e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
