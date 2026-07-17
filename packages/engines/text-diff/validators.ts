export function isValidDiffMode(mode: string): boolean {
  return ['chars', 'words', 'lines'].includes(mode);
}
