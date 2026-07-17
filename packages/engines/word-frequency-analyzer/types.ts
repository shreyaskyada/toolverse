export interface WordFrequency {
  word: string;
  count: number;
  density: number; // percentage
}

export interface TextAnalysisResult {
  totalWords: number;
  uniqueWords: number;
  duplicateWordsCount: number;
  topKeyword: string;
  frequencies: WordFrequency[];
}

export interface WordFrequencyState {
  text: string;
  excludeStopWords: boolean;
}
