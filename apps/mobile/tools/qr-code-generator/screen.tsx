import React from 'react';
import { View } from 'react-native';
import { QRCodeGeneratorTool } from './QRCodeGeneratorTool';
import { useColorScheme } from 'nativewind';

export default function QRCodeGeneratorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <QRCodeGeneratorTool />
    </View>
  );
}
