export function isValidBase64(str: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  if (trimmed.startsWith('data:')) {
    const match = trimmed.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) return false;
    return isValidRawBase64(match[2] ?? '');
  }
  return isValidRawBase64(trimmed);
}

function isValidRawBase64(str: string): boolean {
  const clean = str.replace(/\s+/g, '').replace(/[-_]/g, '').replace(/=/g, '');
  if (clean.length === 0) return false;
  return /^[A-Za-z0-9+/]+$/.test(clean);
}
