import { Metadata } from 'next';
import { AgeCalculatorTool } from '@/modules/tools/age-calculator/AgeCalculatorTool';
import { TOOL_METADATA } from '@repo/engines/age-calculator';

export const metadata: Metadata = {
  title: `${TOOL_METADATA.title} Online - Free & Instant | Jumpytools`,
  description: TOOL_METADATA.description,
};

export default function Page() {
  return <AgeCalculatorTool />;
}
