'use client';

import React from 'react';
import {
  useCaseConverter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toAlternatingCase,
  toInverseCase,
  collapseSpaces,
  removeEmptyLines,
  removeDuplicateLines,
  stripHtml,
} from '@repo/engines/case-converter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Copy,
  Trash2,
  Sparkles,
  Layers,
  RefreshCw,
  Type,
  Heading,
  Indent,
  Code,
  Eraser,
  AlignLeft,
  ChevronsUpDown,
  ClipboardPaste,
} from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function CaseConverterTool() {
  const {
    state,
    stats,
    setText,
    handleClear,
    handleLoadSample,
    applyTransform,
  } = useCaseConverter();

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

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast.success('Text pasted from clipboard');
    } catch {
      toast.error('Failed to read clipboard. Please paste manually.');
    }
  };

  const executeTransform = (fn: (str: string) => string, label: string) => {
    if (!state.text) {
      toast.warning('Please enter some text first!');
      return;
    }
    applyTransform(fn);
    toast.success(`Converted to ${label}`);
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
              <label htmlFor="case-converter-textarea" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
                  onClick={handleClearWithToast}
                  className="h-8 text-xs cursor-pointer text-destructive hover:bg-destructive/5 gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>

            <Textarea
              id="case-converter-textarea"
              value={state.text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type, paste, or load sample text to convert between upper, lower, title, sentence, camel, pascal, snake, or kebab case formats..."
              className="flex-grow min-h-[300px] font-sans text-sm focus-visible:ring-primary leading-relaxed resize-y"
            />
          </div>

          {/* Stats Cards Column */}
          <div className="flex flex-col gap-3 lg:col-span-1">
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardContent className="p-3 flex items-center gap-2.5 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Type className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Chars (With Spaces)
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
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Chars (No Spaces)
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {stats.charCountWithoutSpaces}
                  </h3>
                </div>
              </CardContent>
            </Card>

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
                  <AlignLeft className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Lines
                  </p>
                  <h3 className="text-lg font-bold text-foreground font-mono leading-none mt-0.5">
                    {stats.lineCount}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Case Conversions */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-semibold flex items-center S text-foreground">
                <Type className="h-4 w-4 text-primary" />
                Case Conversions
              </h3>
            </div>
            <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toUpperCase, 'UPPERCASE')}
              >
                <Heading className="h-3.5 w-3.5 text-muted-foreground" />
                UPPERCASE
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toLowerCase, 'lowercase')}
              >
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                lowercase
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toTitleCase, 'Title Case')}
              >
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                Title Case
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toSentenceCase, 'Sentence case')}
              >
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                Sentence case
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toCamelCase, 'camelCase')}
              >
                <Indent className="h-3.5 w-3.5 text-muted-foreground" />
                camelCase
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toPascalCase, 'PascalCase')}
              >
                <Indent className="h-3.5 w-3.5 text-muted-foreground" />
                PascalCase
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toSnakeCase, 'snake_case')}
              >
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                snake_case
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toKebabCase, 'kebab-case')}
              >
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                kebab-case
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
                onClick={() => executeTransform(toAlternatingCase, 'Alternating Case')}
              >
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                aLtErNaTiNg
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium col-span-2 sm:col-span-1"
                onClick={() => executeTransform(toInverseCase, 'Inverse Case')}
              >
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                InVeRsE CaSe
              </Button>
            </CardContent>
          </Card>

          {/* Text Cleanups */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Eraser className="h-4 w-4 text-primary" />
                Text Cleanups
              </h3>
            </div>
            <CardContent className="p-5 flex flex-col gap-2">
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
                onClick={() => executeTransform(collapseSpaces, 'Collapsed Spaces')}
              >
                <Indent className="h-3.5 w-3.5 text-muted-foreground" />
                Collapse Extra White Spaces
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
                onClick={() => executeTransform(removeEmptyLines, 'Removed Empty Lines')}
              >
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                Remove Empty/Blank Lines
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
                onClick={() => executeTransform(removeDuplicateLines, 'Removed Duplicate Lines')}
              >
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Remove Duplicate Lines
              </Button>
              <Button
                variant="outline"
                className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
                onClick={() => executeTransform(stripHtml, 'Stripped HTML Tags')}
              >
                <Code className="h-3.5 w-3.5 text-muted-foreground" />
                Strip HTML Tags
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
