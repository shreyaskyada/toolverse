'use client';

import React from 'react';
import {
  useMarkdownEditor,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/markdown-editor';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Copy, ClipboardPaste, Code, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function MarkdownEditorTool() {
  const {
    state,
    setMarkdown,
    handleClear,
    handleLoadSample,
  } = useMarkdownEditor();

  const handleCopyMarkdown = async () => {
    if (!state.markdown) return;
    try {
      await navigator.clipboard.writeText(state.markdown);
      toast.success('Copied Markdown source to clipboard!');
    } catch {
      toast.error('Failed to copy Markdown.');
    }
  };

  const handleCopyHtml = async () => {
    if (!state.html) return;
    try {
      await navigator.clipboard.writeText(state.html);
      toast.success('Copied compiled HTML to clipboard!');
    } catch {
      toast.error('Failed to copy HTML.');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMarkdown(text);
      toast.success('Pasted markdown from clipboard!');
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
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              disabled={!state.markdown}
              className="gap-1.5 h-8 cursor-pointer text-xs"
            >
              <FileText className="h-3.5 w-3.5" />
              Copy Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHtml}
              disabled={!state.html}
              className="gap-1.5 h-8 cursor-pointer text-xs"
            >
              <Code className="h-3.5 w-3.5" />
              Copy HTML
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleLoadSample} className="h-8 text-xs cursor-pointer">
              Load Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} className="gap-1.5 h-8 cursor-pointer text-xs text-destructive hover:bg-destructive/5 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Editor & Previewer Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Markdown Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Markdown Editor
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
              placeholder="Write or paste your markdown here... Use headers, bold text, links, lists, or tables."
              value={state.markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full min-h-[350px] p-4 font-mono text-sm border border-border rounded-lg bg-transparent focus-visible:ring-primary focus-visible:ring-1 resize-y leading-relaxed"
            />
          </div>

          {/* Live Preview */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center h-7">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Live Preview
              </label>
            </div>
            <div
              className="w-full min-h-[350px] max-h-[600px] overflow-y-auto p-4 border border-border rounded-lg bg-muted/5 custom-scrollbar prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: state.html || '<p class="text-muted-foreground italic">Live html preview will appear here...</p>' }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
export default MarkdownEditorTool;
