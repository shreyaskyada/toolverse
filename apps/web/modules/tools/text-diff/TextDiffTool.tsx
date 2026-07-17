'use client';

import React from 'react';
import {
  useTextDiff,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/text-diff';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function TextDiffTool() {
  const {
    state,
    setOriginal,
    setModified,
    setDiffMode,
    handleClearAll,
  } = useTextDiff();

  const clearInputs = () => {
    handleClearAll();
    toast.success('Workspace cleared');
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Controls Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50">
          <div className="flex gap-2 bg-background p-1 rounded-lg border border-border/50 shadow-xs">
            {(['chars', 'words', 'lines'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDiffMode(mode)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  state.diffMode === mode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                By {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <Button variant="outline" onClick={clearInputs} className="gap-2 w-full sm:w-auto h-9 cursor-pointer text-xs">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Input Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-5 py-3 border-b border-border/60 bg-muted/10">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Original Text</h3>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste the original text here..."
                value={state.original}
                onChange={(e) => setOriginal(e.target.value)}
                className="w-full min-h-[250px] p-5 font-mono text-xs resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
              />
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-5 py-3 border-b border-border/60 bg-muted/10">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Modified Text</h3>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste the modified text here..."
                value={state.modified}
                onChange={(e) => setModified(e.target.value)}
                className="w-full min-h-[250px] p-5 font-mono text-xs resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
              />
            </CardContent>
          </Card>
        </div>

        {/* Diff Output Panel (No double card wrap, direct layout inside ToolLayout children) */}
        <div className="border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-border/40">
          <div className="px-5 py-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Diff Result</h3>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-destructive/20 border border-destructive/50"></span>{' '}
                Removed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/50"></span>{' '}
                Added
              </span>
            </div>
          </div>
          <div className="w-full min-h-[200px] p-5 font-mono text-xs whitespace-pre-wrap break-words bg-muted/5 leading-relaxed">
            {state.diffResult.length === 0 ? (
              <span className="text-muted-foreground italic">Diff output will appear here...</span>
            ) : (
              state.diffResult.map((part, index) => {
                const colorClass = part.added
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : part.removed
                    ? 'bg-destructive/20 text-destructive dark:text-red-400 line-through decoration-destructive/50'
                    : 'text-foreground';

                return (
                  <span key={index} className={`${colorClass} rounded-[2px] px-[1px]`}>
                    {part.value}
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
