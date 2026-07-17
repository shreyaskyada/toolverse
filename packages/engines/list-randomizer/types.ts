export type DelimiterType = 'newline' | 'comma' | 'semicolon';

export interface ListRandomizerState {
  text: string;
  delimiter: DelimiterType;
  output: string;
}
