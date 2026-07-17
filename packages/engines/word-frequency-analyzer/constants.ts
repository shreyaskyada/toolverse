export const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are',
  'was', 'were', 'it', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'they', 'we', 'me',
  'him', 'her', 'them', 'us', 'my', 'your', 'his', 'their', 'our', 'be', 'been', 'have', 'has', 'had',
  'do', 'does', 'did', 'as', 'if', 'than', 'then', 'so', 'up', 'down', 'out', 'about', 'into', 'through',
  'over', 'after', 'before', 'no', 'not', 'only', 'other', 'some', 'such', 'too', 'very', 'can'
]);

export const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. The lazy dog was sleeping under the quick brown fox. This is a simple sample text for the Word Frequency Analyzer utility. Make sure to try out keyword density and duplicate word counting!`;

export const TOOL_METADATA = {
  title: 'Word Frequency Analyzer',
  description: 'Analyze text for keyword density, word frequencies, and find duplicate words instantly.',
  slug: 'word-frequency-analyzer',
  category: 'text-content',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Word Frequency Analyzer is a professional text analytics utility designed to inspect keyword usage, count unique vocabulary terms, and measure keyword density.',
  'It parses input documents client-side, extracts word frequencies, and calculates the exact percentage representation of each term.',
  'You can optionally filter out standard English "stop words" to isolate key semantic subject terms and identify duplicate words.',
];

export const TOOL_FAQS = [
  {
    question: 'What are stop words?',
    answer: 'Stop words are common English words (such as "the", "is", "and", "to") that carry little semantic meaning. Excluding them helps isolate the main topic keywords in your text.',
  },
  {
    question: 'How is density calculated?',
    answer: 'Density is computed as the percentage of a word\'s count relative to the total number of words in the analyzed text (excluding punctuation).',
  },
];
