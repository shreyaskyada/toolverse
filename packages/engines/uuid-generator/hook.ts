import { useReducer, useCallback } from 'react';
import { UuidGeneratorState, UuidGeneratorAction, UuidVersion } from './types';
import { DEFAULT_QUANTITY } from './constants';
import { generateUuids } from './engine';

const initialState: UuidGeneratorState = {
  options: {
    version: '4',
    quantity: DEFAULT_QUANTITY,
    uppercase: false,
    hyphens: true,
  },
  uuids: [],
};

function reducer(state: UuidGeneratorState, action: UuidGeneratorAction): UuidGeneratorState {
  switch (action.type) {
    case 'SET_VERSION':
      return {
        ...state,
        options: {
          ...state.options,
          version: action.payload,
        },
      };
    case 'SET_QUANTITY':
      return {
        ...state,
        options: {
          ...state.options,
          quantity: action.payload,
        },
      };
    case 'SET_UPPERCASE':
      return {
        ...state,
        options: {
          ...state.options,
          uppercase: action.payload,
        },
      };
    case 'SET_HYPHENS':
      return {
        ...state,
        options: {
          ...state.options,
          hyphens: action.payload,
        },
      };
    case 'GENERATE':
      return {
        ...state,
        uuids: generateUuids(state.options),
      };
    case 'CLEAR':
      return {
        ...state,
        uuids: [],
      };
    default:
      return state;
  }
}

export function useUuidGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setVersion = useCallback((version: UuidVersion) => {
    dispatch({ type: 'SET_VERSION', payload: version });
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', payload: quantity });
  }, []);

  const setUppercase = useCallback((uppercase: boolean) => {
    dispatch({ type: 'SET_UPPERCASE', payload: uppercase });
  }, []);

  const setHyphens = useCallback((hyphens: boolean) => {
    dispatch({ type: 'SET_HYPHENS', payload: hyphens });
  }, []);

  const generate = useCallback(() => {
    dispatch({ type: 'GENERATE' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    state,
    setVersion,
    setQuantity,
    setUppercase,
    setHyphens,
    generate,
    clear,
  };
}
