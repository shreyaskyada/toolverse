import React from 'react';
import { View } from 'react-native';
import { JwtDecoderTool } from './JwtDecoderTool';
import { useColorScheme } from 'nativewind';

export default function JwtDecoderScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <JwtDecoderTool />
    </View>
  );
}
