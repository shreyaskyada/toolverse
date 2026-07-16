import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Switch } from 'react-native';
import { usePasswordGenerator } from '@repo/engines/password-generator';
import { Zap, Clipboard, Check, Shield, ShieldCheck, ShieldAlert } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export function PasswordGeneratorTool() {
  const {
    state,
    setLength,
    setIncludeUppercase,
    setIncludeLowercase,
    setIncludeNumbers,
    setIncludeSymbols,
    generate,
  } = usePasswordGenerator();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [copied, setCopied] = useState(false);

  const cardBg = isDark ? '#111113' : '#ffffff';
  const cardBorder = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const textMuted = isDark ? '#71717a' : '#a1a1aa';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = (
    checked: boolean,
    onChange: (val: boolean) => void
  ) => {
    const activeOptions = [
      state.options.includeUppercase,
      state.options.includeLowercase,
      state.options.includeNumbers,
      state.options.includeSymbols,
    ].filter(Boolean).length;

    if (checked && activeOptions === 1) {
      // Trying to uncheck the last option
      return;
    }
    onChange(!checked);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#0a0a0b' : '#f8f8f9' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 56 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ alignSelf: 'flex-start', backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#ef4444' }}>
            Security Tools
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: textColor, letterSpacing: -0.5 }}>
          Password Generator
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, marginTop: 4, lineHeight: 20 }}>
          Generate secure, random passwords client-side instantly.
        </Text>
      </View>

      {/* Settings Card */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 1, borderBottomColor: isDark ? '#1e1e20' : '#f0f0f0', paddingBottom: 10, marginBottom: 16 }}>
          <Shield size={16} color="#ef4444" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: textColor }}>Password Settings</Text>
        </View>

        {/* Password Length */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: textMuted, marginBottom: 6 }}>
            Password Length (6-64)
          </Text>
          <TextInput
            keyboardType="number-pad"
            value={state.options.length.toString()}
            onChangeText={(val) => {
              const num = parseInt(val, 10) || 6;
              setLength(num);
            }}
            onBlur={() => {
              if (state.options.length < 6) setLength(6);
              if (state.options.length > 64) setLength(64);
            }}
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

        {/* Character Toggles */}
        <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: textMuted, marginBottom: 6 }}>
          Character Types
        </Text>

        {/* Uppercase Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>Uppercase (A-Z)</Text>
          <Switch
            value={state.options.includeUppercase}
            onValueChange={(val) => handleToggle(!val, setIncludeUppercase)}
            trackColor={{ false: isDark ? '#27272a' : '#e4e4e7', true: '#ef4444' }}
          />
        </View>

        {/* Lowercase Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>Lowercase (a-z)</Text>
          <Switch
            value={state.options.includeLowercase}
            onValueChange={(val) => handleToggle(!val, setIncludeLowercase)}
            trackColor={{ false: isDark ? '#27272a' : '#e4e4e7', true: '#ef4444' }}
          />
        </View>

        {/* Numbers Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>Numbers (0-9)</Text>
          <Switch
            value={state.options.includeNumbers}
            onValueChange={(val) => handleToggle(!val, setIncludeNumbers)}
            trackColor={{ false: isDark ? '#27272a' : '#e4e4e7', true: '#ef4444' }}
          />
        </View>

        {/* Symbols Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>Symbols (!@#$%)</Text>
          <Switch
            value={state.options.includeSymbols}
            onValueChange={(val) => handleToggle(!val, setIncludeSymbols)}
            trackColor={{ false: isDark ? '#27272a' : '#e4e4e7', true: '#ef4444' }}
          />
        </View>
      </View>

      {/* Generated Result Card */}
      <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 1, borderBottomColor: isDark ? '#1e1e20' : '#f0f0f0', paddingBottom: 10, marginBottom: 16 }}>
          <ShieldCheck size={16} color="#10b981" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: textColor }}>Generated Password</Text>
        </View>

        {/* Output Box */}
        <View
          style={{
            minHeight: 80,
            borderWidth: 1.5,
            borderColor: cardBorder,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f9f9fb',
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              color: textColor,
              textAlign: 'center',
              letterSpacing: 1.5,
            }}
            selectable
          >
            {state.password || 'Select options to generate'}
          </Text>
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Pressable
            onPress={handleCopy}
            disabled={!state.password}
            style={({ pressed }) => ({
              flex: 1,
              height: 42,
              backgroundColor: pressed ? '#1b1b1d' : cardBg,
              borderWidth: 1,
              borderColor: cardBorder,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            })}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Clipboard size={14} color={textColor} />}
            <Text style={{ fontSize: 13, fontWeight: '600', color: copied ? '#10b981' : textColor }}>
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </Pressable>
          <Pressable
            onPress={generate}
            style={({ pressed }) => ({
              flex: 1,
              height: 42,
              backgroundColor: pressed ? '#dc2626' : '#ef4444',
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            })}
          >
            <Zap size={14} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>Regenerate</Text>
          </Pressable>
        </View>

        {/* Strength Meter */}
        {!!state.password && (
          <View style={{ borderTopWidth: 1, borderTopColor: isDark ? '#1e1e20' : '#f0f0f0', paddingTop: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: textMuted }}>Password Strength</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: state.strength.score >= 3 ? '#10b981' : state.strength.score === 2 ? '#f59e0b' : '#ef4444' }}>
                {state.strength.label}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 4, height: 6 }}>
              {[1, 2, 3, 4].map((level) => (
                <View
                  key={level}
                  style={{
                    flex: 1,
                    borderRadius: 3,
                    backgroundColor: state.strength.score >= level ? (state.strength.color === 'bg-emerald-500' ? '#10b981' : state.strength.color === 'bg-blue-500' ? '#3b82f6' : state.strength.color === 'bg-amber-500' ? '#f59e0b' : '#ef4444') : (isDark ? '#27272a' : '#e4e4e7'),
                  }}
                />
              ))}
            </View>
            {state.strength.score < 3 && (
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, alignItems: 'flex-start' }}>
                <ShieldAlert size={14} color="#f59e0b" style={{ marginTop: 1 }} />
                <Text style={{ flex: 1, fontSize: 10, color: textMuted, lineHeight: 14 }}>
                  Try increasing the length or adding more character types to make your password stronger.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
