import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface JsonOutputProps {
  value: string;
}

export function JsonOutput({ value }: JsonOutputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Output JSON</Text>
      <TextInput
        style={styles.output}
        value={value}
        editable={false}
        multiline
        textAlignVertical="top"
        placeholder="Formatted JSON will appear here..."
        placeholderTextColor="#52525b"
      />
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
  output: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#09090b',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 150,
    color: '#10b981', // subtle green for output syntax
  },
});
