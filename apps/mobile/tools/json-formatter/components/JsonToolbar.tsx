import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, Trash2, FlaskConical } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

interface JsonToolbarProps {
  onClear: () => void;
  spaces: number | 'tab';
  onSpacesChange: (spaces: number | 'tab') => void;
  onLoadSample: () => void;
}

export function JsonToolbar({ onClear, spaces, onSpacesChange, onLoadSample }: JsonToolbarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: isDark ? '#27272a' : '#f0f0f0' }}>
      {/* Indent picker */}
      <Pressable
        onPress={() => onSpacesChange(spaces === 2 ? 4 : spaces === 4 ? 'tab' : 2)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 }}
      >
        <Text style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#71717a', fontWeight: '500' }}>Indent</Text>
        <Text style={{ fontSize: 12, color: isDark ? '#fafafa' : '#18181b', fontWeight: '600' }}>
          {spaces === 'tab' ? 'Tab' : `${spaces} sp`}
        </Text>
        <ChevronDown size={12} color={isDark ? '#71717a' : '#a1a1aa'} />
      </Pressable>

      {/* Right actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={onLoadSample}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 }}
        >
          <FlaskConical size={12} color={isDark ? '#a1a1aa' : '#71717a'} />
          <Text style={{ fontSize: 12, color: isDark ? '#fafafa' : '#18181b', fontWeight: '500' }}>Sample</Text>
        </Pressable>
        <Pressable
          onPress={onClear}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 }}
        >
          <Trash2 size={12} color="#ef4444" />
          <Text style={{ fontSize: 12, color: '#ef4444', fontWeight: '500' }}>Clear</Text>
        </Pressable>
      </View>
    </View>
  );
}
