'use client';

import React from 'react';
import {
  useListRandomizer,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/list-randomizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Copy, ClipboardPaste, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function ListRandomizerTool() {
  const {
    state,
    setText,
    setDelimiter,
    handleClear,
    handleLoadSample,
    handleShuffle,
  } = useListRandomizer();

  const handleCopy = async () => {
    if (!state.output) return;
    try {
      await navigator.clipboard.writeText(state.output);
      toast.success('Copied randomized list to clipboard!');
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
      toast.success('Pasted list from clipboard!');
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
      <div className="flex flex-col gap-5 w-full">
        {/* Controls Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/40">
          <div className="flex gap-1.5 bg-background p-1 rounded-md border border-border/40 shadow-xs">
            {([
              { id: 'newline', label: 'Newlines' },
              { id: 'comma', label: 'Commas' },
              { id: 'semicolon', label: 'Semicolons' },
            ] as const).map((delim) => (
              <button
                key={delim.id}
                onClick={() => setDelimiter(delim.id)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-sm transition-all cursor-pointer ${
                  state.delimiter === delim.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                {delim.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleShuffle}
              disabled={!state.text}
              size="sm"
              className="gap-1.5 h-8 cursor-pointer text-xs flex-grow sm:flex-grow-0"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle List
            </Button>
            <Button variant="outline" size="sm" onClick={handleLoadSample} className="h-8 text-xs cursor-pointer">
              Load Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} className="gap-1.5 h-8 cursor-pointer text-xs text-destructive hover:bg-destructive/5 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Input & Output Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Input List
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                className="h-7 text-[10px] uppercase font-bold tracking-wider gap-1 cursor-pointer text-muted-foreground hover:text-foreground animate-none"
              >
                <ClipboardPaste className="h-3 w-3" />
                Paste
              </Button>
            </div>
            <Textarea
              placeholder={`Enter list items (separated by ${
                state.delimiter === 'newline' ? 'newlines' : state.delimiter === 'comma' ? 'commas' : 'semicolons'
              })...`}
              value={state.text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[220px] p-3 font-sans text-sm border border-border rounded-lg bg-transparent focus-visible:ring-primary focus-visible:ring-1 resize-y"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Randomized Result
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!state.output}
                className="h-7 text-[10px] uppercase font-bold tracking-wider gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>
            <Textarea
              readOnly
              placeholder="Randomized output will appear here..."
              value={state.output}
              className="w-full min-h-[220px] p-3 font-sans text-sm border border-border rounded-lg bg-muted/5 focus-visible:ring-0 resize-y"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
export default ListRandomizerTool;
