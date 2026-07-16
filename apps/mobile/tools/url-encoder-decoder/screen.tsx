import React from 'react';
import { View } from 'react-native';
import { UrlEncoderDecoderTool } from './UrlEncoderDecoderTool';
import { useColorScheme } from 'nativewind';

export default function UrlEncoderDecoderScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <UrlEncoderDecoderTool />
    </View>
  );
}
