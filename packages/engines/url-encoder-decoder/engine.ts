export function safeUrlEncode(str: string): string {
  try {
    return encodeURIComponent(str);
  } catch {
    return 'Error: Encoding failed.';
  }
}

export function safeUrlDecode(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch {
    return 'Error: Malformed URI component.';
  }
}
