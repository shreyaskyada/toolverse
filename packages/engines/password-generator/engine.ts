import { PasswordGeneratorOptions, PasswordStrength } from './types';
import {
  CHARSET_LOWERCASE,
  CHARSET_UPPERCASE,
  CHARSET_NUMBERS,
  CHARSET_SYMBOLS,
} from './constants';

export function generatePassword(options: PasswordGeneratorOptions): string {
  let charset = '';
  if (options.includeLowercase) charset += CHARSET_LOWERCASE;
  if (options.includeUppercase) charset += CHARSET_UPPERCASE;
  if (options.includeNumbers) charset += CHARSET_NUMBERS;
  if (options.includeSymbols) charset += CHARSET_SYMBOLS;

  if (charset === '') {
    return '';
  }

  const mandatoryChars: string[] = [];
  if (options.includeLowercase) {
    mandatoryChars.push(CHARSET_LOWERCASE[Math.floor(Math.random() * CHARSET_LOWERCASE.length)]!);
  }
  if (options.includeUppercase) {
    mandatoryChars.push(CHARSET_UPPERCASE[Math.floor(Math.random() * CHARSET_UPPERCASE.length)]!);
  }
  if (options.includeNumbers) {
    mandatoryChars.push(CHARSET_NUMBERS[Math.floor(Math.random() * CHARSET_NUMBERS.length)]!);
  }
  if (options.includeSymbols) {
    mandatoryChars.push(CHARSET_SYMBOLS[Math.floor(Math.random() * CHARSET_SYMBOLS.length)]!);
  }

  // Shuffle mandatory characters
  for (let i = mandatoryChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = mandatoryChars[i];
    mandatoryChars[i] = mandatoryChars[j]!;
    mandatoryChars[j] = temp!;
  }

  let newPassword = '';
  // Fill the remaining length
  const remainingLength = Math.max(0, options.length - mandatoryChars.length);
  for (let i = 0; i < remainingLength; i++) {
    newPassword += charset[Math.floor(Math.random() * charset.length)];
  }

  // Insert mandatory characters randomly
  for (const char of mandatoryChars) {
    const insertAt = Math.floor(Math.random() * (newPassword.length + 1));
    newPassword = newPassword.slice(0, insertAt) + char + newPassword.slice(insertAt);
  }

  return newPassword.slice(0, options.length);
}

export function calculateStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: '',
    };
  }

  let score = 0;
  if (password.length > 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 16 && (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password))) score += 1;

  score = Math.min(4, score);

  let label = '';
  let color = '';

  switch (score) {
    case 0:
    case 1:
      label = 'Weak';
      color = 'bg-red-500';
      break;
    case 2:
      label = 'Fair';
      color = 'bg-amber-500';
      break;
    case 3:
      label = 'Good';
      color = 'bg-blue-500';
      break;
    case 4:
      label = 'Strong';
      color = 'bg-emerald-500';
      break;
    default:
      break;
  }

  return {
    score,
    label,
    color,
  };
}
