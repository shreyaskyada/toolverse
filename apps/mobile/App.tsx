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

import JsonFormatterScreen from './tools/json-formatter/screen';

const sampleTools = [
  { id: 'json-formatter', title: 'JSON Formatter', desc: 'Format and validate your JSON data instantly.', category: 'Dev' },
  { id: 'regex-tester', title: 'Regex Tester', desc: 'Test and debug your regular expressions.', category: 'Text' },
  { id: 'base64-encoder', title: 'Base64 Encoder', desc: 'Encode and decode strings to Base64.', category: 'Crypto' },
];

function AppContent() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [activeTool, setActiveTool] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('All Tools');

  const filteredTools = sampleTools.filter(tool => {
    if (activeCategory === 'All Tools') return true;
    if (activeCategory === 'Developer' && tool.category === 'Dev') return true;
    if (activeCategory === 'Text' && tool.category === 'Text') return true;
    if (activeCategory === 'Images' && tool.category === 'Images') return true;
    if (activeCategory === 'Crypto' && tool.category === 'Crypto') return true;
    return false;
  });

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
                Jumpytools
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

      {activeTool ? (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0a0a0b' : '#f8f8f9' }}>
          {/* Breadcrumb bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              height: 44,
              backgroundColor: isDarkMode ? '#111113' : '#ffffff',
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? '#1e1e20' : '#f0f0f0',
            }}
          >
            {/* Back button */}
            <Pressable
              onPress={() => setActiveTool(null)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                opacity: pressed ? 0.5 : 1,
                paddingRight: 8,
                paddingVertical: 4,
              })}
            >
              <Text style={{ fontSize: 18, lineHeight: 20, color: '#6366f1', marginTop: -1 }}>‹</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#6366f1' }}>Home</Text>
            </Pressable>

            {/* Crumbs */}
            {activeTool === 'json-formatter' && (
              <>
                {/* Separator dot */}
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: isDarkMode ? '#3f3f46' : '#d4d4d8', marginHorizontal: 6 }} />
                <Text style={{ fontSize: 13, color: isDarkMode ? '#52525b' : '#a1a1aa' }}>Dev Tools</Text>
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: isDarkMode ? '#3f3f46' : '#d4d4d8', marginHorizontal: 6 }} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: isDarkMode ? '#e4e4e7' : '#18181b' }}>
                  JSON Formatter
                </Text>
              </>
            )}
          </View>

          {activeTool === 'json-formatter' ? (
            <JsonFormatterScreen />
          ) : (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-xl font-bold text-foreground font-sans text-center mb-2">Coming Soon</Text>
              <Text className="text-muted-foreground text-center font-sans">This tool is not yet available on mobile.</Text>
            </View>
          )}
        </View>
      ) : (
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
            {['All Tools', 'Developer', 'Text', 'Crypto', 'Images'].map(cat => (
              <Button 
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"} 
                size="sm" 
                className="rounded-full"
                onPress={() => setActiveCategory(cat)}
              >
                <Text className={`font-sans font-medium ${activeCategory === cat ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {cat}
                </Text>
              </Button>
            ))}
          </View>

          {/* Tool Cards */}
          <View className="flex-col gap-5">
            {filteredTools.map(tool => (
              <Pressable key={tool.id} onPress={() => setActiveTool(tool.id)}>
                <Card className="w-full bg-card border-border shadow-sm">
                  <CardHeader className="p-5">
                    <View className="flex-row items-center justify-between mb-3">
                      <Badge variant="secondary" className="rounded-md px-2 py-0.5"><Text className="font-sans text-xs font-medium text-secondary-foreground">{tool.category}</Text></Badge>
                    </View>
                    <CardTitle className="font-sans text-xl tracking-tight">{tool.title}</CardTitle>
                    <CardDescription className="mt-1.5 font-sans text-sm text-muted-foreground">{tool.desc}</CardDescription>
                  </CardHeader>
                  <CardFooter className="justify-end p-5 pt-0">
                    <Button variant="ghost" size="sm" className="px-3" onPress={() => setActiveTool(tool.id)}>
                      <Text className="font-sans font-medium text-primary">Open Tool</Text>
                    </Button>
                  </CardFooter>
                </Card>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
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
