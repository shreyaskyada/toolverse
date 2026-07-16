export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export interface PasswordGeneratorState {
  password: string;
  options: PasswordGeneratorOptions;
  strength: PasswordStrength;
}

export type PasswordGeneratorAction =
  | { type: 'SET_LENGTH'; payload: number }
  | { type: 'SET_UPPERCASE'; payload: boolean }
  | { type: 'SET_LOWERCASE'; payload: boolean }
  | { type: 'SET_NUMBERS'; payload: boolean }
  | { type: 'SET_SYMBOLS'; payload: boolean }
  | { type: 'GENERATE' }
  | { type: 'CLEAR' };
