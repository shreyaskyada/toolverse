import { useReducer, useCallback, useEffect } from 'react';
import { PasswordGeneratorState, PasswordGeneratorAction } from './types';
import { DEFAULT_LENGTH } from './constants';
import { generatePassword, calculateStrength } from './engine';

const initialState: PasswordGeneratorState = {
  password: '',
  options: {
    length: DEFAULT_LENGTH,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
  strength: {
    score: 0,
    label: '',
    color: '',
  },
};

function reducer(state: PasswordGeneratorState, action: PasswordGeneratorAction): PasswordGeneratorState {
  const newOptions = { ...state.options };

  switch (action.type) {
    case 'SET_LENGTH':
      newOptions.length = action.payload;
      break;
    case 'SET_UPPERCASE':
      newOptions.includeUppercase = action.payload;
      break;
    case 'SET_LOWERCASE':
      newOptions.includeLowercase = action.payload;
      break;
    case 'SET_NUMBERS':
      newOptions.includeNumbers = action.payload;
      break;
    case 'SET_SYMBOLS':
      newOptions.includeSymbols = action.payload;
      break;
    case 'GENERATE': {
      const password = generatePassword(state.options);
      return {
        ...state,
        password,
        strength: calculateStrength(password),
      };
    }
    case 'CLEAR':
      return {
        ...state,
        password: '',
        strength: {
          score: 0,
          label: '',
          color: '',
        },
      };
    default:
      return state;
  }

  // Generate password automatically when options change
  const password = generatePassword(newOptions);
  return {
    ...state,
    options: newOptions,
    password,
    strength: calculateStrength(password),
  };
}

export function usePasswordGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLength = useCallback((length: number) => {
    dispatch({ type: 'SET_LENGTH', payload: length });
  }, []);

  const setIncludeUppercase = useCallback((val: boolean) => {
    dispatch({ type: 'SET_UPPERCASE', payload: val });
  }, []);

  const setIncludeLowercase = useCallback((val: boolean) => {
    dispatch({ type: 'SET_LOWERCASE', payload: val });
  }, []);

  const setIncludeNumbers = useCallback((val: boolean) => {
    dispatch({ type: 'SET_NUMBERS', payload: val });
  }, []);

  const setIncludeSymbols = useCallback((val: boolean) => {
    dispatch({ type: 'SET_SYMBOLS', payload: val });
  }, []);

  const generate = useCallback(() => {
    dispatch({ type: 'GENERATE' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  // Generate on mount
  useEffect(() => {
    generate();
  }, [generate]);

  return {
    state,
    setLength,
    setIncludeUppercase,
    setIncludeLowercase,
    setIncludeNumbers,
    setIncludeSymbols,
    generate,
    clear,
  };
}
