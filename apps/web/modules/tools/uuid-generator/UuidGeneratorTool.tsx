'use client';

import React, { useState, useEffect } from 'react';
import { useUuidGenerator } from '@repo/engines/uuid-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Clipboard, Trash2, Settings, Zap, ChevronDown, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TOOL_METADATA, TOOL_FAQS, TOOL_ABOUT } from '@repo/engines/uuid-generator';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function UuidGeneratorTool() {
  const {
    state,
    setVersion,
    setQuantity,
    setUppercase,
    setHyphens,
    generate,
    clear,
  } = useUuidGenerator();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Generate on mount
  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopySingle = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (state.uuids.length === 0) {
      toast.error('No UUIDs to copy.');
      return;
    }
    navigator.clipboard.writeText(state.uuids.join('\n'));
    setCopiedAll(true);
    toast.success('Copied all identifiers!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Configuration Column (Left 1/3 inside Card) */}
        <div className="lg:col-span-1 border border-border bg-card rounded-xl p-5 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sliders className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Configuration</h2>
          </div>

          {/* UUID version selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Settings className="h-3.5 w-3.5" />
              UUID Version
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left">
                <span className="truncate mr-2 font-medium">
                  {state.options.version === '4' ? 'Version 4 (Random)' : 'Version 1 (Time-based)'}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[200px]">
                <DropdownMenuItem onClick={() => setVersion('4')}>
                  Version 4 (Random)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVersion('1')}>
                  Version 1 (Time-based)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quantity Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quantity (1-100)
            </label>
            <Input
              id="quantity-input"
              type="number"
              min={1}
              max={100}
              value={state.options.quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="h-9.5 focus-visible:ring-primary shadow-sm"
            />
          </div>

          {/* Formatting switches */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Formatting Options
            </span>

            {/* Uppercase toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all select-none group">
              <div className="flex flex-col gap-0.5 max-w-[80%]">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Uppercase</span>
                <span className="text-[11px] text-muted-foreground leading-snug">Capitalize hex letters (A-F)</span>
              </div>
              <input
                type="checkbox"
                checked={state.options.uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
              />
            </label>

            {/* Hyphens toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all select-none group">
              <div className="flex flex-col gap-0.5 max-w-[80%]">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Hyphens</span>
                <span className="text-[11px] text-muted-foreground leading-snug">Include standard dash dividers</span>
              </div>
              <input
                type="checkbox"
                checked={state.options.hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
              />
            </label>
          </div>

          {/* Generate Trigger */}
          <Button onClick={generate} size="lg" className="w-full cursor-pointer mt-2 font-semibold shadow-md active:scale-98 transition-transform">
            <Zap className="mr-2 h-4 w-4 fill-current text-amber-400" />
            Generate UUIDs
          </Button>
        </div>

        {/* Output Column (Right 2/3 inside Card) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">Generated Identifiers</span>
              {state.uuids.length > 0 && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold">
                  {state.uuids.length} items
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyAll} disabled={state.uuids.length === 0} className="h-8 text-xs font-medium">
                {copiedAll ? <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" /> : <Clipboard className="mr-1.5 h-3.5 w-3.5" />}
                Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={clear} disabled={state.uuids.length === 0} className="h-8 text-xs font-medium text-destructive hover:bg-destructive/5">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>

          {/* List of UUIDs */}
          {state.uuids.length > 0 ? (
            <div className="border border-border rounded-xl bg-muted/5 divide-y divide-border overflow-hidden shadow-inner">
              <div className="max-h-[420px] overflow-y-auto font-mono text-xs leading-relaxed scrollbar-none">
                {state.uuids.map((uuid, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 group hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-4 truncate">
                      <span className="text-[11px] text-muted-foreground select-none font-sans font-semibold bg-muted px-1.5 py-0.5 rounded border border-border w-7 text-center">
                        {idx + 1}
                      </span>
                      <span className="select-all truncate text-foreground font-medium text-xs tracking-wide">
                        {uuid}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopySingle(uuid, idx)}
                      className="h-8 w-8 opacity-75 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0 ml-2"
                      title="Copy identifier"
                    >
                      {copiedIndex === idx ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clipboard className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border/80 rounded-xl py-24 flex flex-col items-center justify-center text-muted-foreground text-center bg-muted/5 px-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 animate-pulse">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">No UUIDs Generated Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Configure parameters in the left panel and click the generate button to create unique identifiers.
              </p>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
