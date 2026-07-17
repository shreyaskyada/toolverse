export const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog.
This is another line of text!`;

export const TOOL_METADATA = {
  title: 'Text Reverser',
  description: 'Reverse text in multiple ways: flip upside down, reverse words, sentences, or individual characters.',
  slug: 'text-reverser',
  category: 'text-content',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Text Reverser is a lighthearted yet practical text utility for formatting text backwards, flipping sentence order, or generating upside-down text blocks.',
  'It runs client-side inside your browser, converting strings instantaneously using four different inversion paradigms.',
  'Great for preparing social media copy, hiding spoilers, generating upside-down passwords, or testing parser edge cases.',
];

export const TOOL_FAQS = [
  {
    question: 'How does the Upside Down text flip work?',
    answer: 'It uses a character translation map to replace each character with its nearest inverted Unicode counterpart (e.g. "a" becomes "ɐ"). Note that some characters might not have an exact matching upside-down form, so a close visual substitute is used.',
  },
  {
    question: 'What is the difference between reversing characters and reversing words?',
    answer: '"By Characters" completely flips the entire string backward (e.g. "abc" to "cba"). "By Words" reverses the ordering of words while keeping the characters in each word forward (e.g. "hello world" to "world hello").',
  },
];
