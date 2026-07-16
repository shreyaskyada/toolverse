export const DEFAULT_LENGTH = 16;
export const MIN_LENGTH = 6;
export const MAX_LENGTH = 64;

export const CHARSET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const CHARSET_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const CHARSET_NUMBERS = '0123456789';
export const CHARSET_SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

export const TOOL_METADATA = {
  title: 'Password Generator',
  description: 'Generate secure, random passwords with custom length, character sets, and a real-time strength indicator. 100% client-side.',
  slug: 'password-generator',
  category: 'security-tools',
};

export const TOOL_FAQS = [
  {
    question: 'Are these passwords secure?',
    answer: 'Yes. The passwords are generated client-side using pseudorandom algorithms. Since they do not follow common human keyboard layouts or dictionary words, they are highly resistant to brute force attacks.',
  },
  {
    question: 'Are my passwords stored or saved anywhere?',
    answer: 'No. The generation runs 100% locally in your browser memory. We never transmit or save the passwords on any database or logging system.',
  },
  {
    question: 'How is the password strength score calculated?',
    answer: 'The strength calculator grades passwords based on length (bonus for 12+ and 16+ characters), uppercase and lowercase combinations, numbers, and symbols.',
  },
];

export const TOOL_ABOUT = [
  'A strong password is your first line of defense against unauthorized access. A password generator automates the creation of high-entropy strings, eliminating human biases and patterns.',
  'Secure Configurations:',
  '• Length: Standard security recommendations suggest using passwords of 12 characters or more (16+ is highly recommended).',
  '• Character Diversity: Mixing uppercase letters, lowercase letters, digits, and symbols dramatically increases complexity.',
  'All generation is performed locally in your browser context. No passwords are sent to any remote server.',
];
