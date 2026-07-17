import { useState, useCallback, useMemo } from 'react';
import { reverseText } from './engine';
import { SAMPLE_TEXT } from './constants';
import { ReverseMode } from './types';

export function useTextReverser() {
  const [text, setText] = useState<string>('');
  const [mode, setMode] = useState<ReverseMode>('chars');

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const handleLoadSample = useCallback(() => {
    setText(SAMPLE_TEXT);
  }, []);

  const output = useMemo(() => {
    return reverseText(text, mode);
  }, [text, mode]);

  return {
    state: {
      text,
      mode,
      output,
    },
    setText,
    setMode,
    handleClear,
    handleLoadSample,
  };
}
export type UseTextReverserReturn = ReturnType<typeof useTextReverser>;
