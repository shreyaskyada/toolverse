import { WordCounterTool } from '@/modules/tools/word-counter/WordCounterTool';

export const metadata = {
  title: 'Word Counter - Toolverse',
  description: 'Analyze and count words, characters, sentences, paragraphs in real-time.',
};

export default function WordCounterPage() {
  return <WordCounterTool />;
}
