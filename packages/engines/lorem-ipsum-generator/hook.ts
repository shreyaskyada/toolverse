import { useState, useEffect, useCallback } from 'react';
import { LoremIpsumGeneratorState } from './types';
import { generateLoremText } from './engine';

export function useLoremIpsumGenerator() {
  const [state, setState] = useState<LoremIpsumGeneratorState>({
    count: 3,
    type: 'paragraphs',
    output: '',
    copied: false,
    startWithLorem: true,
  });

  const generateText = useCallback(() => {
    setState((prev) => ({
      ...prev,
      output: generateLoremText(prev.count, prev.type, prev.startWithLorem),
    }));
  }, []);

  // Update text whenever configuration changes
  useEffect(() => {
    generateText();
  }, [state.count, state.type, state.startWithLorem, generateText]);

  // Clean copied state
  useEffect(() => {
    if (state.copied) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, copied: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.copied]);

  const setCount = useCallback((val: number) => {
    setState((prev) => ({ ...prev, count: val }));
  }, []);

  const setType = useCallback((val: 'paragraphs' | 'sentences' | 'words') => {
    setState((prev) => {
      let nextCount = prev.count;
      if (val === 'words' && prev.count < 5) nextCount = 50;
      else if (val === 'sentences' && prev.count > 50) nextCount = 5;
      else if (val === 'paragraphs' && prev.count > 20) nextCount = 3;
      return { ...prev, type: val, count: nextCount };
    });
  }, []);

  const setStartWithLorem = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, startWithLorem: val }));
  }, []);

  const triggerCopy = useCallback(() => {
    setState((prev) => ({ ...prev, copied: true }));
  }, []);

  return {
    state,
    setCount,
    setType,
    setStartWithLorem,
    generateText,
    triggerCopy,
  };
}
export type UseLoremIpsumGeneratorReturn = ReturnType<typeof useLoremIpsumGenerator>;
