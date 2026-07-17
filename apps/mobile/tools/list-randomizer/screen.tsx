import React from 'react';
import { View } from 'react-native';
import { ListRandomizerTool } from './ListRandomizerTool';
import { useColorScheme } from 'nativewind';

export default function ListRandomizerScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <ListRandomizerTool />
    </View>
  );
}
