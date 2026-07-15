import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useColorScheme } from 'nativewind';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonInput({ value, onChange, error }: JsonInputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const hasError = !!error;
  const isValid = !error && !!value.trim();

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: isDark ? '#71717a' : '#a1a1aa' }}>
          Input JSON
        </Text>
        {hasError && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#ef4444' }}>✕ Invalid</Text>
          </View>
        )}
        {isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#22c55e' }}>✓ Valid</Text>
          </View>
        )}
      </View>

      {/* Textarea */}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Paste or type raw JSON here..."
        placeholderTextColor={isDark ? '#3f3f46' : '#d4d4d8'}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 22,
          color: isDark ? '#e4e4e7' : '#18181b',
          backgroundColor: isDark ? '#0f0f10' : '#fafafa',
          borderWidth: 1.5,
          borderColor: hasError ? '#ef4444' : isValid ? 'rgba(34,197,94,0.4)' : isDark ? '#27272a' : '#e4e4e7',
          borderRadius: 12,
          padding: 14,
          minHeight: 180,
          textAlignVertical: 'top',
        }}
      />

      {/* Error message */}
      {hasError && (
        <View style={{ marginTop: 8, backgroundColor: 'rgba(239,68,68,0.08)', padding: 10, borderRadius: 8 }}>
          <Text style={{ fontSize: 11, color: '#ef4444', fontFamily: 'monospace', lineHeight: 16 }} numberOfLines={3}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
