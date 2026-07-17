import { ReverseMode } from './types';

// Upside down unicode character map
const FLIP_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
  n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W',
  N: 'N', O: 'O', P: 'd', Q: 'Ό', R: 'ᴚ', S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
  '.': '˙', ',': "'", '\'': ',', '"': '„', '?': '¿', '!': '¡', ';': '؛', '(': ')', ')': '(', '[': ']',
  ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾', '`': ','
};

export function reverseCharacters(str: string): string {
  return str.split('').reverse().join('');
}

export function reverseWords(str: string): string {
  return str
    .split('\n')
    .map((line) => line.split(/\s+/).reverse().join(' '))
    .join('\n');
}

export function reverseSentences(str: string): string {
  return str
    .split('\n')
    .map((line) => {
      // Split sentences by punctuation followed by space
      const sentences = line.split(/(?<=[.!?])\s+/);
      if (sentences.length <= 1) return line.split('.').reverse().join('.');
      return sentences.reverse().join(' ');
    })
    .join('\n');
}

export function flipUpsideDown(str: string): string {
  return str
    .split('')
    .reverse()
    .map((char) => FLIP_MAP[char] || char)
    .join('');
}

export function reverseText(text: string, mode: ReverseMode): string {
  if (!text) return '';
  switch (mode) {
    case 'chars':
      return reverseCharacters(text);
    case 'words':
      return reverseWords(text);
    case 'sentences':
      return reverseSentences(text);
    case 'upsidedown':
      return flipUpsideDown(text);
    default:
      return text;
  }
}
