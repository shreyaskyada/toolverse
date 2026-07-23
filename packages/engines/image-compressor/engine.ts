export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateResizedDimensions(
  originalW: number,
  originalH: number,
  targetW: number,
  targetH: number,
  lockRatio: boolean,
  changedDimension: 'width' | 'height'
): { width: number; height: number } {
  if (!lockRatio) {
    return { width: targetW, height: targetH };
  }

  const ratio = originalW / originalH;
  if (changedDimension === 'width') {
    return {
      width: targetW,
      height: Math.round(targetW / ratio),
    };
  } else {
    return {
      width: Math.round(targetH * ratio),
      height: targetH,
    };
  }
}
