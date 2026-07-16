import { useState, useEffect, useCallback } from 'react';
import { UrlEncoderDecoderState } from './types';
import { safeUrlEncode, safeUrlDecode } from './engine';

export function useUrlEncoderDecoder() {
  const [state, setState] = useState<UrlEncoderDecoderState>({
    input: '',
    output: '',
    mode: 'encode',
    copied: false,
  });

  useEffect(() => {
    if (!state.input) {
      setState((prev) => ({ ...prev, output: '' }));
      return;
    }

    if (state.mode === 'encode') {
      setState((prev) => ({ ...prev, output: safeUrlEncode(prev.input) }));
    } else {
      setState((prev) => ({ ...prev, output: safeUrlDecode(prev.input) }));
    }
  }, [state.input, state.mode]);

  useEffect(() => {
    if (state.copied) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, copied: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.copied]);

  const setInput = useCallback((val: string) => {
    setState((prev) => ({ ...prev, input: val }));
  }, []);

  const setMode = useCallback((val: 'encode' | 'decode') => {
    setState((prev) => ({ ...prev, mode: val }));
  }, []);

  const toggleMode = useCallback(() => {
    setState((prev) => {
      const nextMode = prev.mode === 'encode' ? 'decode' : 'encode';
      const hasValidOutput = prev.output && !prev.output.startsWith('Error');
      return {
        ...prev,
        mode: nextMode,
        input: hasValidOutput ? prev.output : prev.input,
      };
    });
  }, []);

  const triggerCopy = useCallback(() => {
    setState((prev) => ({ ...prev, copied: true }));
  }, []);

  return {
    state,
    setInput,
    setMode,
    toggleMode,
    triggerCopy,
  };
}
