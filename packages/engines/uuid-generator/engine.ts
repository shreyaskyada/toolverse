import { UuidGeneratorOptions } from './types';

interface GlobalWithCrypto {
  crypto?: {
    randomUUID?: () => string;
  };
  performance?: {
    now?: () => number;
  };
}

export function generateV4(): string {
  const g = (typeof globalThis !== 'undefined' ? globalThis : {}) as unknown as GlobalWithCrypto;
  if (g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateV1(): string {
  let d = new Date().getTime();
  const g = (typeof globalThis !== 'undefined' ? globalThis : {}) as unknown as GlobalWithCrypto;
  const perf = g.performance;
  let d2 = (perf && typeof perf.now === 'function' && perf.now() * 1000) || 0;
  return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function formatUuid(uuid: string, options: Pick<UuidGeneratorOptions, 'uppercase' | 'hyphens'>): string {
  let result = uuid;
  if (!options.hyphens) {
    result = result.replace(/-/g, '');
  }
  return options.uppercase ? result.toUpperCase() : result.toLowerCase();
}

export function generateUuids(options: UuidGeneratorOptions): string[] {
  const qty = Math.max(1, Math.min(100, options.quantity));
  const results: string[] = [];
  
  for (let i = 0; i < qty; i++) {
    const rawUuid = options.version === '4' ? generateV4() : generateV1();
    results.push(formatUuid(rawUuid, options));
  }
  
  return results;
}
