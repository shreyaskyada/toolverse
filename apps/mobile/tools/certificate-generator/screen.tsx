import React from 'react';
import { View } from 'react-native';
import { CertificateGeneratorTool } from './CertificateGeneratorTool';
import { useColorScheme } from 'nativewind';

export default function CertificateGeneratorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <CertificateGeneratorTool />
    </View>
  );
}
