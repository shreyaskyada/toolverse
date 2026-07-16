import React from 'react';
import { View } from 'react-native';
import { UuidGeneratorTool } from './UuidGeneratorTool';
import { useColorScheme } from 'nativewind';

export default function UuidGeneratorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <UuidGeneratorTool />
    </View>
  );
}
