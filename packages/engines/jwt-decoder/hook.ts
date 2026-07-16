import { useReducer, useCallback, useEffect, useMemo, useRef } from 'react';
import { JwtDecoderState, JwtDecoderAction } from './types';
import { parseJwt, verifySignature, generateSampleJWT, base64UrlDecode } from './engine';
import { signJWT } from '../jwt-generator/engine';
import {
  RSA_PRIVATE_KEY,
  RSA_PUBLIC_KEY,
  ECDSA_P256_PRIVATE_KEY,
  ECDSA_P256_PUBLIC_KEY,
  ECDSA_P384_PRIVATE_KEY,
  ECDSA_P521_PRIVATE_KEY,
} from '../jwt-generator/constants';

const ALGORITHMS = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'PS256', 'PS384', 'PS512',
  'ES256', 'ES384', 'ES512',
  'none',
];

const DEFAULT_HEADER_JSON = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}';
const DEFAULT_PAYLOAD_JSON = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}';

const initialState: JwtDecoderState = {
  token: '',
  headerJson: DEFAULT_HEADER_JSON,
  payloadJson: DEFAULT_PAYLOAD_JSON,
  headerJsonError: null,
  payloadJsonError: null,
  secretOrKey: 'your-256-bit-secret',
  secretIsBase64: false,
  verificationResult: { verified: null },
  timeRemaining: null,
  tokenStatus: 'no-exp',
  lastEditedSide: 'decoded',
};

function reducer(state: JwtDecoderState, action: JwtDecoderAction): JwtDecoderState {
  switch (action.type) {
    case 'SET_TOKEN_FROM_ENCODED':
      return {
        ...state,
        token: action.payload,
        lastEditedSide: 'encoded',
        verificationResult: { verified: null },
      };
    case 'SET_TOKEN_FROM_DECODED':
      return {
        ...state,
        token: action.payload,
        lastEditedSide: 'decoded',
        verificationResult: { verified: null },
      };
    case 'SET_HEADER_JSON':
      return { ...state, headerJson: action.payload, lastEditedSide: 'decoded' };
    case 'SET_PAYLOAD_JSON':
      return { ...state, payloadJson: action.payload, lastEditedSide: 'decoded' };
    case 'SET_HEADER_JSON_ERROR':
      return { ...state, headerJsonError: action.payload };
    case 'SET_PAYLOAD_JSON_ERROR':
      return { ...state, payloadJsonError: action.payload };
    case 'SET_SECRET_OR_KEY':
      return { ...state, secretOrKey: action.payload, verificationResult: { verified: null } };
    case 'SET_SECRET_IS_BASE64':
      return { ...state, secretIsBase64: action.payload, verificationResult: { verified: null } };
    case 'SET_VERIFICATION_RESULT':
      return { ...state, verificationResult: action.payload };
    case 'SET_TIMER':
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining,
        tokenStatus: action.payload.status,
      };
    case 'LOAD_FULL':
      return {
        ...state,
        token: action.payload.token,
        headerJson: action.payload.headerJson,
        payloadJson: action.payload.payloadJson,
        secretOrKey: action.payload.secretOrKey,
        headerJsonError: null,
        payloadJsonError: null,
        lastEditedSide: 'encoded',
        verificationResult: { verified: null },
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export function useJwtDecoder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isApplyingEncoded = useRef(false);
  const isApplyingDecoded = useRef(false);

  // Expose algorithm list
  const algorithms = ALGORITHMS;

  // --- Setters ---
  const setSecretOrKey = useCallback((v: string) =>
    dispatch({ type: 'SET_SECRET_OR_KEY', payload: v }), []);
  const setSecretIsBase64 = useCallback((v: boolean) =>
    dispatch({ type: 'SET_SECRET_IS_BASE64', payload: v }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  // Decode the current token into memoized result
  const decoded = useMemo(() => parseJwt(state.token), [state.token]);

  // ── When the encoded token changes (user typed/pasted on left) ──────────────
  // Sync decoded JSON panels to reflect the new token's content
  useEffect(() => {
    if (state.lastEditedSide !== 'encoded') return;
    if (isApplyingEncoded.current) return;

    isApplyingDecoded.current = true;
    try {
      if (decoded.header) {
        dispatch({ type: 'SET_HEADER_JSON', payload: JSON.stringify(decoded.header, null, 2) });
        dispatch({ type: 'SET_HEADER_JSON_ERROR', payload: null });
      } else if (!state.token.trim()) {
        dispatch({ type: 'SET_HEADER_JSON', payload: DEFAULT_HEADER_JSON });
        dispatch({ type: 'SET_HEADER_JSON_ERROR', payload: null });
      }
      if (decoded.payload) {
        dispatch({ type: 'SET_PAYLOAD_JSON', payload: JSON.stringify(decoded.payload, null, 2) });
        dispatch({ type: 'SET_PAYLOAD_JSON_ERROR', payload: null });
      } else if (!state.token.trim()) {
        dispatch({ type: 'SET_PAYLOAD_JSON', payload: DEFAULT_PAYLOAD_JSON });
        dispatch({ type: 'SET_PAYLOAD_JSON_ERROR', payload: null });
      }
    } finally {
      isApplyingDecoded.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token, state.lastEditedSide]);

  // ── Handle the user typing in the Header JSON textarea ────────────────────
  const handleHeaderJsonChange = useCallback((val: string) => {
    dispatch({ type: 'SET_HEADER_JSON', payload: val });
    try {
      JSON.parse(val);
      dispatch({ type: 'SET_HEADER_JSON_ERROR', payload: null });
    } catch (e) {
      dispatch({ type: 'SET_HEADER_JSON_ERROR', payload: e instanceof Error ? e.message : 'Invalid JSON' });
    }
  }, []);

  // ── Handle the user typing in the Payload JSON textarea ───────────────────
  const handlePayloadJsonChange = useCallback((val: string) => {
    dispatch({ type: 'SET_PAYLOAD_JSON', payload: val });
    try {
      JSON.parse(val);
      dispatch({ type: 'SET_PAYLOAD_JSON_ERROR', payload: null });
    } catch (e) {
      dispatch({ type: 'SET_PAYLOAD_JSON_ERROR', payload: e instanceof Error ? e.message : 'Invalid JSON' });
    }
  }, []);

  // ── When decoded JSON panels change (user editing right side) ─────────────
  // Re-sign and update the encoded token on the left
  useEffect(() => {
    if (state.lastEditedSide !== 'decoded') return;
    if (state.headerJsonError || state.payloadJsonError) return;
    if (isApplyingDecoded.current) return;

    let active = true;

    async function resignFromDecoded() {
      try {
        const headerObj = JSON.parse(state.headerJson);
        const payloadObj = JSON.parse(state.payloadJson);
        const newToken = await signJWT(headerObj, payloadObj, state.secretOrKey, state.secretIsBase64);
        if (active) {
          isApplyingEncoded.current = true;
          dispatch({ type: 'SET_TOKEN_FROM_DECODED', payload: newToken });
          isApplyingEncoded.current = false;
        }
      } catch {
        // Signing error — leave token as-is, don't clear it
      }
    }

    const timer = setTimeout(resignFromDecoded, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [state.headerJson, state.payloadJson, state.secretOrKey, state.secretIsBase64, state.headerJsonError, state.payloadJsonError, state.lastEditedSide]);

  // ── When user pastes encoded token on left ────────────────────────────────
  const setToken = useCallback((token: string) => {
    dispatch({ type: 'SET_TOKEN_FROM_ENCODED', payload: token });
  }, []);

  // ── Change algorithm — updates header JSON and loads template key ─────────
  const setAlg = useCallback((newAlg: string) => {
    let nextHeader = state.headerJson;
    try {
      const parsed = JSON.parse(state.headerJson);
      parsed.alg = newAlg;
      nextHeader = JSON.stringify(parsed, null, 2);
    } catch {
      nextHeader = JSON.stringify({ alg: newAlg, typ: 'JWT' }, null, 2);
    }
    dispatch({ type: 'SET_HEADER_JSON', payload: nextHeader });
    dispatch({ type: 'SET_HEADER_JSON_ERROR', payload: null });

    // Load matching key template only if the key hasn't been customised
    if (newAlg.startsWith('HS') || newAlg === 'none') {
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: 'your-256-bit-secret' });
    } else if (newAlg.startsWith('RS') || newAlg.startsWith('PS')) {
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: RSA_PUBLIC_KEY });
    } else if (newAlg === 'ES256') {
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: ECDSA_P256_PUBLIC_KEY });
    } else {
      // ES384 / ES512 — user must supply their own public key; placeholder
      dispatch({ type: 'SET_SECRET_OR_KEY', payload: '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.headerJson]);

  // ── Current alg derived from header JSON ──────────────────────────────────
  const currentAlg = useMemo(() => {
    try {
      const h = JSON.parse(state.headerJson);
      return typeof h.alg === 'string' ? h.alg : 'HS256';
    } catch {
      return 'HS256';
    }
  }, [state.headerJson]);

  // ── Load demo samples ─────────────────────────────────────────────────────
  const loadSample = useCallback(async (type: 'hs256-active' | 'hs256-expired' | 'rs256') => {
    if (type === 'rs256') {
      const pem = RSA_PUBLIC_KEY;
      const rsaToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IlJTQSBUZXN0ZXIiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzgyMzE4Mzk3LCJleHAiOjE4MTM4NTQzOTcsImlzcyI6InRvb2x2ZXJzZS5jb20ifQ.F5R_B88JDrlbACqzpyg9BmFerXEDocjzrJphixvKim0qXxvLAW4lMjLZGCZ3khBQ3ia5JvWh3kLC-4FRd0EQQckZa0aHuMFLQYruk2GPMspevD2lInyM0DcYkLWm4-BC4iYoGzxASJPxfEFyLY1tiLa5EJR0xoLxxE_GLN_1ueO3oF2b-BtvnHpGiWH4_3GW5ZF6olpvUYqa482WCbN1KPCidsxGieUSmhohPqLVOFxCX-cuN44K_zoy2lsjfKA9uNTc48CMc36PnKQSbfgv9PSrfu3z4urfPF5VSmyxuaNzt_qNjYvEJU12q7CkH-3-3f0bbrQy_raTNX5jLfL7Jw';
      try {
        const [hPart, pPart] = rsaToken.split('.');
        const headerObj = JSON.parse(base64UrlDecode(hPart as string));
        const payloadObj = JSON.parse(base64UrlDecode(pPart as string));
        dispatch({
          type: 'LOAD_FULL',
          payload: {
            token: rsaToken,
            headerJson: JSON.stringify(headerObj, null, 2),
            payloadJson: JSON.stringify(payloadObj, null, 2),
            secretOrKey: pem,
          },
        });
      } catch {
        // ignore
      }
    } else {
      const isExpired = type === 'hs256-expired';
      const secret = 'your-256-bit-secret';
      try {
        const jwt = await generateSampleJWT(secret, isExpired);
        const [hPart, pPart] = jwt.split('.');
        const headerObj = JSON.parse(base64UrlDecode(hPart as string));
        const payloadObj = JSON.parse(base64UrlDecode(pPart as string));
        dispatch({
          type: 'LOAD_FULL',
          payload: {
            token: jwt,
            headerJson: JSON.stringify(headerObj, null, 2),
            payloadJson: JSON.stringify(payloadObj, null, 2),
            secretOrKey: secret,
          },
        });
      } catch {
        // ignore
      }
    }
  }, []);

  // ── Update URL hash for sharing ───────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !state.token.trim()) return;
    const encoded = encodeURIComponent(state.token);
    const newHash = `#token=${encoded}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [state.token]);

  // ── Expiration countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (decoded.error || !decoded.payload) {
      dispatch({
        type: 'SET_TIMER',
        payload: { timeRemaining: null, status: decoded.error ? 'invalid' : 'no-exp' },
      });
      return;
    }
    const exp = decoded.payload.exp;
    if (typeof exp !== 'number') {
      dispatch({ type: 'SET_TIMER', payload: { timeRemaining: null, status: 'no-exp' } });
      return;
    }
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = exp - now;
      dispatch({ type: 'SET_TIMER', payload: { timeRemaining: diff, status: diff > 0 ? 'active' : 'expired' } });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state.token, decoded.payload, decoded.error]);

  // ── Signature verification ─────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    async function runVerification() {
      if (!state.token.trim()) {
        if (active) dispatch({ type: 'SET_VERIFICATION_RESULT', payload: { verified: null } });
        return;
      }
      if (decoded.error || !decoded.signature) {
        if (active) dispatch({ type: 'SET_VERIFICATION_RESULT', payload: { verified: null, error: decoded.error || 'Missing signature' } });
        return;
      }
      const alg = decoded.header?.alg;
      if (!alg || alg === 'none' || typeof alg !== 'string') {
        if (active) dispatch({ type: 'SET_VERIFICATION_RESULT', payload: { verified: false, error: "Algorithm 'none' cannot be verified." } });
        return;
      }
      if (!state.secretOrKey.trim()) {
        if (active) dispatch({ type: 'SET_VERIFICATION_RESULT', payload: { verified: null, error: 'Enter a secret or public key to verify.' } });
        return;
      }
      const result = await verifySignature(state.token, state.secretOrKey, state.secretIsBase64);
      if (active) dispatch({ type: 'SET_VERIFICATION_RESULT', payload: result });
    }

    runVerification();
    return () => { active = false; };
  }, [state.token, state.secretOrKey, state.secretIsBase64, decoded.header, decoded.signature, decoded.error]);

  return {
    state,
    decoded,
    algorithms,
    currentAlg,
    setToken,
    setAlg,
    setSecretOrKey,
    setSecretIsBase64,
    handleHeaderJsonChange,
    handlePayloadJsonChange,
    loadSample,
    clear,
  };
}
