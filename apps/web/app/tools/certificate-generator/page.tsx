import { Metadata } from 'next';
import { CertificateGeneratorTool } from '@/modules/tools/certificate-generator/CertificateGeneratorTool';
import { TOOL_METADATA } from '@repo/engines/certificate-generator';

export const metadata: Metadata = {
  title: `${TOOL_METADATA.title} Online - Free & Instant | Toolverse`,
  description: TOOL_METADATA.description,
};

export default function Page() {
  return <CertificateGeneratorTool />;
}
