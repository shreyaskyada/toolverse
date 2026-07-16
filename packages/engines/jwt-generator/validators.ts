export function validateJson(input: string): string | null {
  try {
    JSON.parse(input);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : 'Invalid JSON syntax';
  }
}
