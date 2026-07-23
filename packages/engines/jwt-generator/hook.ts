import { useReducer, useCallback, useEffect } from 'react';
import { JwtGeneratorState, JwtGeneratorAction } from './types';
import { signJWT } from './engine';
import { validateJson } from './validators';
import { RSA_PRIVATE_KEY, ECDSA_P256_PRIVATE_KEY, ECDSA_P384_PRIVATE_KEY, ECDSA_P521_PRIVATE_KEY } from './constants';

const DEFAULT_HEADER = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}';
const DEFAULT_PAYLOAD = '{\n  "sub": "usr_1234567890",\n  "name": "John Doe",\n  "admin": true,\n  "iat": 1516239022\n}';

const initialState: JwtGeneratorState = {
  alg: 'HS256',
  secretOrKey: 'your-256-bit-secret',
  secretIsBase64: false,
  headerInput: DEFAULT_HEADER,
  payloadInput: DEFAULT_PAYLOAD,
  headerError: null,
  payloadError: null,
  signingError: null,
  generatedToken: '',
  sub: 'usr_1234567890',
  iss: 'jumpytools.com',
  aud: 'api.jumpytools.com',
  expOffset: '3600',
  addIat: true,
  addNbf: false,
  jti: true,
  uuidSeed: '6db448cf-9a99-4d2a-89ea-6ab410d5402c',
};

function reducer(state: JwtGeneratorState, action: JwtGeneratorAction): JwtGeneratorState {
  switch (action.type) {
    case 'SET_ALG': return { ...state, alg: action.payload };
    case 'SET_SECRET_OR_KEY': return { ...state, secretOrKey: action.payload };
    case 'SET_SECRET_IS_BASE64': return { ...state, secretIsBase64: action.payload };
    case 'SET_HEADER_INPUT': return { ...state, headerInput: action.payload };
    case 'SET_PAYLOAD_INPUT': return { ...state, payloadInput: action.payload };
    case 'SET_HEADER_ERROR': return { ...state, headerError: action.payload };
    case 'SET_PAYLOAD_ERROR': return { ...state, payloadError: action.payload };
    case 'SET_SIGNING_ERROR': return { ...state, signingError: action.payload };
    case 'SET_GENERATED_TOKEN': return { ...state, generatedToken: action.payload };
    case 'SET_SUB': return { ...state, sub: action.payload };
    case 'SET_ISS': return { ...state, iss: action.payload };
    case 'SET_AUD': return { ...state, aud: action.payload };
    case 'SET_EXP_OFFSET': return { ...state, expOffset: action.payload };
    case 'SET_ADD_IAT': return { ...state, addIat: action.payload };
    case 'SET_ADD_NBF': return { ...state, addNbf: action.payload };
    case 'SET_JTI': return { ...state, jti: action.payload };
    case 'SET_UUID_SEED': return { ...state, uuidSeed: action.payload };
    case 'CLEAR': return initialState;
    default: return state;
  }
}

export function useJwtGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Setters
  const setSecretOrKey = useCallback((v: string) => dispatch({ type: 'SET_SECRET_OR_KEY', payload: v }), []);
  const setSecretIsBase64 = useCallback((v: boolean) => dispatch({ type: 'SET_SECRET_IS_BASE64', payload: v }), []);
  const setSub = useCallback((v: string) => dispatch({ type: 'SET_SUB', payload: v }), []);
  const setIss = useCallback((v: string) => dispatch({ type: 'SET_ISS', payload: v }), []);
  const setAud = useCallback((v: string) => dispatch({ type: 'SET_AUD', payload: v }), []);
  const setExpOffset = useCallback((v: string) => dispatch({ type: 'SET_EXP_OFFSET', payload: v }), []);
  const setAddIat = useCallback((v: boolean) => dispatch({ type: 'SET_ADD_IAT', payload: v }), []);
  const setAddNbf = useCallback((v: boolean) => dispatch({ type: 'SET_ADD_NBF', payload: v }), []);
  const setJti = useCallback((v: boolean) => dispatch({ type: 'SET_JTI', payload: v }), []);
  const setUuidSeed = useCallback((v: string) => dispatch({ type: 'SET_UUID_SEED', payload: v }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  // Refresh JWT ID
  const refreshJti = useCallback(() => {
    const gCrypto =
      (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined) ||
      (typeof window !== 'undefined' ? window.crypto : undefined);
    const uuid = gCrypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    dispatch({ type: 'SET_UUID_SEED', payload: uuid });
  }, []);

  // Handle header change — also syncs alg state
  const handleHeaderChange = useCallback((val: string) => {
    dispatch({ type: 'SET_HEADER_INPUT', payload: val });
    const err = validateJson(val);
    dispatch({ type: 'SET_HEADER_ERROR', payload: err });
    if (!err) {
      try {
        const parsed = JSON.parse(val);
        if (typeof parsed.alg === 'string' && parsed.alg !== state.alg) {
          dispatch({ type: 'SET_ALG', payload: parsed.alg });
        }
      } catch {
        // ignore
      }
    }
  }, [state.alg]);

  // Handle payload change
  const handlePayloadChange = useCallback((val: string) => {
    dispatch({ type: 'SET_PAYLOAD_INPUT', payload: val });
    const err = validateJson(val);
    dispatch({ type: 'SET_PAYLOAD_ERROR', payload: err });
  }, []);

  // Format JSONs
  const prettifyTextareas = useCallback(() => {
    try {
      const hObj = JSON.parse(state.headerInput);
      dispatch({ type: 'SET_HEADER_INPUT', payload: JSON.stringify(hObj, null, 2) });
      dispatch({ type: 'SET_HEADER_ERROR', payload: null });
    } catch {
      // keep as-is
    }
    try {
      const pObj = JSON.parse(state.payloadInput);
      dispatch({ type: 'SET_PAYLOAD_INPUT', payload: JSON.stringify(pObj, null, 2) });
      dispatch({ type: 'SET_PAYLOAD_ERROR', payload: null });
    } catch {
      // keep as-is
    }
  }, [state.headerInput, state.payloadInput]);

  // Set alg — also updates header JSON and loads appropriate key template
  const setAlg = useCallback((newAlg: string) => {
    dispatch({ type: 'SET_ALG', payload: newAlg });
    // Sync header JSON
    try {
      const parsed = JSON.parse(state.headerInput);
      parsed.alg = newAlg;
      dispatch({ type: 'SET_HEADER_INPUT', payload: JSON.stringify(parsed, null, 2) });
    } catch {
      dispatch({
        type: 'SET_HEADER_INPUT',
        payload: JSON.stringify({ alg: newAlg, typ: 'JWT' }, null, 2),
      });
    }
    dispatch({ type: 'SET_HEADER_ERROR', payload: null });
    // Load template key
    if (newAlg.startsWith('HS') || newAlg === 'none') {
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: 'your-256-bit-secret' });
    } else if (newAlg.startsWith('RS') || newAlg.startsWith('PS')) {
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: RSA_PRIVATE_KEY });
    } else if (newAlg.startsWith('ES')) {
      // Pick the correct key for each EC curve
      const ecKey =
        newAlg === 'ES384' ? ECDSA_P384_PRIVATE_KEY
          : newAlg === 'ES512' ? ECDSA_P521_PRIVATE_KEY
            : ECDSA_P256_PRIVATE_KEY;
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: ecKey });
    }
  }, [state.headerInput]);

  // Rebuild payload from claim builder fields
  useEffect(() => {
    try {
      const payload: Record<string, unknown> = {};
      if (state.sub) payload.sub = state.sub;
      if (state.iss) payload.iss = state.iss;
      if (state.aud) payload.aud = state.aud;
      const now = Math.floor(Date.now() / 1000);
      if (state.addIat) payload.iat = now;
      if (state.addNbf) payload.nbf = now;
      if (state.expOffset !== 'none') {
        payload.exp = now + parseInt(state.expOffset, 10);
      }
      if (state.jti && state.uuidSeed) payload.jti = state.uuidSeed;
      dispatch({ type: 'SET_PAYLOAD_INPUT', payload: JSON.stringify(payload, null, 2) });
      dispatch({ type: 'SET_PAYLOAD_ERROR', payload: null });
    } catch {
      // ignore
    }
  }, [state.sub, state.iss, state.aud, state.expOffset, state.addIat, state.addNbf, state.jti, state.uuidSeed]);

  // Live JWT generation with 200ms debounce
  useEffect(() => {
    if (state.headerError || state.payloadError) {
      dispatch({ type: 'SET_GENERATED_TOKEN', payload: '' });
      return;
    }

    let active = true;

    async function generate() {
      try {
        const headerObj = JSON.parse(state.headerInput);
        const payloadObj = JSON.parse(state.payloadInput);
        const token = await signJWT(headerObj, payloadObj, state.secretOrKey, state.secretIsBase64);
        if (active) {
          dispatch({ type: 'SET_GENERATED_TOKEN', payload: token });
          dispatch({ type: 'SET_SIGNING_ERROR', payload: null });
        }
      } catch (err) {
        if (active) {
          dispatch({ type: 'SET_GENERATED_TOKEN', payload: '' });
          dispatch({ type: 'SET_SIGNING_ERROR', payload: err instanceof Error ? err.message : String(err) });
        }
      }
    }

    const timer = setTimeout(() => generate(), 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [state.headerInput, state.payloadInput, state.secretOrKey, state.secretIsBase64, state.headerError, state.payloadError]);

  return {
    state,
    setAlg,
    setSecretOrKey,
    setSecretIsBase64,
    setSub,
    setIss,
    setAud,
    setExpOffset,
    setAddIat,
    setAddNbf,
    setJti,
    setUuidSeed,
    refreshJti,
    handleHeaderChange,
    handlePayloadChange,
    prettifyTextareas,
    clear,
  };
}
