export const TARGET_FORMATS = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
  { value: 'image/bmp', label: 'BMP', ext: 'bmp' },
];

export const TOOL_METADATA = {
  title: 'Image Converter',
  description: 'Convert images between JPEG, PNG, WebP, AVIF, GIF, BMP, and ICO formats client-side instantly with a live before-and-after preview.',
  slug: 'image-converter',
  category: 'image-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Image Converter is a clean client-side utility that transcodes image file types directly within the web sandbox.',
  'It loads images into active canvas structures and encodes them into targeted formats (JPEG, PNG, WebP, BMP) in real-time.',
  'Excellent for generating transparent WebP images from PNG files, changing screenshots to lightweight JPEG files, or converting files to legacy format specs.',
];

export const TOOL_FAQS = [
  {
    question: 'How does client-side format conversion work?',
    answer: 'It renders source image assets onto a canvas element and extracts the graphic context as a blob encoding of the target format (e.g. image/webp). This allows converting formats completely client-side in the browser.',
  },
  {
    question: 'Can I convert transparent images to JPEG?',
    answer: 'Yes! However, because JPEG does not support transparency (alpha channels), any transparent regions in the original image will be filled with a solid background color (defaulting to white).',
  },
];
