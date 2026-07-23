export const TOOL_METADATA = {
  title: 'Image Compressor',
  description: 'Reduce image file size by customizing quality, scaling dimensions, and converting formats client-side instantly.',
  slug: 'image-compressor',
  category: 'image-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Image Compressor is a client-side optimization utility that compresses high-resolution photographs directly in your browser.',
  'It converts and resizes files (JPEG, PNG, WebP) using HTML5 canvas context layers to trim overhead bytes.',
  'Excellent for developers optimizing website assets, content managers keeping load times minimal, or saving storage space before storing attachments.',
];

export const TOOL_FAQS = [
  {
    question: 'How does client-side compression work?',
    answer: 'It loads your image onto an HTML5 canvas and draws it using a custom resolution. When exporting, it uses the browser\'s native compression quality parameters (e.g., canvas.toBlob) to generate a much smaller file.',
  },
  {
    question: 'Are my images uploaded to any server?',
    answer: 'No. All processing, scaling, and file compression happens entirely inside your browser. No files are ever sent to external cloud APIs or servers.',
  },
];
