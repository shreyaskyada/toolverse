export const SAMPLE_TEXT = `hello world! THIS IS A TEST OF THE CASE CONVERTER UTILITY.
it can automatically convert sentence casing, remove <b>HTML tags</b>, clean up extra    spaces,
and also filter out duplicate lines if needed.

hello world!
this is another line.`;

export const TOOL_METADATA = {
  title: 'Case Converter',
  description: 'Instantly convert text cases between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, PascalCase, and execute document cleanups.',
  slug: 'case-converter',
  category: 'developer-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Case Converter is a convenient client-side utility for developers, content creators, and copywriters to transform and sanitize body text.',
  'It provides one-click transformations for text casing conventions, including standard formats (upper, lower, title, sentence) as well as programming layout conventions (camelCase, PascalCase, snake_case, kebab-case).',
  'It also features a sanitization panel supporting white-space collapsing, blank-line removal, HTML tag stripping, and duplicates line deduplication.',
];

export const TOOL_FAQS = [
  {
    question: 'What case conversions are supported?',
    answer: 'The tool supports conversions to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, PascalCase, kebab-case, alternating cAsE, and inverse/swapped Case.',
  },
  {
    question: 'How does Sentence case format my text?',
    answer: 'It splits your text into sentences based on punctuation (periods, question marks, exclamation marks), capitalizes the first word of each sentence, and forces the rest of the sentence to lowercase.',
  },
  {
    question: 'What are the cleanup features?',
    answer: 'We support: Removing extra white spaces (collapsing multiple spaces to one), stripping HTML tags entirely, deleting empty lines, and removing duplicate lines in the document.',
  },
];
