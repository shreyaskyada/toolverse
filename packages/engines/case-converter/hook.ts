import { useState, useCallback, useMemo } from 'react';
import { SAMPLE_TEXT } from './constants';

export function useCaseConverter() {
  const [baselineText, setBaselineText] = useState<string>('');
  const [transformFn, setTransformFn] = useState<((str: string) => string) | null>(null);

  const setText = useCallback((val: string) => {
    setBaselineText(val);
    setTransformFn(null); // Clear active transformation when user edits manually
  }, []);

  const handleClear = useCallback(() => {
    setBaselineText('');
    setTransformFn(null);
  }, []);

  const handleLoadSample = useCallback(() => {
    setBaselineText(SAMPLE_TEXT);
    setTransformFn(null);
  }, []);

  const applyTransform = useCallback((fn: (str: string) => string) => {
    setTransformFn(() => fn);
  }, []);

  // The displayed text in the workspace
  const displayText = useMemo(() => {
    if (!transformFn) return baselineText;
    return transformFn(baselineText);
  }, [baselineText, transformFn]);

  // Stats computed on the active display text
  const stats = useMemo(() => {
    const textVal = displayText;
    const charCountWithSpaces = textVal.length;
    const charCountWithoutSpaces = textVal.replace(/\s/g, '').length;
    const wordsArray = textVal.trim().split(/\s+/).filter((w) => w.length > 0);
    const wordCount = wordsArray.length;
    const lineCount = textVal === '' ? 0 : textVal.split('\n').length;

    return {
      charCountWithSpaces,
      charCountWithoutSpaces,
      wordCount,
      lineCount,
    };
  }, [displayText]);

  return {
    state: {
      text: displayText,
    },
    stats,
    setText,
    handleClear,
    handleLoadSample,
    applyTransform,
  };
}
export type UseCaseConverterReturn = ReturnType<typeof useCaseConverter>;
