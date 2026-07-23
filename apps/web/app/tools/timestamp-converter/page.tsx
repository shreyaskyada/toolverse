import { TimestampConverterTool } from '@/modules/tools/timestamp-converter/TimestampConverterTool';

export const metadata = {
  title: 'Timestamp Converter - Jumpytools',
  description: 'Convert Unix timestamps to human-readable dates and vice versa instantly.',
};

export default function TimestampConverterPage() {
  return <TimestampConverterTool />;
}
