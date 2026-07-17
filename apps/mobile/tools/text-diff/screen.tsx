import React from 'react';
import { View } from 'react-native';
import { TextDiffTool } from './TextDiffTool';
import { useColorScheme } from 'nativewind';

export default function TextDiffScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <TextDiffTool />
    </View>
  );
}
