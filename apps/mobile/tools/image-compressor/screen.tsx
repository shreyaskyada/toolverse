import React from 'react';
import { View } from 'react-native';
import { ImageCompressorTool } from './ImageCompressorTool';
import { useColorScheme } from 'nativewind';

export default function ImageCompressorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <ImageCompressorTool />
    </View>
  );
}
