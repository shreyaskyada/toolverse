import React from 'react';
import { View } from 'react-native';
import { JsonFormatterTool } from './JsonFormatterTool';
import { useColorScheme } from 'nativewind';

export default function JsonFormatterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <JsonFormatterTool />
    </View>
  );
}
