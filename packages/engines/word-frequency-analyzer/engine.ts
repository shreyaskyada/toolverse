import { STOP_WORDS } from './constants';
import { TextAnalysisResult, WordFrequency } from './types';

export function analyzeWordFrequencies(text: string, excludeStopWords: boolean): TextAnalysisResult {
  if (!text || !text.trim()) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      duplicateWordsCount: 0,
      topKeyword: '-',
      frequencies: [],
    };
  }

  // Tokenize words: strip punctuation, lowercase, split by whitespace
  const rawWords = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.trim().length > 0);

  const totalWords = rawWords.length;
  if (totalWords === 0) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      duplicateWordsCount: 0,
      topKeyword: '-',
      frequencies: [],
    };
  }

  // Filter stop words if set
  const filteredWords = excludeStopWords
    ? rawWords.filter((w) => !STOP_WORDS.has(w))
    : rawWords;

  // Count frequencies
  const freqMap: Record<string, number> = {};
  for (const word of filteredWords) {
    freqMap[word] = (freqMap[word] || 0) + 1;
  }

  // Build sorted frequencies array
  const frequencies: WordFrequency[] = Object.keys(freqMap)
    .map((word) => {
      const count = freqMap[word] || 0;
      const density = Number(((count / totalWords) * 100).toFixed(2));
      return { word, count, density };
    })
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));

  const uniqueWords = Object.keys(freqMap).length;

  // Duplicate words count: words that appear more than once
  const duplicateWordsCount = Object.values(freqMap).filter((c) => c !== undefined && c > 1).length;

  // Top keyword
  const topKeyword = frequencies.length > 0 && frequencies[0] !== undefined ? frequencies[0].word : '-';

  return {
    totalWords,
    uniqueWords,
    duplicateWordsCount,
    topKeyword,
    frequencies,
  };
}
