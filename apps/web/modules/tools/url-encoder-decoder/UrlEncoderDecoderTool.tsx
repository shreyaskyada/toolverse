'use client';

import React from 'react';
import {
  useUrlEncoderDecoder,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/url-encoder-decoder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, ArrowDownUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function UrlEncoderDecoderTool() {
  const {
    state,
    setInput,
    setMode,
    toggleMode,
    triggerCopy,
  } = useUrlEncoderDecoder();

  const handleCopy = async () => {
    if (!state.output) return;
    try {
      await navigator.clipboard.writeText(state.output);
      triggerCopy();
      toast.success('Copied result to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-4">
        {/* Top controls inside workspace card */}
        <div className="pb-4 border-b border-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                state.mode === 'encode'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Encode URL
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                state.mode === 'decode'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Decode URL
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={toggleMode} className="gap-2 h-8 cursor-pointer text-xs">
            <ArrowDownUp className="h-3.5 w-3.5" />
            Swap
          </Button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {state.mode === 'encode' ? 'Raw Text Input' : 'Encoded URL Input'}
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive cursor-pointer"
                onClick={() => setInput('')}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
            <Textarea
              placeholder={
                state.mode === 'encode'
                  ? 'Enter text with spaces, symbols, & emoji to encode...'
                  : 'Enter %20encoded%20URL%20string%20to%20decode...'
              }
              value={state.input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] font-mono text-xs resize-y"
            />
          </div>

          <div className="flex justify-center -my-1 relative z-10 pointer-events-none">
            <div className="bg-muted border border-border/50 rounded-full p-2 text-muted-foreground shadow-sm">
              <ArrowDownUp className="h-4 w-4" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {state.mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
              </label>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 text-[10px] gap-1 cursor-pointer"
                onClick={handleCopy}
                disabled={!state.output || state.output.startsWith('Error')}
              >
                {state.copied ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {state.copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <Textarea
              readOnly
              value={state.output}
              className={`min-h-[150px] font-mono text-xs resize-y bg-muted/30 ${
                state.output.startsWith('Error') ? 'text-destructive' : ''
              }`}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
