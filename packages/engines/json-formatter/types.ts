export interface JsonFormatterOptions {
  spaces: number | 'tab';
}

export interface JsonFormatterState {
  input: string;
  output: string;
  error: string | null;
  parsedData: unknown | null;
  stats: { size: number; rootType: string } | null;
  options: JsonFormatterOptions;
}

export type JsonFormatterAction =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'FORMAT' }
  | { type: 'MINIFY' }
  | { type: 'SET_SPACES'; payload: number | 'tab' }
  | { type: 'CLEAR' }
  | { type: 'VALIDATE' };
