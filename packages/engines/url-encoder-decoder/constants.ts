export const TOOL_METADATA = {
  title: 'URL Encoder / Decoder',
  description: 'Encode or decode strings to make them URL-safe. Instantly translates special characters, spaces, and emojis according to RFC 3986.',
  slug: 'url-encoder-decoder',
  category: 'developer-tools',
  fullWidth: false,
};

export const TOOL_ABOUT = [
  'URL Encoding (also known as Percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI) under certain circumstances.',
  'This utility converts special characters and spaces into their percent-encoded representations (like %20 for space) to ensure they are transmitted safely across the web.',
  'It also works in reverse to decode standard encoded strings back to human-readable text.',
];

export const TOOL_FAQS = [
  {
    question: 'What is URL Encoding?',
    answer: 'URL encoding converts characters into a format that can be transmitted over the Internet. URLs can only be sent over the Internet using the ASCII character-set.',
  },
  {
    question: 'How does URL decoding work?',
    answer: 'URL decoding replaces % hexadecimal sequences (like %20) back with their corresponding ASCII characters (like spaces).',
  },
];
