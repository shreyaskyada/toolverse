import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { JsonFormatterTool } from './JsonFormatterTool';

export default function JsonFormatterScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <JsonFormatterTool />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
