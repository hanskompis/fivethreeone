import { StyleSheet, Text, TextInput, View } from 'react-native';

interface LiftInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
}

export const LiftInput = ({
  label,
  value,
  onChangeText,
  placeholder = '0',
  testID,
}: LiftInputProps) => {
  const handleTextChange = (text: string) => {
    // Only allow positive numbers
    const sanitized = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    const cleanValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : sanitized;
    onChangeText(cleanValue);
  };

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          returnKeyType="done"
          testID={testID ? `${testID}-input` : undefined}
        />
        <Text style={styles.unit}>kg</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a3a6e',
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    padding: 16,
  },
  unit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    paddingRight: 16,
  },
});
