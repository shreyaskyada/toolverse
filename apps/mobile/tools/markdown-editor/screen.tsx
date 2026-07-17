import React from 'react';
import { View } from 'react-native';
import { MarkdownEditorTool } from './MarkdownEditorTool';
import { useColorScheme } from 'nativewind';

export default function MarkdownEditorScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
      <MarkdownEditorTool />
    </View>
  );
}
