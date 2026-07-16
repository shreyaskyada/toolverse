import React from 'react';
import { View } from 'react-native';
import { Base64ImageConverterTool } from './Base64ImageConverterTool';
import { useColorScheme } from 'nativewind';

export default function Base64ImageConverterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <Base64ImageConverterTool />
    </View>
  );
}
