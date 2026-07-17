import { useState, useCallback, useMemo } from 'react';
import { randomizeList } from './engine';
import { SAMPLE_TEXT } from './constants';
import { DelimiterType } from './types';

export function useListRandomizer() {
  const [text, setText] = useState<string>('');
  const [delimiter, setDelimiter] = useState<DelimiterType>('newline');
  const [shuffleTrigger, setShuffleTrigger] = useState<number>(0);

  const handleClear = useCallback(() => {
    setText('');
    setShuffleTrigger(0);
  }, []);

  const handleLoadSample = useCallback(() => {
    setText(SAMPLE_TEXT);
    setShuffleTrigger((prev) => prev + 1);
  }, []);

  const handleShuffle = useCallback(() => {
    setShuffleTrigger((prev) => prev + 1);
  }, []);

  const output = useMemo(() => {
    return randomizeList(text, delimiter);
  }, [text, delimiter, shuffleTrigger]);

  return {
    state: {
      text,
      delimiter,
      output,
    },
    setText,
    setDelimiter,
    handleClear,
    handleLoadSample,
    handleShuffle,
  };
}
export type UseListRandomizerReturn = ReturnType<typeof useListRandomizer>;
