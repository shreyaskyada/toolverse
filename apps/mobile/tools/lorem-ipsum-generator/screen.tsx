import React from 'react';
import { View } from 'react-native';
import { LoremIpsumGeneratorTool } from './LoremIpsumGeneratorTool';
import { useColorScheme } from 'nativewind';

export default function LoremIpsumGeneratorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <LoremIpsumGeneratorTool />
    </View>
  );
}
