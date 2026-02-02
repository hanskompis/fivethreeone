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
import { LiftName, LiftSettings, RoundingMode, LIFT_DISPLAY_NAMES } from '../types/program';

const INCREMENT_OPTIONS = [
  { value: 2.5, label: '2.5 kg' },
  { value: 5, label: '5 kg' },
  { value: 10, label: '10 kg' },
];

const ROUNDING_MODE_OPTIONS: { value: RoundingMode; label: string; description: string }[] = [
  { value: 'down', label: 'Round Down', description: 'Always round to lower weight' },
  { value: 'nearest', label: 'Round Nearest', description: 'Round to closest weight' },
  { value: 'up', label: 'Round Up', description: 'Always round to higher weight' },
];

const LIFT_ORDER: LiftName[] = ['bench', 'squat', 'ohp', 'deadlift'];

export default function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [expandedLift, setExpandedLift] = useState<LiftName | null>(null);

  const handleLiftSettingChange = async (
    lift: LiftName,
    newSettings: Partial<LiftSettings>
  ) => {
    setSaving(true);
    try {
      await updateSettings({
        liftSettings: {
          ...settings.liftSettings,
          [lift]: {
            ...settings.liftSettings[lift],
            ...newSettings,
          },
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleLift = (lift: LiftName) => {
    setExpandedLift(expandedLift === lift ? null : lift);
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
        <Text style={styles.sectionTitle}>Per-Lift Configuration</Text>
        <Text style={styles.sectionDescription}>
          Configure weight rounding individually for each lift
        </Text>

        {LIFT_ORDER.map((lift) => {
          const liftSettings = settings.liftSettings[lift];
          const isExpanded = expandedLift === lift;

          return (
            <View key={lift} style={styles.liftCard}>
              <TouchableOpacity
                style={styles.liftHeader}
                onPress={() => toggleLift(lift)}
                testID={`lift-header-${lift}`}
              >
                <View>
                  <Text style={styles.liftName}>{LIFT_DISPLAY_NAMES[lift]}</Text>
                  <Text style={styles.liftSettings}>
                    {liftSettings.increment} kg • {liftSettings.roundingMode}
                  </Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.liftDetails}>
                  {/* Increment Options */}
                  <Text style={styles.detailLabel}>Weight Increment</Text>
                  <View style={styles.optionsRow}>
                    {INCREMENT_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.optionButtonSmall,
                          liftSettings.increment === option.value &&
                            styles.optionButtonActive,
                        ]}
                        onPress={() =>
                          handleLiftSettingChange(lift, { increment: option.value })
                        }
                        disabled={saving}
                        testID={`${lift}-increment-${option.value}`}
                      >
                        <Text
                          style={[
                            styles.optionTextSmall,
                            liftSettings.increment === option.value &&
                              styles.optionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Rounding Mode Options */}
                  <Text style={[styles.detailLabel, { marginTop: 16 }]}>
                    Rounding Mode
                  </Text>
                  {ROUNDING_MODE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.roundingOption,
                        liftSettings.roundingMode === option.value &&
                          styles.roundingOptionActive,
                      ]}
                      onPress={() =>
                        handleLiftSettingChange(lift, { roundingMode: option.value })
                      }
                      disabled={saving}
                      testID={`${lift}-rounding-${option.value}`}
                    >
                      <View>
                        <Text
                          style={[
                            styles.roundingLabel,
                            liftSettings.roundingMode === option.value &&
                              styles.roundingLabelActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                        <Text
                          style={[
                            styles.roundingDescription,
                            liftSettings.roundingMode === option.value &&
                              styles.roundingDescriptionActive,
                          ]}
                        >
                          {option.description}
                        </Text>
                      </View>
                      {liftSettings.roundingMode === option.value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
  liftCard: {
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  liftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  liftName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  liftSettings: {
    fontSize: 14,
    color: '#888',
  },
  expandIcon: {
    fontSize: 18,
    color: '#888',
  },
  liftDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#3a3a6e',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButtonSmall: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#3a3a6e',
    borderWidth: 2,
    borderColor: '#4a4a8e',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  optionTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  optionTextActive: {
    color: '#1a1a2e',
  },
  roundingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3a3a6e',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4a4a8e',
  },
  roundingOptionActive: {
    backgroundColor: '#4a4a8e',
    borderColor: '#FFD700',
  },
  roundingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  roundingLabelActive: {
    color: '#FFD700',
  },
  roundingDescription: {
    fontSize: 12,
    color: '#888',
  },
  roundingDescriptionActive: {
    color: '#ccc',
  },
  checkmark: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '700',
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
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
