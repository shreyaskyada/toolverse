import { Metadata } from 'next';
import { ColorConverterTool } from '@/modules/tools/color-converter/ColorConverterTool';
import { TOOL_METADATA } from '@repo/engines/color-converter';

export const metadata: Metadata = {
  title: `${TOOL_METADATA.title} Online - Free & Instant | Jumpytools`,
  description: TOOL_METADATA.description,
};

export default function Page() {
  return <ColorConverterTool />;
}
