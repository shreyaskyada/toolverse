import React from 'react';
import { View } from 'react-native';
import { CaseConverterTool } from './CaseConverterTool';
import { useColorScheme } from 'nativewind';

export default function CaseConverterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <CaseConverterTool />
    </View>
  );
}
