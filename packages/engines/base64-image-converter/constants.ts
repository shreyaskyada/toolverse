import { MimeExtensionMap } from './types';

export const MIME_EXTENSIONS: Record<string, MimeExtensionMap> = {
  'image/png': { mime: 'image/png', ext: 'png' },
  'image/jpeg': { mime: 'image/jpeg', ext: 'jpg' },
  'image/webp': { mime: 'image/webp', ext: 'webp' },
  'image/gif': { mime: 'image/gif', ext: 'gif' },
  'image/bmp': { mime: 'image/bmp', ext: 'bmp' },
  'image/heic': { mime: 'image/heic', ext: 'heic' },
  'image/heif': { mime: 'image/heif', ext: 'heif' },
  'video/mp4': { mime: 'video/mp4', ext: 'mp4' },
  'video/webm': { mime: 'video/webm', ext: 'webm' },
  'video/ogg': { mime: 'video/ogg', ext: 'ogg' },
  'application/pdf': { mime: 'application/pdf', ext: 'pdf' },
  'application/octet-stream': { mime: 'application/octet-stream', ext: 'bin' },
};

export const TOOL_METADATA = {
  title: 'Base64 Image Converter',
  description: 'Convert images (PNG, JPG, WebP, GIF) and videos (MP4, WebM) to Base64 strings, or decode Base64 data back to viewable media and files instantly.',
  slug: 'base64-image-converter',
  category: 'developer-tools',
  fullWidth: true
};

export const TOOL_ABOUT = [
  'Base64 Image Converter is a client-side developer utility for converting image and video assets to and from text-encoded Base64 representations.',
  'Converting images and video files to Base64 creates a Data URI that can be embedded directly into source files (HTML, CSS, JSON). This technique loads media inline, removing the need for external server requests.',
  'The decoder accepts Data URLs containing standard metadata headers, as well as plain Base64 strings where it auto-detects standard mime formats (PNG, JPEG, GIF, WebP, BMP, MP4, WebM, PDF).',
];

export const TOOL_FAQS = [
  {
    question: 'What is Base64 Image Converter?',
    answer: 'It is a 2-in-1 media utility that allows you to: 1) Encode images and video clips to Base64 strings or Data URIs, and 2) Decode Base64 data blocks back to play/view them inside the browser and download them as files.',
  },
  {
    question: 'How does the format auto-detection work in the Decode tab?',
    answer: 'If you paste a Data URL (e.g. data:image/png;base64,...), the tool parses the format from the header. If you paste Plain Base64, the decoder reads the first few signature bytes (magic numbers) of the binary file stream to guess whether it is a PNG, JPEG, GIF, WebP, BMP, PDF, MP4, WebM, or OGG file.',
  },
  {
    question: 'What if the auto-detection fails for Plain Base64 data?',
    answer: 'You can use the "Select Decoded Format Override" dropdown to manually select the correct format (e.g. PNG, JPEG, MP4, WebM, etc.). This updates the preview and sets the correct extension for downloading.',
  },
  {
    question: 'Are there file size guidelines for browser processing?',
    answer: 'All processing happens 100% offline inside your browser. We recommend uploading files under 10MB for images and under 30MB for video clips to ensure fast response times and prevent browser tab freezes.',
  },
];
