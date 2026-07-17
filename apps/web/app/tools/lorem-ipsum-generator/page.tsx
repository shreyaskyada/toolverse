import { LoremIpsumGeneratorTool } from '@/modules/tools/lorem-ipsum-generator/LoremIpsumGeneratorTool';

export const metadata = {
  title: 'Lorem Ipsum Generator - Toolverse',
  description: 'Generate placeholder text for your designs and documents instantly.',
};

export default function LoremIpsumGeneratorPage() {
  return <LoremIpsumGeneratorTool />;
}
