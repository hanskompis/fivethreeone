import { StyleSheet, Text, View } from 'react-native';
import { WorkoutDay as WorkoutDayType } from '../types/program';
import { SetRow } from './SetRow';

interface WorkoutDayProps {
  workout: WorkoutDayType;
  unit: 'kg' | 'lbs';
}

export const WorkoutDay = ({ workout, unit }: WorkoutDayProps) => {
  return (
    <View style={styles.container} testID={`workout-${workout.lift}`}>
      <View style={styles.header}>
        <Text style={styles.liftName}>{workout.liftDisplayName}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liftName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
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
