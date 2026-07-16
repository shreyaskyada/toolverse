import React from 'react';
import { View } from 'react-native';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
import { useColorScheme } from 'nativewind';

export default function PasswordGeneratorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <PasswordGeneratorTool />
    </View>
  );
}
