export type SortOrder = 'none' | 'asc' | 'desc';
export type NumberDelimiter = 'space' | 'comma' | 'newline';

export interface NumberRandomizerState {
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  sortBy: SortOrder;
  delimiter: NumberDelimiter;
  output: string;
}
