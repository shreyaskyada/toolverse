export interface LoremIpsumGeneratorState {
  count: number;
  type: 'paragraphs' | 'sentences' | 'words';
  output: string;
  copied: boolean;
  startWithLorem: boolean;
}
