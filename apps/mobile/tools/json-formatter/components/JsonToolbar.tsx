import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface JsonToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  disabled: boolean;
  spaces: number;
  onSpacesChange: (spaces: number) => void;
}

export function JsonToolbar({ onFormat, onMinify, onClear, disabled, spaces, onSpacesChange }: JsonToolbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.primaryButton, disabled && styles.disabledButton]}
          onPress={onFormat}
          disabled={disabled}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Format</Text>
        </Pressable>
        
        <Pressable
          style={[styles.button, styles.secondaryButton, disabled && styles.disabledButton]}
          onPress={onMinify}
          disabled={disabled}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Minify</Text>
        </Pressable>
      </View>
      
      <Pressable
        style={[styles.button, styles.dangerButton]}
        onPress={onClear}
      >
        <Text style={[styles.buttonText, styles.dangerButtonText]}>Clear</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: '#fafafa',
  },
  secondaryButton: {
    backgroundColor: '#27272a',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButtonText: {
    color: '#09090b',
  },
  secondaryButtonText: {
    color: '#fafafa',
  },
  dangerButtonText: {
    color: '#ef4444',
  },
});
