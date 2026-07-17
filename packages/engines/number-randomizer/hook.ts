import { useState, useCallback, useMemo } from 'react';
import { generateRandomNumbers } from './engine';
import { SortOrder, NumberDelimiter } from './types';

export function useNumberRandomizer() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(10);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOrder>('none');
  const [delimiter, setDelimiter] = useState<NumberDelimiter>('comma');
  const [generationTrigger, setGenerationTrigger] = useState<number>(0);

  const handleGenerate = useCallback(() => {
    setGenerationTrigger((prev) => prev + 1);
  }, []);

  const handleClear = useCallback(() => {
    setMin(1);
    setMax(100);
    setCount(10);
    setAllowDuplicates(false);
    setSortBy('none');
    setDelimiter('comma');
    setGenerationTrigger(0);
  }, []);

  const output = useMemo(() => {
    if (generationTrigger === 0) return '';
    return generateRandomNumbers(min, max, count, allowDuplicates, sortBy, delimiter);
  }, [min, max, count, allowDuplicates, sortBy, delimiter, generationTrigger]);

  return {
    state: {
      min,
      max,
      count,
      allowDuplicates,
      sortBy,
      delimiter,
      output,
      hasGenerated: generationTrigger > 0,
    },
    setMin,
    setMax,
    setCount,
    setAllowDuplicates,
    setSortBy,
    setDelimiter,
    handleGenerate,
    handleClear,
  };
}
export type UseNumberRandomizerReturn = ReturnType<typeof useNumberRandomizer>;
