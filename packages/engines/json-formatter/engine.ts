export function prettifyJson(input: string, spaces: number | 'tab'): string {
  try {
    const parsed = JSON.parse(input);
    const spaceArg = spaces === 'tab' ? '\t' : spaces;
    return JSON.stringify(parsed, null, spaceArg);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

export function parseJsonError(input: string): string | null {
  if (!input.trim()) return null;
  try {
    JSON.parse(input);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Invalid JSON';
  }
}

export function parseJsonSafely(input: string): unknown | null {
  if (!input.trim()) return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

export function getJsonStats(input: string, parsed: unknown): { size: number; rootType: string } | null {
  if (!input.trim() || parsed === null) return null;
  return {
    size: new Blob([input]).size,
    rootType: Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' && parsed !== null ? 'Object' : typeof parsed
  };
}
