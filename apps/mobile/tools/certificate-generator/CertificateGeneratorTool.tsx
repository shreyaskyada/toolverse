import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Award } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export function CertificateGeneratorTool() {
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
            Design & Color
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: textColor, letterSpacing: -0.5 }}>
          Certificate Generator
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, marginTop: 4, lineHeight: 20 }}>
          Design and generate custom certificates of achievement.
        </Text>
      </View>

      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 20, alignItems: 'center' }}>
        <Award size={48} color="#3b82f6" style={{ marginBottom: 12 }} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: textColor, textAlign: 'center', marginBottom: 8 }}>
          Certificate Generator Mobile
        </Text>
        <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center', lineHeight: 18 }}>
          Please use the desktop/web version to draw signatures, upload organizational logos, render high-resolution canvas print files, and download PNG/PDF certificates.
        </Text>
      </View>
    </ScrollView>
  );
}
export default CertificateGeneratorTool;
