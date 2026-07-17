import React from 'react';
import { MarkdownEditorTool } from '@/modules/tools/markdown-editor/MarkdownEditorTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markdown Editor & Previewer | Toolverse',
  description: 'A fast, split-screen markdown editor with live HTML preview. Supports GitHub-flavored markdown, tables, and code blocks.',
};

export default function MarkdownEditorPage() {
  return <MarkdownEditorTool />;
}
