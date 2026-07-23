import { Base64ImageConverterTool } from '@/modules/tools/base64-image-converter/Base64ImageConverterTool';

export const metadata = {
  title: 'Base64 Image Converter - Jumpytools',
  description: 'Convert images and videos to Base64 strings, or decode Base64 data URLs back to viewable media instantly.',
};

export default function Base64ImageConverterPage() {
  return <Base64ImageConverterTool />;
}
