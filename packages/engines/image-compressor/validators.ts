export function isValidImageType(mimeType: string): boolean {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'].includes(mimeType);
}
