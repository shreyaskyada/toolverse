export function isValidHex(hex: string): boolean {
  return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
}
