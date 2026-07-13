import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonInput({ value, onChange, error }: JsonInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Input JSON</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder="Paste your JSON here..."
        placeholderTextColor="#52525b"
        multiline
        textAlignVertical="top"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fafafa',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#09090b',
    color: '#fafafa',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 150,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
});
