import { StyleSheet, Text, View } from 'react-native';
import { Week, LiftName } from '../types/program';
import { WorkoutDay } from './WorkoutDay';

interface WeekCardProps {
  week: Week;
  unit: 'kg' | 'lbs';
  isCompleted?: (lift: LiftName) => boolean;
  onToggleComplete?: (lift: LiftName) => void;
}

export const WeekCard = ({ week, unit, isCompleted, onToggleComplete }: WeekCardProps) => {
  return (
    <View style={styles.container} testID={`week-${week.weekNumber}`}>
      <View style={styles.header}>
        <Text style={styles.weekNumber}>Week {week.weekNumber}</Text>
        <Text style={styles.weekName}>{week.name}</Text>
      </View>
      <View style={styles.workoutsContainer}>
        {week.workouts.map((workout) => (
          <WorkoutDay
            key={workout.lift}
            workout={workout}
            unit={unit}
            isCompleted={isCompleted?.(workout.lift)}
            onToggleComplete={() => onToggleComplete?.(workout.lift)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#3a3a6e',
  },
  weekNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700',
    marginRight: 12,
  },
  weekName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
  },
  workoutsContainer: {
    gap: 0,
  },
});
