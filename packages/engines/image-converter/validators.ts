export function isValidConvertFormat(mimeType: string): boolean {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'].includes(mimeType);
}
