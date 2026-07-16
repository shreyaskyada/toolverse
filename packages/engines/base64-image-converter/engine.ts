import { MIME_EXTENSIONS } from './constants';

export function detectMimeType(bytes: Uint8Array): string {
  if (bytes.length < 4) return 'application/octet-stream';

  const b0 = bytes[0] ?? 0;
  const b1 = bytes[1] ?? 0;
  const b2 = bytes[2] ?? 0;
  const b3 = bytes[3] ?? 0;

  // PNG: 89 50 4E 47
  if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47) {
    return 'image/png';
  }
  // JPEG: FF D8 FF
  if (b0 === 0xFF && b1 === 0xD8 && b2 === 0xFF) {
    return 'image/jpeg';
  }
  // GIF: 47 49 46 38 ('GIF8')
  if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46 && b3 === 0x38) {
    return 'image/gif';
  }
  // WEBP: RIFF .... WEBP
  if (b0 === 0x52 && b1 === 0x49 && b2 === 0x46 && b3 === 0x46 &&
      (bytes[8] ?? 0) === 0x57 && (bytes[9] ?? 0) === 0x45 && (bytes[10] ?? 0) === 0x42 && (bytes[11] ?? 0) === 0x50) {
    return 'image/webp';
  }
  // BMP: 42 4D ('BM')
  if (b0 === 0x42 && b1 === 0x4D) {
    return 'image/bmp';
  }
  // PDF: 25 50 44 46 ('%PDF')
  if (b0 === 0x25 && b1 === 0x50 && b2 === 0x44 && b3 === 0x46) {
    return 'application/pdf';
  }
  // MP4: 'ftyp' at bytes 4-7
  if ((bytes[4] ?? 0) === 0x66 && (bytes[5] ?? 0) === 0x74 && (bytes[6] ?? 0) === 0x79 && (bytes[7] ?? 0) === 0x70) {
    if (bytes.length >= 12) {
      const brand = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0);
      if (brand === 'heic' || brand === 'heix' || brand === 'hevc' || brand === 'hevx' || brand === 'mif1' || brand === 'msf1') {
        return 'image/heic';
      }
    }
    return 'video/mp4';
  }
  // WEBM: 1A 45 DF A3
  if (b0 === 0x1A && b1 === 0x45 && b2 === 0xDF && b3 === 0xA3) {
    return 'video/webm';
  }
  // OGG: 4F 67 67 53 ('OggS')
  if (b0 === 0x4F && b1 === 0x67 && b2 === 0x67 && b3 === 0x53) {
    return 'video/ogg';
  }

  return 'application/octet-stream';
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function truncateText(val: string, maxLength = 1500): string {
  if (!val) return '';
  if (val.length <= maxLength) return val;
  return val.slice(0, maxLength) + `\n\n... [TRUNCATED - Total ${val.length.toLocaleString()} characters. Click 'Copy' to get the full code]`;
}

export function base64ToBlob(base64Str: string, defaultType = 'application/octet-stream'): { blob: Blob; mimeType: string; extension: string } {
  let cleanB64 = base64Str.trim();
  let mimeType = defaultType;

  if (cleanB64.startsWith('data:')) {
    const match = cleanB64.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1] ?? defaultType;
      cleanB64 = match[2] ?? '';
    }
  }

  cleanB64 = cleanB64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = cleanB64.length % 4;
  if (pad === 2) cleanB64 += '==';
  else if (pad === 3) cleanB64 += '=';
  cleanB64 = cleanB64.replace(/\s+/g, '');

  const raw = atob(cleanB64);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  const blob = new Blob([uInt8Array], { type: mimeType });

  const mapped = MIME_EXTENSIONS[mimeType];
  const extension = mapped ? mapped.ext : 'bin';

  return { blob, mimeType, extension };
}
