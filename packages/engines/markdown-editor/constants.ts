export const SAMPLE_TEXT = `# Markdown Title

This is a fast, **split-screen** markdown editor with live HTML preview!

## Features
- Bold and *italic* text formatting
- Bullet lists and numbered lists
- Inline \`code\` blocks and fenced code snippets:
\`\`\`javascript
const greeting = "Hello, Jumpytools!";
console.log(greeting);
\`\`\`
- [Clickable links](https://jumpytools.dev)
- Tables and quotes

> "The best way to predict the future is to invent it." - Alan Kay

| Header 1 | Header 2 |
| -------- | -------- |
| Item A   | Item B   |
`;

export const TOOL_METADATA = {
  title: 'Markdown Editor & Previewer',
  description: 'A fast, split-screen markdown editor with live HTML preview. Supports GitHub-flavored markdown, tables, and code blocks.',
  slug: 'markdown-editor',
  category: 'text-content',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Markdown Editor & Previewer is a document design utility that compiles standard Markdown into clean HTML client-side.',
  'It splits the workspace into a raw text editor on the left and a live HTML visual representation on the right, synchronized in real-time.',
  'Excellent for writing documentation, drafting blog posts, formatting README files, or converting rich markdown documents to code formats.',
];

export const TOOL_FAQS = [
  {
    question: 'Does this editor support GitHub Flavored Markdown (GFM)?',
    answer: 'Yes! The compiler supports standard GitHub Flavored Markdown additions, including tables, task lists, blockquotes, and fenced code blocks.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. The compilation is performed entirely inside your browser sandbox. None of your document text or private notes are ever transmitted to any external servers.',
  },
];
