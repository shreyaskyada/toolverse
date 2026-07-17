export const SAMPLE_TEXT = `Apple
Banana
Cherry
Date
Elderberry
Fig
Grape`;

export const TOOL_METADATA = {
  title: 'List Randomizer',
  description: 'Shuffle and randomize lists instantly. Great for generating random selections or unbiased ordering.',
  slug: 'list-randomizer',
  category: 'text-content',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'List Randomizer is an interactive list shuffling helper that randomizes list structures client-side.',
  'It supports custom parsing based on delimiters (newlines, commas, semicolons) and applies a cryptographically secure shuffle to avoid order bias.',
  'Excellent for picking names, formatting classroom lists, shuffling giveaway contestants, or re-ordering data rows.',
];

export const TOOL_FAQS = [
  {
    question: 'How are the lists shuffled?',
    answer: 'The list is randomized using the Fisher-Yates shuffle algorithm. This ensures that every permutation of the list is equally likely, providing a fully unbiased randomization.',
  },
  {
    question: 'What delimiters are supported?',
    answer: 'You can split and rejoin lists using Newlines (one item per line), Commas (comma-separated list), or Semicolons.',
  },
];
