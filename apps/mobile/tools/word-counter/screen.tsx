import React from 'react';
import { View } from 'react-native';
import { WordCounterTool } from './WordCounterTool';
import { useColorScheme } from 'nativewind';

export default function WordCounterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <WordCounterTool />
    </View>
  );
}
