export interface DensityItem {
  word: string;
  freq: number;
  percentage: string;
}

export interface WordCounterState {
  text: string;
  excludeStopWords: boolean;
}
