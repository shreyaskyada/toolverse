import { useState, useCallback, useMemo } from 'react';
import { WordCounterState } from './types';
import { SAMPLE_TEXT } from './constants';
import { getWordDensity } from './engine';

export function useWordCounter() {
  const [state, setState] = useState<WordCounterState>({
    text: '',
    excludeStopWords: true,
  });

  const setText = useCallback((val: string) => {
    setState((prev) => ({ ...prev, text: val }));
  }, []);

  const setExcludeStopWords = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, excludeStopWords: val }));
  }, []);

  const handleClear = useCallback(() => {
    setState((prev) => ({ ...prev, text: '' }));
  }, []);

  const handleLoadSample = useCallback(() => {
    setState((prev) => ({ ...prev, text: SAMPLE_TEXT }));
  }, []);

  // Stats Calculations
  const stats = useMemo(() => {
    const textVal = state.text;
    const charCountWithSpaces = textVal.length;
    const charCountWithoutSpaces = textVal.replace(/\s/g, '').length;

    const wordsArray = textVal.trim().split(/\s+/).filter((w) => w.length > 0);
    const wordCount = wordsArray.length;

    const sentenceCount = textVal.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphCount = textVal.split(/\n+/).filter((p) => p.trim().length > 0).length;

    const avgWordLength = wordCount > 0 ? (charCountWithoutSpaces / wordCount).toFixed(1) : '0.0';
    const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : '0.0';

    const readingTimeMinutes = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;
    const speakingTimeMinutes = wordCount > 0 ? Math.ceil(wordCount / 130) : 0;

    return {
      charCountWithSpaces,
      charCountWithoutSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      avgWordLength,
      avgSentenceLength,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [state.text]);

  const densityResult = useMemo(() => {
    return getWordDensity(state.text, state.excludeStopWords);
  }, [state.text, state.excludeStopWords]);

  return {
    state,
    stats,
    densityResult,
    setText,
    setExcludeStopWords,
    handleClear,
    handleLoadSample,
  };
}
export type UseWordCounterReturn = ReturnType<typeof useWordCounter>;
