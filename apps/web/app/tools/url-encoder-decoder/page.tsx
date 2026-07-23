import { UrlEncoderDecoderTool } from '@/modules/tools/url-encoder-decoder/UrlEncoderDecoderTool';

export const metadata = {
  title: 'URL Encoder / Decoder - Jumpytools',
  description: 'Encode or decode strings to make them URL-safe instantly.',
};

export default function UrlEncoderDecoderPage() {
  return <UrlEncoderDecoderTool />;
}
