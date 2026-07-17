export function isValidCount(count: number): boolean {
  return typeof count === 'number' && count > 0;
}
