export function getRelativeTime(epochMs: number): string {
  const diff = epochMs - Date.now();
  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const prefix = diff < 0 ? '' : 'in ';
  const suffix = diff < 0 ? ' ago' : '';

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${prefix}${seconds} second${seconds === 1 ? '' : 's'}${suffix}`;
  if (minutes < 60) return `${prefix}${minutes} minute${minutes === 1 ? '' : 's'}${suffix}`;
  if (hours < 24) return `${prefix}${hours} hour${hours === 1 ? '' : 's'}${suffix}`;
  return `${prefix}${days} day${days === 1 ? '' : 's'}${suffix}`;
}

export function getLocalDateTimeString(): string {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
}
