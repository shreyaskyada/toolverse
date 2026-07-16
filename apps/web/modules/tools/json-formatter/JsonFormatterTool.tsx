'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useJsonFormatter } from '@repo/engines/json-formatter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clipboard, Trash2, RefreshCw, FileJson, FileWarning, ChevronDown, Sparkles, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JSONTree } from './components/JSONTree';
import { TOOL_METADATA, TOOL_FAQS, TOOL_ABOUT, parseJsonError } from '@repo/engines/json-formatter';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function JsonFormatterTool() {
  const { state, setInput, setSpaces, format, minify, validate, clear } = useJsonFormatter();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sampleJson = {
    name: "Toolverse",
    version: "1.0.0",
    description: "Multi-tool web app suite",
    features: ["offline processing", "client-side validation", "responsive UI"],
    active: true,
    stats: {
      tools: 100,
      speed: "instant",
      private: true
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loadSample = () => {
    setInput(JSON.stringify(sampleJson, null, 2));
  };

  const handleCopy = () => {
    const textToCopy = state.output || state.input;
    if (!textToCopy.trim()) {
      toast.error("Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        toast.success("Pasted from clipboard!");
      } else {
        toast.error("Clipboard is empty.");
      }
    } catch {
      toast.error("Failed to read clipboard. Please paste manually.");
    }
  };

  const highlightJson = (jsonString: string) => {
    if (!jsonString) return "";
    const safeStr = jsonString
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return safeStr.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-amber-600 dark:text-amber-400";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-blue-600 dark:text-blue-400 font-semibold";
          } else {
            cls = "text-green-600 dark:text-green-400";
          }
        } else if (/true|false/.test(match)) {
          cls = "text-purple-600 dark:text-purple-400 font-medium";
        } else if (/null/.test(match)) {
          cls = "text-rose-500 font-medium";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const isCurrentlyValid = state.input.trim() !== '' && parseJsonError(state.input) === null;

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        {/* Top Configuration bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          {/* Indent Dropdown Menu */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Indent Size:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-28 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                {state.options.spaces === "tab" ? "Tab" : `${state.options.spaces} Spaces`}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-28">
                <DropdownMenuItem onClick={() => setSpaces(2)}>
                  2 Spaces
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSpaces(4)}>
                  4 Spaces
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSpaces("tab")}>
                  Tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Global actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              Load Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handlePaste}>
              Paste
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!state.output && !state.input}>
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" /> : <Clipboard className="mr-1.5 h-3.5 w-3.5" />}
              Copy Output
            </Button>
            <Button variant="outline" size="sm" onClick={clear} className="text-destructive hover:bg-destructive/5">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Editor columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel (Input editor) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                Raw JSON Input
              </label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handlePaste} className="h-8 text-xs gap-1">
                  <Clipboard className="h-3.5 w-3.5" />
                  Paste
                </Button>
                {state.input.trim() !== '' && !isCurrentlyValid && (
                  <span className="flex items-center gap-1 text-xs text-destructive font-medium bg-destructive/5 border border-destructive/25 px-2 py-0.5 rounded-full">
                    <FileWarning className="h-3 w-3 animate-pulse" />
                    Invalid
                  </span>
                )}
                {state.input.trim() !== '' && isCurrentlyValid && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-500/5 border border-green-500/25 px-2 py-0.5 rounded-full">
                    ✓ Valid
                  </span>
                )}
              </div>
            </div>
            <Textarea
              ref={inputRef}
              value={state.input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste raw, unformatted JSON here..."
              className="h-[500px] font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner resize-none"
            />
          </div>

          {/* Right panel (Output view tabs) */}
          <div className="flex flex-col gap-2">
            <Tabs defaultValue="preview" className="w-full flex flex-col flex-grow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <TabsList className="bg-muted/50 border border-border">
                  <TabsTrigger value="preview" className="text-xs font-semibold">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="tree" className="text-xs font-semibold">
                    Tree View
                  </TabsTrigger>
                  <TabsTrigger value="text" className="text-xs font-semibold">
                    Plain Text
                  </TabsTrigger>
                </TabsList>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                  title="Copy results"
                  disabled={!state.output}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>

              {/* Syntax Highlighted HTML view */}
              <TabsContent value="preview" className="flex-1 mt-0">
                <div key={state.output} className="border border-border rounded-md bg-muted/10 p-4 h-[500px] overflow-y-auto">
                  {state.output ? (
                    <pre
                      className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                      dangerouslySetInnerHTML={{ __html: highlightJson(state.output) }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-32 border border-dashed border-border/80 rounded-md">
                      Prettified JSON will appear here...
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Collapsible Tree Explorer */}
              <TabsContent value="tree" className="flex-1 mt-0">
                <div key={state.output ? 'has-data' : 'empty'} className="border border-border rounded-md bg-muted/10 p-4 h-[500px] overflow-y-auto select-none">
                  {state.parsedData ? (
                    <div className="p-1">
                      <JSONTree data={state.parsedData} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-32 border border-dashed border-border/80 rounded-md">
                      Tree nodes will appear here...
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Plain text area */}
              <TabsContent value="text" className="flex-1 mt-0">
                <Textarea
                  key={state.output}
                  readOnly
                  value={state.output}
                  placeholder="Raw text output will appear here..."
                  className="h-[500px] font-mono text-xs leading-relaxed border border-border bg-muted/20 resize-none"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Metrics Banner */}
        {state.stats && (
          <div className="flex flex-wrap gap-6 items-center rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Root Element: <strong className="text-foreground font-semibold">{state.stats.rootType}</strong></span>
            </div>
            <div>
              Size: <strong className="text-foreground font-semibold">{state.stats.size} Bytes</strong>
            </div>
            <div>
              Characters: <strong className="text-foreground font-semibold">{state.input.length}</strong>
            </div>
          </div>
        )}

        {/* Parsing Error alerts */}
        {state.error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed shadow-sm">
            <p className="font-semibold mb-1">JSON Syntax Error:</p>
            <p>{state.error}</p>
          </div>
        )}

        {/* Compression Action buttons */}
        <div className="flex flex-wrap gap-3 mt-2">
          <Button onClick={format} variant="default" className="flex-1 sm:flex-initial">
            <Sparkles className="mr-1.5 h-4 w-4" />
            Prettify JSON
          </Button>
          <Button onClick={minify} variant="secondary" className="flex-1 sm:flex-initial">
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Minify JSON
          </Button>
          <Button onClick={validate} variant="outline" className="flex-1 sm:flex-initial">
            <FileJson className="mr-1.5 h-4 w-4" />
            Validate JSON
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
