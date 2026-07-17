import { Change } from 'diff';

export type DiffChange = Change;

export interface TextDiffState {
  original: string;
  modified: string;
  diffMode: 'chars' | 'words' | 'lines';
  diffResult: DiffChange[];
}
