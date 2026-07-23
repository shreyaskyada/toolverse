import React from 'react';
import { View } from 'react-native';
import { AgeCalculatorTool } from './AgeCalculatorTool';
import { useColorScheme } from 'nativewind';

export default function AgeCalculatorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <AgeCalculatorTool />
    </View>
  );
}
