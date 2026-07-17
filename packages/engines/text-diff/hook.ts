import { useState, useEffect, useCallback } from 'react';
import { TextDiffState } from './types';
import { computeDiff } from './engine';

export function useTextDiff() {
  const [state, setState] = useState<TextDiffState>({
    original: '',
    modified: '',
    diffMode: 'words',
    diffResult: [],
  });

  const setOriginal = useCallback((val: string) => {
    setState((prev) => ({ ...prev, original: val }));
  }, []);

  const setModified = useCallback((val: string) => {
    setState((prev) => ({ ...prev, modified: val }));
  }, []);

  const setDiffMode = useCallback((val: 'chars' | 'words' | 'lines') => {
    setState((prev) => ({ ...prev, diffMode: val }));
  }, []);

  const handleClearAll = useCallback(() => {
    setState((prev) => ({ ...prev, original: '', modified: '' }));
  }, []);

  // Compute diffs dynamically
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      diffResult: computeDiff(prev.original, prev.modified, prev.diffMode),
    }));
  }, [state.original, state.modified, state.diffMode]);

  return {
    state,
    setOriginal,
    setModified,
    setDiffMode,
    handleClearAll,
  };
}
export type UseTextDiffReturn = ReturnType<typeof useTextDiff>;
