import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useJsonFormatter } from '@repo/engines/json-formatter';
import { JsonInput } from './components/JsonInput';
import { JsonOutput } from './components/JsonOutput';
import { JsonToolbar } from './components/JsonToolbar';
import { Sparkles, Minimize2, ShieldCheck } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const sampleJson = {
  name: 'Jumpytools',
  version: '1.0.0',
  features: ['offline processing', 'client-side validation', 'responsive UI'],
  active: true,
  stats: { tools: 100, speed: 'instant' },
};

export function JsonFormatterTool() {
  const { state, setInput, setSpaces, format, minify, validate, clear } = useJsonFormatter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loadSample = () => setInput(JSON.stringify(sampleJson, null, 2));

  const cardBg = isDark ? '#111113' : '#ffffff';
  const cardBorder = isDark ? '#27272a' : '#e4e4e7';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#0a0a0b' : '#f8f8f9' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 56 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header ── */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ alignSelf: 'flex-start', backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#6366f1' }}>
            Developer Tools
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: isDark ? '#fafafa' : '#09090b', letterSpacing: -0.5 }}>
          JSON Formatter
        </Text>
        <Text style={{ fontSize: 14, color: isDark ? '#71717a' : '#a1a1aa', marginTop: 4, lineHeight: 20 }}>
          Format, minify and validate JSON instantly.
        </Text>
      </View>

      {/* ── Tool card ── */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
        <JsonToolbar
          onClear={clear}
          spaces={state.options.spaces}
          onSpacesChange={setSpaces}
          onLoadSample={loadSample}
        />

        <JsonInput
          value={state.input}
          onChange={setInput}
          error={state.error}
        />

        <View style={{ height: 1, backgroundColor: isDark ? '#1e1e20' : '#f0f0f0', marginBottom: 16 }} />

        <JsonOutput
          value={state.output}
          stats={state.stats ?? null}
          input={state.input}
        />

        {/* Action buttons */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
          {/* Prettify – primary */}
          <Pressable
            onPress={format}
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 10,
              backgroundColor: pressed ? '#4f46e5' : '#6366f1',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            })}
          >
            <Sparkles size={14} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>Prettify</Text>
          </Pressable>

          {/* Minify – secondary */}
          <Pressable
            onPress={minify}
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 10,
              backgroundColor: isDark
                ? pressed ? '#27272a' : '#1c1c1e'
                : pressed ? '#e4e4e7' : '#f4f4f5',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              borderWidth: 1,
              borderColor: isDark ? '#3f3f46' : '#e4e4e7',
            })}
          >
            <Minimize2 size={14} color={isDark ? '#e4e4e7' : '#18181b'} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#e4e4e7' : '#18181b' }}>Minify</Text>
          </Pressable>

          {/* Validate – outline */}
          <Pressable
            onPress={validate}
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 10,
              backgroundColor: isDark
                ? pressed ? '#27272a' : '#1c1c1e'
                : pressed ? '#e4e4e7' : '#f4f4f5',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              borderWidth: 1,
              borderColor: isDark ? '#3f3f46' : '#e4e4e7',
            })}
          >
            <ShieldCheck size={14} color={isDark ? '#e4e4e7' : '#18181b'} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#e4e4e7' : '#18181b' }}>Validate</Text>
          </Pressable>
        </View>
      </View>

      {/* ── About card ── */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <View style={{ width: 3, height: 16, backgroundColor: '#6366f1', borderRadius: 2 }} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#fafafa' : '#09090b' }}>About</Text>
        </View>
        <Text style={{ fontSize: 13, color: isDark ? '#71717a' : '#a1a1aa', lineHeight: 20 }}>
          All processing runs locally on your device — nothing is sent to any server. Paste raw JSON from an API, pick your indent size, and tap Prettify.
        </Text>
      </View>

      {/* ── FAQ ── */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, overflow: 'hidden' }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#fafafa' : '#09090b' }}>FAQ</Text>
        </View>
        {[
          { q: 'Is my data private?', a: 'Yes — everything runs on-device. Nothing is sent to a server.' },
          { q: 'How do I change indent size?', a: 'Tap the Indent button in the toolbar to cycle between 2 spaces, 4 spaces, and tab.' },
          { q: 'What if my JSON is invalid?', a: 'An "Invalid" badge appears and the error is shown below the input box.' },
        ].map((item, i, arr) => (
          <View
            key={i}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderTopWidth: 1,
              borderTopColor: isDark ? '#1e1e20' : '#f0f0f0',
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#e4e4e7' : '#18181b', marginBottom: 4 }}>
              {item.q}
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? '#71717a' : '#a1a1aa', lineHeight: 18 }}>
              {item.a}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
