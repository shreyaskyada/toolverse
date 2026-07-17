import React from 'react';
import { View } from 'react-native';
import { NumberRandomizerTool } from './NumberRandomizerTool';
import { useColorScheme } from 'nativewind';

export default function NumberRandomizerScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <NumberRandomizerTool />
    </View>
  );
}
