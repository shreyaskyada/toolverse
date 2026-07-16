export function isValidTimestamp(str: string): boolean {
  if (!str) return false;
  const num = Number(str.trim());
  return !isNaN(num) && num >= 0;
}
