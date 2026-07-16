export function validateJwtStructure(token: string): string | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return 'JWT structure is invalid. A token must contain exactly 3 dot-separated parts (Header, Payload, Signature).';
  }
  return null;
}
