import { diffChars, diffWords, diffLines, Change } from 'diff';

export function computeDiff(
  original: string,
  modified: string,
  mode: 'chars' | 'words' | 'lines'
): Change[] {
  if (!original && !modified) {
    return [];
  }

  try {
    if (mode === 'chars') {
      return diffChars(original, modified);
    } else if (mode === 'words') {
      return diffWords(original, modified);
    } else {
      return diffLines(original, modified);
    }
  } catch (e) {
    console.error('Diff computation error:', e);
    return [];
  }
}
export type { Change };
