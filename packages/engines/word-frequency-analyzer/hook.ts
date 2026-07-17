import { useState, useCallback, useMemo } from 'react';
import { analyzeWordFrequencies } from './engine';
import { SAMPLE_TEXT } from './constants';

export function useWordFrequencyAnalyzer() {
  const [text, setText] = useState<string>('');
  const [excludeStopWords, setExcludeStopWords] = useState<boolean>(true);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const handleLoadSample = useCallback(() => {
    setText(SAMPLE_TEXT);
  }, []);

  const analysis = useMemo(() => {
    return analyzeWordFrequencies(text, excludeStopWords);
  }, [text, excludeStopWords]);

  return {
    state: {
      text,
      excludeStopWords,
    },
    analysis,
    setText,
    setExcludeStopWords,
    handleClear,
    handleLoadSample,
  };
}
export type UseWordFrequencyAnalyzerReturn = ReturnType<typeof useWordFrequencyAnalyzer>;
