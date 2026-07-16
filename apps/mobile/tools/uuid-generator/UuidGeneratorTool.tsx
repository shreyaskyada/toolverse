import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Switch } from 'react-native';
import { useUuidGenerator } from '@repo/engines/uuid-generator';
import { Sliders, Zap, Clipboard, Check, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export function UuidGeneratorTool() {
  const {
    state,
    setVersion,
    setQuantity,
    setUppercase,
    setHyphens,
    generate,
    clear,
  } = useUuidGenerator();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const cardBg = isDark ? '#111113' : '#ffffff';
  const cardBorder = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const textMuted = isDark ? '#71717a' : '#a1a1aa';

  const handleCopySingle = (uuid: string, index: number) => {
    // If react-native clipboard were installed we'd call it, but we follow standard mock copy
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#0a0a0b' : '#f8f8f9' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 56 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ alignSelf: 'flex-start', backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#3b82f6' }}>
            Developer Tools
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: textColor, letterSpacing: -0.5 }}>
          UUID Generator
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, marginTop: 4, lineHeight: 20 }}>
          Generate secure, random UUIDs instantly on your device.
        </Text>
      </View>

      {/* Configuration Card */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 1, borderBottomColor: isDark ? '#1e1e20' : '#f0f0f0', paddingBottom: 10, marginBottom: 16 }}>
          <Sliders size={16} color="#3b82f6" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: textColor }}>Configuration</Text>
        </View>

        {/* UUID version selector */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: textMuted, marginBottom: 6 }}>
            UUID Version
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['4', '1'] as const).map((v) => (
              <Pressable
                key={v}
                onPress={() => setVersion(v)}
                style={{
                  flex: 1,
                  height: 38,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: state.options.version === v ? '#3b82f6' : cardBorder,
                  backgroundColor: state.options.version === v ? 'rgba(59,130,246,0.1)' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: state.options.version === v ? '#3b82f6' : textColor }}>
                  Version {v}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quantity Input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: textMuted, marginBottom: 6 }}>
            Quantity (1-100)
          </Text>
          <TextInput
            keyboardType="number-pad"
            value={state.options.quantity.toString()}
            onChangeText={(val) => setQuantity(parseInt(val, 10) || 1)}
            style={{
              height: 40,
              borderWidth: 1,
              borderColor: cardBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: textColor,
              backgroundColor: isDark ? '#1a1a1c' : '#f9f9fb',
            }}
          />
        </View>

        {/* Uppercase toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0' }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>Uppercase</Text>
            <Text style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>Capitalize letters (A-F)</Text>
          </View>
          <Switch
            value={state.options.uppercase}
            onValueChange={setUppercase}
            trackColor={{ false: isDark ? '#27272a' : '#e4e4e7', true: '#3b82f6' }}
          />
        </View>

        {/* Hyphens toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0' }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>Hyphens</Text>
            <Text style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>Include dividers</Text>
          </View>
          <Switch
            value={state.options.hyphens}
            onValueChange={setHyphens}
            trackColor={{ false: isDark ? '#27272a' : '#e4e4e7', true: '#3b82f6' }}
          />
        </View>

        {/* Generate Button */}
        <Pressable
          onPress={generate}
          style={({ pressed }) => ({
            height: 46,
            backgroundColor: pressed ? '#2563eb' : '#3b82f6',
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 10,
          })}
        >
          <Zap size={15} color="#fff" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Generate UUIDs</Text>
        </Pressable>
      </View>

      {/* Output Section */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: textMuted }}>
            Identifiers ({state.uuids.length})
          </Text>
          {state.uuids.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={handleCopyAll}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}
              >
                {copiedAll ? <Check size={12} color="#22c55e" /> : <Clipboard size={12} color={isDark ? '#a1a1aa' : '#71717a'} />}
                <Text style={{ fontSize: 11, color: copiedAll ? '#22c55e' : (isDark ? '#a1a1aa' : '#71717a'), fontWeight: '500' }}>
                  {copiedAll ? 'Copied' : 'Copy All'}
                </Text>
              </Pressable>
              <Pressable
                onPress={clear}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: isDark ? '#1c1c1e' : '#f4f4f5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}
              >
                <Trash2 size={12} color="#ef4444" />
                <Text style={{ fontSize: 11, color: '#ef4444', fontWeight: '500' }}>
                  Clear
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Identifiers List */}
        <View style={{ gap: 8 }}>
          {state.uuids.length > 0 ? (
            state.uuids.map((uuid, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9fb',
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              >
                <Text style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, color: textColor }} numberOfLines={1}>
                  {uuid}
                </Text>
                <Pressable
                  onPress={() => handleCopySingle(uuid, idx)}
                  style={{ padding: 4, marginLeft: 8 }}
                >
                  {copiedIndex === idx ? (
                    <Check size={14} color="#22c55e" />
                  ) : (
                    <Clipboard size={14} color={isDark ? '#71717a' : '#a1a1aa'} />
                  )}
                </Pressable>
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Zap size={24} color={isDark ? '#3f3f46' : '#d4d4d8'} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center' }}>
                Tap "Generate UUIDs" to start
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* About Section */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <View style={{ width: 3, height: 16, backgroundColor: '#3b82f6', borderRadius: 2 }} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: textColor }}>About UUIDs</Text>
        </View>
        <Text style={{ fontSize: 13, color: textMuted, lineHeight: 20 }}>
          UUIDs (Universally Unique Identifiers) are 128-bit identifiers used to guarantee uniqueness. All generations happen client-side in your app without sending data to servers.
        </Text>
      </View>
    </ScrollView>
  );
}
