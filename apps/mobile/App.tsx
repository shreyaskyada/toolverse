import './global.css';

import React from 'react';
import { StatusBar, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Wrench, Search, Sparkles, Sun, Moon } from 'lucide-react-native';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { useColorScheme } from 'nativewind';
import Svg, { LinearGradient, Stop, Text as SvgText, Defs } from 'react-native-svg';

const sampleTools = [
  { id: 1, title: 'JSON Formatter', desc: 'Format and validate your JSON data instantly.', category: 'Dev' },
  { id: 2, title: 'Regex Tester', desc: 'Test and debug your regular expressions.', category: 'Text' },
  { id: 3, title: 'Base64 Encoder', desc: 'Encode and decode strings to Base64.', category: 'Crypto' },
];

function AppContent() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaView 
      className={`flex-1 bg-background font-sans ${isDarkMode ? 'dark' : ''}`} 
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 h-16 border-b border-border bg-background">
        {/* Logo */}
        <View className="flex-row items-center gap-3">
          <View className="h-8 w-8 rounded-lg bg-primary items-center justify-center">
            <Wrench size={18} color={isDarkMode ? '#0f172a' : '#f8fafc'} />
          </View>
          <View style={{ height: 30, justifyContent: 'center', width: 100 }}>
            <Svg height="30" width="120">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={isDarkMode ? "#ffffff" : "#0f172a"} stopOpacity="1" />
                  <Stop offset="0.5" stopColor={isDarkMode ? "#e2e8f0" : "#334155"} stopOpacity="0.9" />
                  <Stop offset="1" stopColor={isDarkMode ? "#94a3b8" : "#64748b"} stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <SvgText
                fill="url(#grad)"
                fontSize="20"
                fontWeight="bold"
                fontFamily="Inter-Bold"
                x="0"
                y="22"
              >
                Toolverse
              </SvgText>
            </Svg>
          </View>
        </View>
        
        {/* Actions */}
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1">
             <Sparkles size={12} color={isDarkMode ? "#f8fafc" : "#0f172a"} />
             <Text className="text-xs font-medium text-primary font-sans">100+</Text>
          </View>
          
          <Pressable 
            onPress={toggleColorScheme} 
            className="p-2 rounded-lg items-center justify-center bg-muted/50"
            style={({pressed}) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            {isDarkMode ? (
              <Sun size={18} color="#eab308" />
            ) : (
              <Moon size={18} color="#6366f1" />
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Search */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2 font-sans tracking-tight">Find your tool</Text>
          <Text className="text-muted-foreground mb-5 text-base font-sans">
            Everything you need in one place. Ported directly from the web design system.
          </Text>
          <View className="relative flex-row items-center">
            <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: 14, zIndex: 10 }} />
            <Input className="pl-11 h-14 rounded-xl bg-card border-border font-sans text-base" placeholder="Search tools..." />
          </View>
        </View>

        {/* Categories */}
        <View className="flex-row flex-wrap gap-2.5 mb-6">
          <Button variant="default" size="sm" className="rounded-full"><Text className="font-sans font-medium text-primary-foreground">All Tools</Text></Button>
          <Button variant="outline" size="sm" className="rounded-full"><Text className="font-sans font-medium text-foreground">Developer</Text></Button>
          <Button variant="outline" size="sm" className="rounded-full"><Text className="font-sans font-medium text-foreground">Text</Text></Button>
          <Button variant="outline" size="sm" className="rounded-full"><Text className="font-sans font-medium text-foreground">Images</Text></Button>
        </View>

        {/* Tool Cards */}
        <View className="flex-col gap-5">
          {sampleTools.map(tool => (
            <Card key={tool.id} className="w-full bg-card border-border shadow-sm">
              <CardHeader className="p-5">
                <View className="flex-row items-center justify-between mb-3">
                  <Badge variant="secondary" className="rounded-md px-2 py-0.5"><Text className="font-sans text-xs font-medium text-secondary-foreground">{tool.category}</Text></Badge>
                </View>
                <CardTitle className="font-sans text-xl tracking-tight">{tool.title}</CardTitle>
                <CardDescription className="mt-1.5 font-sans text-sm text-muted-foreground">{tool.desc}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-end p-5 pt-0">
                <Button variant="ghost" size="sm" className="px-3">
                  <Text className="font-sans font-medium text-primary">Open Tool</Text>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
