import { StyleSheet, Text, View } from 'react-native';
import { WorkoutSet } from '../types/program';

interface SetRowProps {
  set: WorkoutSet;
  setNumber: number;
  unit: 'kg' | 'lbs';
}

export const SetRow = ({ set, setNumber, unit }: SetRowProps) => {
  const repsDisplay = set.isAMRAP ? `${set.reps}+` : `${set.reps}`;

  return (
    <View style={styles.container} testID={`set-row-${setNumber}`}>
      <View style={styles.setNumberContainer}>
        <Text style={styles.setNumber}>{setNumber}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.weight}>
          {set.weight} {unit}
        </Text>
        <Text style={styles.separator}>×</Text>
        <Text style={[styles.reps, set.isAMRAP && styles.amrapReps]}>
          {repsDisplay}
        </Text>
      </View>
      <Text style={styles.percentage}>{set.percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2a2a4e',
    borderRadius: 8,
    marginBottom: 8,
  },
  setNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3a3a6e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weight: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  separator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  reps: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  amrapReps: {
    color: '#FFD700',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
});
