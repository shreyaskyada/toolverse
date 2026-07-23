import { TimezoneConverterTool } from '@/modules/tools/timezone-converter/TimezoneConverterTool';

export const metadata = {
  title: 'Time Zone Converter - Jumpytools',
  description: 'Convert dates and times across multiple world time zones, calculate timezone offsets, and plan meetings.',
};

export default function TimezoneConverterPage() {
  return <TimezoneConverterTool />;
}
