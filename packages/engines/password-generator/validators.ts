import { PasswordGeneratorOptions } from './types';
import { MIN_LENGTH, MAX_LENGTH } from './constants';

export function validateOptions(options: PasswordGeneratorOptions): string | null {
  if (options.length < MIN_LENGTH || options.length > MAX_LENGTH) {
    return `Password length must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`;
  }
  if (
    !options.includeLowercase &&
    !options.includeUppercase &&
    !options.includeNumbers &&
    !options.includeSymbols
  ) {
    return 'At least one character type must be selected.';
  }
  return null;
}
