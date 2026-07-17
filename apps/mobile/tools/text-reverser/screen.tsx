import React from 'react';
import { View } from 'react-native';
import { TextReverserTool } from './TextReverserTool';
import { useColorScheme } from 'nativewind';

export default function TextReverserScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <TextReverserTool />
    </View>
  );
}
