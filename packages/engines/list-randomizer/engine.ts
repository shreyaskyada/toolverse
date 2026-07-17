import { DelimiterType } from './types';

export function getDelimiterPattern(type: DelimiterType): { split: RegExp | string; join: string } {
  switch (type) {
    case 'comma':
      return { split: /\s*,\s*/, join: ', ' };
    case 'semicolon':
      return { split: /\s*;\s*/, join: '; ' };
    case 'newline':
    default:
      return { split: /\r?\n/, join: '\n' };
  }
}

export function shuffleList(items: string[]): string[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i] as string;
    list[i] = list[j] as string;
    list[j] = temp;
  }
  return list;
}

export function randomizeList(text: string, delimiterType: DelimiterType): string {
  if (!text || !text.trim()) return '';
  const { split, join } = getDelimiterPattern(delimiterType);
  const items = text
    .split(split)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (items.length === 0) return '';
  const shuffled = shuffleList(items);
  return shuffled.join(join);
}
