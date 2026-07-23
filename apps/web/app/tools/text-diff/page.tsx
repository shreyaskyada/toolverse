import { TextDiffTool } from '@/modules/tools/text-diff/TextDiffTool';

export const metadata = {
  title: 'Text Diff - Jumpytools',
  description: 'Find differences between two texts instantly.',
};

export default function TextDiffPage() {
  return <TextDiffTool />;
}
