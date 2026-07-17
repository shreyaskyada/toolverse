'use client';

import React from 'react';
import {
  useLoremIpsumGenerator,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/lorem-ipsum-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { RangeSlider } from '@/components/ui/range-slider';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function LoremIpsumGeneratorTool() {
  const {
    state,
    setCount,
    setType,
    setStartWithLorem,
    generateText,
    triggerCopy,
  } = useLoremIpsumGenerator();

  const copyToClipboard = async () => {
    if (!state.output) return;
    try {
      await navigator.clipboard.writeText(state.output);
      triggerCopy();
      toast.success('Copied to clipboard!');
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
        {/* Settings Panel (Left Column) */}
        <div className="flex flex-col gap-5 lg:col-span-1 lg:border-r lg:border-border/60 lg:pr-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Format
            </label>
            <div className="grid grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border/40">
              {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-1.5 px-1 text-[11px] sm:text-xs font-medium rounded-md transition-all cursor-pointer ${
                    state.type === t
                      ? 'bg-background text-foreground shadow-xs border border-border/50'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Count
              </label>
              <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {state.count} {state.type}
              </span>
            </div>
            <RangeSlider
              min={1}
              max={state.type === 'words' ? 500 : state.type === 'sentences' ? 50 : 20}
              step={1}
              value={state.count}
              onChange={setCount}
              minLabel="1"
              maxLabel={state.type === 'words' ? '500' : state.type === 'sentences' ? '50' : '20'}
            />
          </div>

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border/40">
            <input
              type="checkbox"
              id="startWithLorem"
              checked={state.startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="startWithLorem"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Start with "Lorem ipsum..."
            </label>
          </div>

          <Button onClick={generateText} className="w-full gap-2 mt-auto cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            Regenerate Text
          </Button>
        </div>

        {/* Output Panel (Right Column) */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Generated Result
            </label>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-3 cursor-pointer"
              onClick={copyToClipboard}
            >
              {state.copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {state.copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <Textarea
            readOnly
            value={state.output}
            className="w-full flex-grow min-h-[350px] overflow-y-auto p-4 text-sm font-medium leading-relaxed resize-y border border-border focus-visible:ring-primary focus-visible:ring-1 bg-transparent custom-scrollbar font-sans"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
