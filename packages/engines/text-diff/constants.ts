export const TOOL_METADATA = {
  title: 'Text Diff',
  description: 'Find differences between two texts instantly. Compare plain text or code to see exactly what changed with visual highlighting. 100% client-side.',
  slug: 'text-diff',
  category: 'developer-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Text Diff is an interactive client-side developer utility to compare two pieces of text, source code files, or markdown documentation.',
  'It uses the standard Myers diff algorithm to calculate insertion and deletion transformations at the Character, Word, or Line level.',
  'All calculations run entirely in your local browser environment, guaranteeing absolute data privacy for sensitive source code, key logs, or text documents.',
];

export const TOOL_FAQS = [
  {
    question: 'How does the Text Diff tool work?',
    answer: 'It uses an advanced text comparison algorithm (Myers diff algorithm) to analyze two pieces of text and find the exact differences. It then visually highlights what was added (in green) and what was removed (in red).',
  },
  {
    question: 'Can I compare code with this?',
    answer: "Yes! The tool has three comparison modes: Characters, Words, and Lines. For comparing source code, selecting 'Lines' mode is highly recommended as it will show you exactly which lines of code were added or removed.",
  },
  {
    question: 'Is my text sent to a server for analysis?',
    answer: 'No. The entire diff algorithm runs locally in your browser. Whether you are comparing sensitive source code, legal contracts, or personal notes, your data never leaves your device.',
  },
];
