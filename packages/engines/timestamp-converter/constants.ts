export const TOOL_METADATA = {
  title: 'Timestamp Converter',
  description: 'Convert Unix timestamps to human-readable dates and vice versa instantly. Supports seconds, milliseconds, timezone offsets, and relative time calculation.',
  slug: 'timestamp-converter',
  category: 'developer-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Unix time (also known as Epoch time) is a system for describing a point in time. It is the number of seconds that have elapsed since the Unix epoch, minus leap seconds, which started on January 1st, 1970 UTC.',
  'This tool provides bidirectional conversion between raw integer timestamps (seconds or milliseconds) and human-friendly calendar representations in both your local timezone and UTC.',
  'It also includes a ticking real-time Unix clock for quick copying of current timestamps.',
];

export const TOOL_FAQS = [
  {
    question: 'What is a Unix timestamp?',
    answer: 'A Unix timestamp is a way to track time as a running total of seconds. The count starts at the Unix Epoch on January 1st, 1970. Standard timestamps are 10 digits (seconds), while javascript/high-resolution timestamps are 13 digits (milliseconds).',
  },
  {
    question: 'How does the auto-detect unit option work?',
    answer: 'The auto-detect option checks the length of the numeric string. If the string is 12 or more digits, it is parsed as milliseconds. Otherwise, it is parsed as seconds.',
  },
];
