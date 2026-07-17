'use client';

import React from 'react';
import {
  useWordCounter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/word-counter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Copy,
  Trash2,
  FileEdit,
  Sparkles,
  BookOpen,
  Mic,
  TrendingUp,
  Layers,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function WordCounterTool() {
  const {
    state,
    stats,
    densityResult,
    setText,
    setExcludeStopWords,
    handleClear,
    handleLoadSample,
  } = useWordCounter();

  const handleCopy = () => {
    if (!state.text) {
      toast.warning('Nothing to copy!');
      return;
    }
    navigator.clipboard.writeText(state.text);
    toast.success('Text copied to clipboard!');
  };

  const handleClearWithToast = () => {
    handleClear();
    toast.success('Workspace cleared');
  };

  const handleLoadSampleWithToast = () => {
    handleLoadSample();
    toast.success('Sample text loaded');
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        {/* Main Workspace Area (Textarea left, Y-axis KPI tiles right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Input Workspace */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="flex justify-between items-center">
              <label htmlFor="word-counter-textarea" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Input Text Workspace
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadSampleWithToast}
                  className="h-8 text-xs cursor-pointer"
                >
                  Load Sample
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
                  onClick={handleClearWithToast}
                  className="h-8 text-xs cursor-pointer text-destructive hover:bg-destructive/5 gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>

            <Textarea
              id="word-counter-textarea"
              value={state.text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your content here to begin analysis..."
              className="flex-grow min-h-[300px] font-sans text-sm focus-visible:ring-primary leading-relaxed resize-y"
            />

            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold px-0.5">
              <span>
                Characters (no spaces):{' '}
                <strong className="text-foreground font-mono">{stats.charCountWithoutSpaces}</strong>
              </span>
              <span>
                Avg. Word Length:{' '}
                <strong className="text-foreground font-mono">{stats.avgWordLength} chars</strong>
              </span>
              <span>
                Avg. Sentence Length:{' '}
                <strong className="text-foreground font-mono">{stats.avgSentenceLength} words</strong>
              </span>
            </div>
          </div>

          {/* Stats Cards Column */}
          <div className="flex flex-col gap-3 lg:col-span-1">
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Words
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {stats.wordCount}
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
                    Characters
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {stats.charCountWithSpaces}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Sentences
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {stats.sentenceCount}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileEdit className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Paragraphs
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {stats.paragraphCount}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Readability & Time Estimators */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <CardHeader className="p-5 pb-2 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                <BookOpen className="h-4.5 w-4.5 text-primary" />
                Readability & Speed Estimators
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center p-3 border rounded-xl bg-muted/10">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-4.5 w-4.5 text-emerald-500" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Reading Duration</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">Estimated at 200 WPM</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono font-bold text-xs bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  >
                    {stats.readingTimeMinutes} {stats.readingTimeMinutes === 1 ? 'min' : 'mins'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-xl bg-muted/10">
                  <div className="flex items-center gap-2.5">
                    <Mic className="h-4.5 w-4.5 text-indigo-500" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Speaking Duration</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">Estimated at 130 WPM</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono font-bold text-xs bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                  >
                    {stats.speakingTimeMinutes} {stats.speakingTimeMinutes === 1 ? 'min' : 'mins'}
                  </Badge>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground border-t border-border/40 pt-4 flex gap-1.5 leading-normal font-medium">
                <Info className="h-4 w-4 text-primary shrink-0" />
                Estimator results are calculated client-side based on conversational and silent reading speeds.
              </div>
            </CardContent>
          </Card>

          {/* Word Density Analyzer */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <CardHeader className="p-5 pb-2 border-b border-border/40 flex flex-row justify-between items-center gap-2 space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                Word Density Keyword Analyzer
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setExcludeStopWords(!state.excludeStopWords)}
                  className={`text-[9px] font-bold py-0.5 px-2 rounded-full border cursor-pointer select-none transition-all ${
                    state.excludeStopWords
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted text-muted-foreground border-transparent'
                  }`}
                >
                  Hide Stop Words
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-3">
              {densityResult.densityArray.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-8">
                  Type text to see keyword density details.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="text-[10px] font-bold text-muted-foreground flex justify-between px-0.5 uppercase tracking-wider">
                    <span>Keyword</span>
                    <span>Usage (Share %)</span>
                  </div>
                  <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {densityResult.densityArray.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold px-0.5">
                          <span className="text-foreground">{item.word}</span>
                          <span className="font-mono text-muted-foreground">
                            {item.freq}x ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all animate-grow-width"
                            style={{ width: `${Math.min(100, parseFloat(item.percentage) * 3)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                    Analyzing top {densityResult.densityArray.length} key terms out of{' '}
                    {densityResult.targetCount} total semantic words.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
