'use client';

import React from 'react';
import {
  useNumberRandomizer,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/number-randomizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function NumberRandomizerTool() {
  const {
    state,
    setMin,
    setMax,
    setCount,
    setAllowDuplicates,
    setSortBy,
    setDelimiter,
    handleGenerate,
    handleClear,
  } = useNumberRandomizer();

  const handleCopy = async () => {
    if (!state.output) return;
    try {
      await navigator.clipboard.writeText(state.output);
      toast.success('Copied numbers to clipboard!');
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Settings Panel */}
        <div className="flex flex-col gap-4 lg:col-span-1 lg:border-r lg:border-border/60 lg:pr-6">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Configuration
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground">Min Range</span>
              <Input
                type="number"
                value={state.min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground">Max Range</span>
              <Input
                type="number"
                value={state.max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-foreground">Numbers to Generate</span>
            <Input
              type="number"
              min={1}
              value={state.count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-foreground">Delimiter</span>
            <Select value={state.delimiter} onValueChange={(val: any) => setDelimiter(val)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comma">Comma (,)</SelectItem>
                <SelectItem value="space">Space ( )</SelectItem>
                <SelectItem value="newline">Newline (\n)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-foreground">Sort Order</span>
            <Select value={state.sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Random)</SelectItem>
                <SelectItem value="asc">Ascending (1 to 9)</SelectItem>
                <SelectItem value="desc">Descending (9 to 1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-lg border border-border/40 mt-1">
            <span className="text-xs font-semibold text-foreground">Allow Duplicates</span>
            <button
              onClick={() => setAllowDuplicates(!state.allowDuplicates)}
              className={`w-9 h-5 rounded-full p-0.5 transition-all cursor-pointer relative ${
                state.allowDuplicates
                  ? 'bg-primary'
                  : 'bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                  state.allowDuplicates ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-2 mt-auto pt-4">
            <Button onClick={handleGenerate} className="flex-grow gap-2 h-9 cursor-pointer text-xs">
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
            <Button variant="outline" onClick={handleClear} className="h-9 text-xs cursor-pointer px-3">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Generated Numbers Result
            </label>
            <Button
              variant="outline"
              size="sm"
              disabled={!state.output}
              className="h-8 gap-1.5 px-3 cursor-pointer"
              onClick={handleCopy}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          <Textarea
            readOnly
            placeholder="Click 'Generate' to create random numbers..."
            value={state.output}
            className="w-full flex-grow min-h-[350px] overflow-y-auto p-4 font-mono text-sm leading-relaxed resize-y border border-border bg-muted/5 focus-visible:ring-0 rounded-lg custom-scrollbar"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
export default NumberRandomizerTool;
