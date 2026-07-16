import { useReducer, useCallback, useEffect } from 'react';
import { JsonFormatterState, JsonFormatterAction } from './types';
import { prettifyJson, minifyJson, parseJsonError, parseJsonSafely, getJsonStats } from './engine';

const initialState: JsonFormatterState = {
  input: '',
  output: '',
  error: null,
  parsedData: null,
  stats: null,
  options: {
    spaces: 2, // 'tab' or number
  },
};

function reducer(state: JsonFormatterState, action: JsonFormatterAction): JsonFormatterState {
  switch (action.type) {
    case 'SET_INPUT': {
      const parsed = parseJsonSafely(action.payload);
      return {
        ...state,
        input: action.payload,
        error: null, // Clear error during typing to prevent immediate error flashing
        parsedData: parsed,
        stats: getJsonStats(action.payload, parsed),
        output: action.payload.trim() === '' ? '' : state.output,
      };
    }
    case 'SET_SPACES':
      return {
        ...state,
        options: {
          ...state.options,
          spaces: action.payload,
        },
      };
    case 'FORMAT':
      if (!state.input.trim()) return state;
      try {
        const errorMsg = parseJsonError(state.input);
        if (errorMsg) {
          return { ...state, error: errorMsg };
        }
        return {
          ...state,
          output: prettifyJson(state.input, state.options.spaces),
          error: null,
        };
      } catch (e: any) {
        return { ...state, error: e.message };
      }
    case 'MINIFY':
      if (!state.input.trim()) return state;
      try {
        const errorMsg = parseJsonError(state.input);
        if (errorMsg) {
          return { ...state, error: errorMsg };
        }
        return {
          ...state,
          output: minifyJson(state.input),
          error: null,
        };
      } catch (e: any) {
        return { ...state, error: e.message };
      }
    case 'VALIDATE':
      return {
        ...state,
        error: parseJsonError(state.input),
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export function useJsonFormatter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInput = useCallback((input: string) => dispatch({ type: 'SET_INPUT', payload: input }), []);
  const setSpaces = useCallback((spaces: number | 'tab') => dispatch({ type: 'SET_SPACES', payload: spaces }), []);
  const format = useCallback(() => dispatch({ type: 'FORMAT' }), []);
  const minify = useCallback(() => dispatch({ type: 'MINIFY' }), []);
  const validate = useCallback(() => dispatch({ type: 'VALIDATE' }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  // Auto-format on change if input is valid JSON, and debounce invalid error alerts
  useEffect(() => {
    if (!state.input.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(state.input);
      if (parsed && parseJsonError(state.input) === null) {
        dispatch({ type: 'FORMAT' });
      }
    } catch {
      // Don't show error immediately to allow typing
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'VALIDATE' });
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.input, state.options.spaces]);

  return {
    state,
    setInput,
    setSpaces,
    format,
    minify,
    validate,
    clear,
  };
}
