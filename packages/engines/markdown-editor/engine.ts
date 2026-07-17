import { marked } from 'marked';

export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  try {
    return marked.parse(markdown) as string;
  } catch (err) {
    return `<p class="text-destructive font-mono">Error compiling Markdown: ${(err as Error).message}</p>`;
  }
}
