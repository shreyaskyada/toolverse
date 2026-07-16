import React from 'react';
import { View } from 'react-native';
import { TimestampConverterTool } from './TimestampConverterTool';
import { useColorScheme } from 'nativewind';

export default function TimestampConverterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <TimestampConverterTool />
    </View>
  );
}
