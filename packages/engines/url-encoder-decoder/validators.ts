export function isValidUrlEncoded(str: string): boolean {
  if (!str) return false;
  return /%[0-9a-fA-F]{2}/.test(str);
}
