export const DEFAULT_QUANTITY = 5;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 100;

export const TOOL_METADATA = {
  title: 'UUID / GUID Generator',
  description: 'Generate unique UUID (v4 and v1) strings instantly. Configure count, casing, and hyphens with local browser execution.',
  slug: 'uuid-generator',
  category: 'developer-tools',
};

export const TOOL_FAQS = [
  {
    question: 'What is a UUID?',
    answer: 'A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems without significant central coordination.',
  },
  {
    question: 'What is the difference between UUID v1 and v4?',
    answer: 'UUID v1 is generated using the host computer\'s MAC address and a timestamp, making it time-based. UUID v4 is generated using random numbers, making it highly random and more private as it doesn\'t expose physical machine details.',
  },
  {
    question: 'Are these UUIDs safe to use in database keys?',
    answer: 'Yes. The chance of a collision (generating duplicate UUIDs) is virtually zero, making them excellent choices for database keys, transaction IDs, and identifiers.',
  },
];

export const TOOL_ABOUT = [
  'A Universally Unique Identifier (UUID) is a standard identifier format that guarantees uniqueness across space and time. A UUID is written as a sequence of hexadecimal digits divided into 5 groups separated by hyphens (e.g. 8-4-4-4-12 characters for a total of 36 characters).',
  'Types of UUIDs:',
  '• Version 4 (Random): Generated using random numbers. This is the most common version and does not leak timestamps or machine identifiers.',
  '• Version 1 (Time-based): Generated using a timestamp and computer identifier. Useful when sorting or ordering by creation time is desired.',
  'Our generator performs all operations client-side in your browser. No identifiers are sent or stored anywhere.',
];
