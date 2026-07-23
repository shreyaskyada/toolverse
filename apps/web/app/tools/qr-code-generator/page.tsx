import { Metadata } from 'next';
import { QRCodeGeneratorTool } from '@/modules/tools/qr-code-generator/QRCodeGeneratorTool';
import { TOOL_METADATA } from '@repo/engines/qr-code-generator';

export const metadata: Metadata = {
  title: `${TOOL_METADATA.title} Online - Free & Instant | Jumpytools`,
  description: TOOL_METADATA.description,
};

export default function Page() {
  return <QRCodeGeneratorTool />;
}
