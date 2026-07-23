import React from 'react';
import { View } from 'react-native';
import { ColorConverterTool } from './ColorConverterTool';
import { useColorScheme } from 'nativewind';

export default function ColorConverterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <ColorConverterTool />
    </View>
  );
}
