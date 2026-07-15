import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

interface JsonOutputProps {
  value: string;
  stats: { rootType: string; size: number } | null;
  input: string;
}

export function JsonOutput({ value, stats, input }: JsonOutputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View>
      {/* Label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: isDark ? '#71717a' : '#a1a1aa' }}>
          Output JSON
        </Text>
        {!!value && (
          <Pressable
            onPress={handleCopy}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}
          >
            {copied ? <Check size={12} color="#22c55e" /> : <Copy size={12} color={isDark ? '#a1a1aa' : '#71717a'} />}
            <Text style={{ fontSize: 11, fontWeight: '500', color: copied ? '#22c55e' : isDark ? '#a1a1aa' : '#71717a' }}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Output area */}
      <TextInput
        value={value}
        editable={false}
        multiline
        placeholder="Prettified JSON will appear here..."
        placeholderTextColor={isDark ? '#3f3f46' : '#d4d4d8'}
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 22,
          color: '#10b981',
          backgroundColor: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)',
          borderWidth: 1.5,
          borderColor: value ? 'rgba(16,185,129,0.3)' : isDark ? '#27272a' : '#e4e4e7',
          borderRadius: 12,
          padding: 14,
          minHeight: 180,
          textAlignVertical: 'top',
        }}
      />

      {/* Stats strip */}
      {stats && !!value && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, paddingHorizontal: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#71717a' }}>Type:</Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: isDark ? '#e4e4e7' : '#18181b' }}>{stats.rootType}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#71717a' }}>Size:</Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: isDark ? '#e4e4e7' : '#18181b' }}>{stats.size} B</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#71717a' }}>Chars:</Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: isDark ? '#e4e4e7' : '#18181b' }}>{input.length}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
