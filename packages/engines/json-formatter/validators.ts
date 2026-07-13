export function isValidJson(input: string): boolean {
  if (!input.trim()) return false;
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}

export function validateJsonSize(input: string, maxSize: number): boolean {
  return input.length <= maxSize;
}
