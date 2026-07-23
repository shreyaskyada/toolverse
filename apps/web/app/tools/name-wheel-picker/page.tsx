import { Metadata } from 'next';
import { NameWheelPickerTool } from '@/modules/tools/name-wheel-picker/NameWheelPickerTool';
import { TOOL_METADATA } from '@repo/engines/name-wheel-picker';

export const metadata: Metadata = {
  title: `${TOOL_METADATA.title} Online - Free & Instant | Jumpytools`,
  description: TOOL_METADATA.description,
};

export default function Page() {
  return <NameWheelPickerTool />;
}
