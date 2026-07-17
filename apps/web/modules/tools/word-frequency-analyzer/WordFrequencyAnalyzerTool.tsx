'use client';

import React from 'react';
import {
  useWordFrequencyAnalyzer,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/word-frequency-analyzer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, ClipboardPaste, FileText, Layers, RefreshCw, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function WordFrequencyAnalyzerTool() {
  const {
    state,
    analysis,
    setText,
    setExcludeStopWords,
    handleClear,
    handleLoadSample,
  } = useWordFrequencyAnalyzer();

  const handleCopy = async () => {
    if (!state.text) return;
    try {
      await navigator.clipboard.writeText(state.text);
      toast.success('Copied text to clipboard!');
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
      toast.success('Pasted text from clipboard!');
    } catch {
      toast.error('Failed to read clipboard.');
    }
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        {/* Main Workspace Grid (left: inputs & table, right: stats/config) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Input & Table Column */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            
            {/* Input Header & Area */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label htmlFor="word-frequency-textarea" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Input Text Workspace
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadSample}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Load Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePaste}
                    className="h-8 text-xs cursor-pointer gap-1"
                  >
                    <ClipboardPaste className="h-3 w-3" />
                    Paste
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs cursor-pointer gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 text-xs cursor-pointer text-destructive hover:bg-destructive/5 gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>

              <Textarea
                id="word-frequency-textarea"
                value={state.text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text content here to run real-time frequency, keyword density, and vocabulary audits..."
                className="min-h-[220px] font-sans text-sm focus-visible:ring-primary leading-relaxed resize-y"
              />
            </div>

            {/* Frequencies Density Table */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Keyword Density & Frequencies Table
              </label>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/5">
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/80 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Word</th>
                        <th className="px-4 py-3">Count</th>
                        <th className="px-4 py-3">Density</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {analysis.frequencies.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                            No words to analyze. Try loading a sample or typing some text above!
                          </td>
                        </tr>
                      ) : (
                        analysis.frequencies.map((freq, index) => (
                          <tr key={freq.word} className="hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-2.5 font-semibold text-muted-foreground">{index + 1}</td>
                            <td className="px-4 py-2.5 font-semibold text-foreground font-mono">{freq.word}</td>
                            <td className="px-4 py-2.5 font-mono text-foreground">{freq.count}</td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-foreground w-12">{freq.density}%</span>
                                <div className="h-1.5 w-24 bg-muted/60 rounded-full overflow-hidden shrink-0">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${Math.min(freq.density * 5, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Stats / Settings Column */}
          <div className="flex flex-col gap-3 lg:col-span-1">
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Total Words
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {analysis.totalWords}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Unique Words
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {analysis.uniqueWords}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Duplicate Words
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {analysis.duplicateWordsCount}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Top Keyword
                  </p>
                  <h3 className="text-sm font-extrabold text-foreground font-mono leading-none mt-1 truncate">
                    {analysis.topKeyword}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Config Card */}
            <div className="border border-border rounded-xl p-3.5 bg-muted/20 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Settings
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Filter Stop Words</span>
                <button
                  onClick={() => setExcludeStopWords(!state.excludeStopWords)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all cursor-pointer relative ${
                    state.excludeStopWords
                      ? 'bg-primary'
                      : 'bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                      state.excludeStopWords ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </ToolLayout>
  );
}
export default WordFrequencyAnalyzerTool;
