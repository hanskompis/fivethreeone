import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { WorkoutDay as WorkoutDayType } from '../types/program';
import { SetRow } from './SetRow';

interface WorkoutDayProps {
  workout: WorkoutDayType;
  unit: 'kg' | 'lbs';
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export const WorkoutDay = ({ workout, unit, isCompleted = false, onToggleComplete }: WorkoutDayProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.containerCompleted]}
      onPress={onToggleComplete}
      activeOpacity={0.7}
      testID={`workout-${workout.lift}`}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.liftName, isCompleted && styles.liftNameCompleted]}>
            {workout.liftDisplayName}
          </Text>
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.trainingMax}>
          TM: {workout.trainingMax} {unit}
        </Text>
      </View>
      <View style={styles.setsContainer}>
        {workout.sets.map((set, index) => (
          <SetRow
            key={index}
            set={set}
            setNumber={index + 1}
            unit={unit}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  containerCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liftName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  liftNameCompleted: {
    color: '#22c55e',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22c55e',
  },
  trainingMax: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  setsContainer: {
    gap: 0,
  },
});
