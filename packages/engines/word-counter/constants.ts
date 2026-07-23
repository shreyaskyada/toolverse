export const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are',
  'was', 'were', 'it', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'they', 'we', 'me',
  'him', 'her', 'them', 'us', 'my', 'your', 'his', 'their', 'our', 'be', 'been', 'have', 'has', 'had',
  'do', 'does', 'did', 'as', 'if', 'than', 'then', 'so', 'up', 'down', 'out', 'about', 'into', 'through',
  'over', 'after', 'before', 'no', 'not', 'only', 'other', 'some', 'such', 'too', 'very', 'can'
]);

export const SAMPLE_TEXT = `Jumpytools is an all-in-one developer and content analysis toolkit built for maximum speed and simplicity. It features multiple utilities that run entirely inside your browser, guaranteeing absolute data privacy.

When you analyze your documents here, your text is never uploaded to external servers. This makes it safe to count characters, inspect JSON payloads, generate UUID keys, or decode keys locally. Try typing your paragraphs here to analyze content readability!`;

export const TOOL_METADATA = {
  title: 'Word Counter',
  description: 'Analyze and count words, characters, sentences, paragraphs, reading and speaking time, and check word frequencies in real-time.',
  slug: 'word-counter',
  category: 'developer-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Word Counter is a client-side text analysis utility designed for content writers, editors, and developers who need to measure document length, complexity, and keyword density.',
  'It calculates core document stats (words, characters, sentences, paragraphs) in real-time as you type, alongside reading and speaking speed estimates.',
  'The Word Density keyword analyzer extracts primary semantic keywords, letting you toggle off standard English "stop words" to isolate critical topic terms.',
];

export const TOOL_FAQS = [
  {
    question: 'How is the word count calculated?',
    answer: 'The tool splits the input text by whitespaces, tabs, and line breaks, filtering out empty entries. This gives an accurate representation of standard word boundaries.',
  },
  {
    question: 'Does it count special characters and symbols as words?',
    answer: 'No, standalone special characters and punctuation marks are excluded from the word count, though they are counted under the total character metrics.',
  },
  {
    question: 'How are the reading and speaking times estimated?',
    answer: 'Reading time is calculated using an average reading speed of 200 words per minute (WPM). Speaking time is computed using a standard conversational speaking pace of 130 words per minute.',
  },
];
