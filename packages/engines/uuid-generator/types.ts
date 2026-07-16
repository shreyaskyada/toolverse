export type UuidVersion = '4' | '1';

export interface UuidGeneratorOptions {
  version: UuidVersion;
  quantity: number;
  uppercase: boolean;
  hyphens: boolean;
}

export interface UuidGeneratorState {
  options: UuidGeneratorOptions;
  uuids: string[];
}

export type UuidGeneratorAction =
  | { type: 'SET_VERSION'; payload: UuidVersion }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'SET_UPPERCASE'; payload: boolean }
  | { type: 'SET_HYPHENS'; payload: boolean }
  | { type: 'GENERATE' }
  | { type: 'CLEAR' };
