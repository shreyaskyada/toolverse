import { CaseConverterTool } from '@/modules/tools/case-converter/CaseConverterTool';

export const metadata = {
  title: 'Case Converter - Toolverse',
  description: 'Instantly convert text cases between upper, lower, title, sentence, camel, pascal, snake, or kebab formats.',
};

export default function CaseConverterPage() {
  return <CaseConverterTool />;
}
