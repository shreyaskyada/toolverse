export interface JwtGeneratorState {
  alg: string;
  secretOrKey: string;
  secretIsBase64: boolean;
  headerInput: string;
  payloadInput: string;
  headerError: string | null;
  payloadError: string | null;
  signingError: string | null;
  generatedToken: string;
  // Claim builder fields
  sub: string;
  iss: string;
  aud: string;
  expOffset: string;
  addIat: boolean;
  addNbf: boolean;
  jti: boolean;
  uuidSeed: string;
}

export type JwtGeneratorAction =
  | { type: 'SET_ALG'; payload: string }
  | { type: 'SET_SECRET_OR_KEY'; payload: string }
  | { type: 'SET_SECRET_IS_BASE64'; payload: boolean }
  | { type: 'SET_HEADER_INPUT'; payload: string }
  | { type: 'SET_PAYLOAD_INPUT'; payload: string }
  | { type: 'SET_HEADER_ERROR'; payload: string | null }
  | { type: 'SET_PAYLOAD_ERROR'; payload: string | null }
  | { type: 'SET_SIGNING_ERROR'; payload: string | null }
  | { type: 'SET_GENERATED_TOKEN'; payload: string }
  | { type: 'SET_SUB'; payload: string }
  | { type: 'SET_ISS'; payload: string }
  | { type: 'SET_AUD'; payload: string }
  | { type: 'SET_EXP_OFFSET'; payload: string }
  | { type: 'SET_ADD_IAT'; payload: boolean }
  | { type: 'SET_ADD_NBF'; payload: boolean }
  | { type: 'SET_JTI'; payload: boolean }
  | { type: 'SET_UUID_SEED'; payload: string }
  | { type: 'CLEAR' };
