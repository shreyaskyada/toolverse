import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useJsonFormatter } from '@repo/engines/json-formatter';
import { JsonInput } from './components/JsonInput';
import { JsonOutput } from './components/JsonOutput';
import { JsonToolbar } from './components/JsonToolbar';

export function JsonFormatterTool() {
  const { state, setInput, setSpaces, format, minify, clear } = useJsonFormatter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Header */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>Developer Tools</Text>
        </View>
        <Text style={styles.title}>JSON Formatter</Text>
        <Text style={styles.subtitle}>Format and validate JSON instantly.</Text>
      </View>

      <View style={styles.divider} />

      {/* Tool Area */}
      <View style={styles.toolCard}>
        <JsonToolbar
          onFormat={format}
          onMinify={minify}
          onClear={clear}
          disabled={!state.input.trim() || !!state.error}
          spaces={state.options.spaces}
          onSpacesChange={setSpaces}
        />
        <JsonInput
          value={state.input}
          onChange={setInput}
          error={state.error}
        />
        <JsonOutput value={state.output} />
      </View>

      {/* About Section */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutTitleRow}>
          <View style={styles.aboutAccent} />
          <Text style={styles.aboutTitle}>About JSON Formatter</Text>
        </View>
        <Text style={styles.aboutText}>
          JSON (JavaScript Object Notation) is a lightweight, text-based data-interchange
          format. Raw JSON from APIs is often minified into a single line, making it hard to inspect.
        </Text>
        <Text style={styles.featuresTitle}>Features:</Text>
        <Text style={styles.featureItem}>• Format minified JSON to make it human-readable.</Text>
        <Text style={styles.featureItem}>• Minify formatted JSON to compress space.</Text>
        <Text style={styles.featureItem}>• Validate JSON strings for correctness.</Text>
        <Text style={styles.featureItem}>• One-click copy to clipboard.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#fafafa',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fafafa',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#a1a1aa',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginBottom: 20,
  },
  toolCard: {
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#111111',
  },
  aboutCard: {
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#111111',
  },
  aboutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aboutAccent: {
    width: 4,
    height: 20,
    backgroundColor: '#fafafa',
    borderRadius: 2,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fafafa',
  },
  aboutText: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 4,
  },
});
