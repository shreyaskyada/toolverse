import React from 'react';
import { View } from 'react-native';
import { ImageConverterTool } from './ImageConverterTool';
import { useColorScheme } from 'nativewind';

export default function ImageConverterScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <ImageConverterTool />
    </View>
  );
}
