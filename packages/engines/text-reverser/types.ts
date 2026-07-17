export type ReverseMode = 'chars' | 'words' | 'sentences' | 'upsidedown';

export interface TextReverserState {
  text: string;
  mode: ReverseMode;
}
