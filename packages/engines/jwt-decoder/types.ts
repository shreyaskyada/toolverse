export interface ParseResult {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string | null;
  headerRaw: string;
  payloadRaw: string;
  signatureRaw: string;
  error: string | null;
}

export interface VerificationResult {
  verified: boolean | null;
  error?: string;
}

export interface JwtDecoderState {
  // The raw encoded token (source of truth when user pastes on left)
  token: string;
  // Editable decoded JSON strings (source of truth when user edits on right)
  headerJson: string;
  payloadJson: string;
  headerJsonError: string | null;
  payloadJsonError: string | null;
  // Signature verification
  secretOrKey: string;
  secretIsBase64: boolean;
  verificationResult: VerificationResult;
  // Expiry countdown
  timeRemaining: number | null;
  tokenStatus: 'active' | 'expired' | 'no-exp' | 'invalid';
  // Which side was last edited (to avoid feedback loops)
  lastEditedSide: 'encoded' | 'decoded';
}

export type JwtDecoderAction =
  | { type: 'SET_TOKEN_FROM_ENCODED'; payload: string }
  | { type: 'SET_TOKEN_FROM_DECODED'; payload: string }
  | { type: 'SET_HEADER_JSON'; payload: string }
  | { type: 'SET_PAYLOAD_JSON'; payload: string }
  | { type: 'SET_HEADER_JSON_ERROR'; payload: string | null }
  | { type: 'SET_PAYLOAD_JSON_ERROR'; payload: string | null }
  | { type: 'SET_SECRET_OR_KEY'; payload: string }
  | { type: 'SET_SECRET_IS_BASE64'; payload: boolean }
  | { type: 'SET_VERIFICATION_RESULT'; payload: VerificationResult }
  | { type: 'SET_TIMER'; payload: { timeRemaining: number | null; status: 'active' | 'expired' | 'no-exp' | 'invalid' } }
  | { type: 'LOAD_FULL'; payload: { token: string; headerJson: string; payloadJson: string; secretOrKey: string } }
  | { type: 'CLEAR' };
