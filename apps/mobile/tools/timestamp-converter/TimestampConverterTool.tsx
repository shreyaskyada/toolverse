import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export function TimestampConverterTool() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg = isDark ? '#111113' : '#ffffff';
  const cardBorder = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const textMuted = isDark ? '#71717a' : '#a1a1aa';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#0a0a0b' : '#f8f8f9' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 56 }}
    >
      <View style={{ marginBottom: 24 }}>
        <View style={{ alignSelf: 'flex-start', backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#3b82f6' }}>
            Developer Tools
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: textColor, letterSpacing: -0.5 }}>
          Timestamp Converter
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, marginTop: 4, lineHeight: 20 }}>
          Convert Unix timestamps to human-readable dates and vice versa.
        </Text>
      </View>

      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 20, alignItems: 'center' }}>
        <Clock size={48} color="#3b82f6" style={{ marginBottom: 12 }} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: textColor, textAlign: 'center', marginBottom: 8 }}>
          Timestamp Mobile App
        </Text>
        <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center', lineHeight: 18 }}>
          Please use the desktop/web version to view relative time differences, copy high-resolution milliseconds, and convert dates dynamically.
        </Text>
      </View>
    </ScrollView>
  );
}
