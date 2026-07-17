export const TOOL_METADATA = {
  title: 'Random Number Generator',
  description: 'Generate truly random numbers or sequences instantly. Customize ranges, length, and formatting.',
  slug: 'number-randomizer',
  category: 'text-content',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Random Number Generator is an interactive math and utility helper designed to generate random numbers and sequences client-side.',
  'It supports custom min/max ranges, count of numbers, duplicate number filtering, delimiters, and sorting arrangements.',
  'Excellent for developers testing APIs, statistics sampling, classrooms selecting student indices, or random sweepstakes draws.',
];

export const TOOL_FAQS = [
  {
    question: 'How random are the numbers generated?',
    answer: 'The numbers are generated using the browser\'s built-in Math.random() engine, which provides a highly pseudo-random distribution perfect for standard utility applications, styling layouts, and general picks.',
  },
  {
    question: 'What happens if the range is smaller than the count and duplicates are disabled?',
    answer: 'If you request more unique numbers than the available range can support (e.g. asking for 10 unique numbers between 1 and 5), the generator will limit the count to the maximum possible unique values in that range.',
  },
];
