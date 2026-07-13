'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useJsonFormatter } from '@repo/engines/json-formatter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clipboard, Trash2, RefreshCw, FileJson, FileWarning, ChevronDown, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JSONTree } from './components/JSONTree';
import Container from '@/components/layout/Container';
import Link from 'next/link';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { tools } from '@/config/tools';

export function JsonFormatterTool() {
  const { state, setInput, setSpaces, format, minify, validate, clear } = useJsonFormatter();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sampleJson = {
    name: "AllYourTools",
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

  const relatedTools = tools
    .filter((t) => t.category === 'developer-tools' && t.slug !== 'json-formatter')
    .slice(0, 3);

  return (
    <Container className="py-10 flex-1">
      {/* Hero Header */}
      <div className="mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Developer Tools
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          JSON Formatter
        </h1>
        <p className="mt-2 text-muted-foreground text-base md:text-lg max-w-2xl">
          Format and validate JSON instantly.
        </p>
      </div>

      <hr className="border-border mb-8" />

      {/* Tool Area */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-12">
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
              <Button variant="outline" size="sm" onClick={clear} className="text-destructive hover:bg-destructive/5">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
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
                  {state.error && (
                    <span className="flex items-center gap-1 text-xs text-destructive font-medium bg-destructive/5 border border-destructive/25 px-2 py-0.5 rounded-full">
                      <FileWarning className="h-3 w-3 animate-pulse" />
                      Invalid
                    </span>
                  )}
                  {!state.error && state.input.trim() && (
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
                placeholder="Paste or type raw JSON here..."
                className="min-h-[400px] font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner"
              />
            </div>

            {/* Output Panel with tab views */}
            <div className="flex flex-col gap-2.5">
              <Tabs defaultValue="preview" className="w-full flex flex-col h-full">
                <div className="flex items-center justify-between mb-0.5">
                  <TabsList className="grid w-auto grid-cols-3 h-9">
                    <TabsTrigger value="preview" className="text-xs px-3">Prettified</TabsTrigger>
                    <TabsTrigger value="tree" className="text-xs px-3">Tree Explorer</TabsTrigger>
                    <TabsTrigger value="text" className="text-xs px-3">Raw Text</TabsTrigger>
                  </TabsList>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8 rounded-lg"
                    title="Copy output"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Syntax Highlighted HTML view */}
                <TabsContent value="preview" className="flex-1 mt-0">
                  <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
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
                  <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[400px] max-h-[500px] overflow-y-auto select-none">
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
                    readOnly
                    value={state.output}
                    placeholder="Raw text output will appear here..."
                    className="min-h-[400px] font-mono text-xs leading-relaxed border border-border bg-muted/20"
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
      </div>

      {/* About Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          About JSON Formatter
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          JSON (JavaScript Object Notation) is a lightweight, text-based data-interchange
          format. It is easy for humans to read and write and easy for machines to parse and
          generate. However, raw JSON generated by APIs is often minified into a single line,
          making it hard to inspect.
        </p>
        <p className="text-foreground text-sm font-semibold mb-3">Features of this Formatter:</p>
        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1.5 mb-4">
          <li>Format minified JSON to make it human-readable.</li>
          <li>Minify formatted JSON to compress space for API requests.</li>
          <li>Validate JSON strings to ensure correctness of keys, quotes, and commas.</li>
          <li>One-click copy to clipboard.</li>
        </ul>
        <p className="text-muted-foreground text-xs">
          Ensure your JSON conforms to standard specifications: string keys must be surrounded by double
          quotes, and trailing commas are not allowed.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion>
          <AccordionItem value="security">
            <AccordionTrigger>Is my JSON data secure on this website?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Yes — all processing happens entirely in your browser. Your data never leaves your device
                and is not sent to any server.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="indentation">
            <AccordionTrigger>How do I format JSON with custom indentation?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Use the &quot;Spaces&quot; dropdown in the toolbar to select your preferred indentation
                level (2, 4, or 8 spaces), then click &quot;Format&quot;.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="invalid">
            <AccordionTrigger>Can this tool handle invalid JSON?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                The formatter will detect invalid JSON and show a descriptive error message below the
                input area. The Format and Minify buttons are disabled until the input is valid.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Related Utilities */}
      {relatedTools.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Related Utilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col justify-between bg-card border border-border hover:border-primary/50 rounded-2xl p-5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
