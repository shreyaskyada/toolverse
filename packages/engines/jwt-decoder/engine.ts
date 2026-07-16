import { ParseResult } from './types';

function getGlobalAtob(): (str: string) => string {
  if (typeof atob === 'function') {
    return atob;
  }
  if (typeof Buffer !== 'undefined') {
    return (str: string) => Buffer.from(str, 'base64').toString('binary');
  }
  throw new Error('Base64 decoding (atob) is not supported in this JS environment.');
}

function getGlobalBtoa(): (str: string) => string {
  if (typeof btoa === 'function') {
    return btoa;
  }
  if (typeof Buffer !== 'undefined') {
    return (str: string) => Buffer.from(str, 'binary').toString('base64');
  }
  throw new Error('Base64 encoding (btoa) is not supported in this JS environment.');
}

export function base64UrlDecode(str: string): string {
  const atobFn = getGlobalAtob();
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atobFn(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function pemToArrayBuffer(pem: string): ArrayBuffer {
  const atobFn = getGlobalAtob();
  const b64 = pem
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, '')
    .replace(/-----END [A-Z0-9 ]+-----/g, '')
    .replace(/\s+/g, '');
  const binary = atobFn(b64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export async function generateSampleJWT(secret: string, isExpired = false): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const iat = isExpired ? now - 7200 : now;
  const exp = isExpired ? now - 3600 : now + 3600;
  
  const payload = {
    sub: 'usr_1234567890',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    iat: iat,
    exp: exp,
    iss: 'toolverse.com',
    aud: 'api.toolverse.com'
  };
  
  const base64UrlEncode = (obj: unknown) => {
    const str = JSON.stringify(obj);
    const btoaFn = getGlobalBtoa();
    const b64 = btoaFn(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const headerB64 = base64UrlEncode(header);
  const payloadB64 = base64UrlEncode(payload);
  
  const gCrypto = (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined) || (typeof window !== 'undefined' ? window.crypto : undefined);
  if (!gCrypto || !gCrypto.subtle) {
    throw new Error('Web Cryptography Subtle API is not supported in this JS environment.');
  }

  const encoder = new TextEncoder();
  const secretData = encoder.encode(secret);
  const key = await gCrypto.subtle.importKey(
    'raw' as const,
    secretData as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' } as unknown as AlgorithmIdentifier,
    false,
    ['sign']
  );
  const signatureBuffer = await gCrypto.subtle.sign(
    'HMAC' as unknown as AlgorithmIdentifier,
    key,
    encoder.encode(`${headerB64}.${payloadB64}`) as unknown as BufferSource
  );
  
  const btoaFn = getGlobalBtoa();
  const signatureB64 = btoaFn(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

export async function verifySignature(
  token: string,
  secretOrKey: string,
  secretIsBase64 = false
): Promise<{ verified: boolean; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { verified: false, error: 'Invalid JWT structure' };
    }
    const headerB64 = parts[0] as string;
    const payloadB64 = parts[1] as string;
    const signatureB64 = parts[2] as string;

    const headerJson = JSON.parse(base64UrlDecode(headerB64));
    const alg = headerJson.alg;
    if (!alg || alg === 'none') {
      return { verified: false, error: "Algorithm 'none' does not support signature verification." };
    }

    const gCrypto = (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined) || (typeof window !== 'undefined' ? window.crypto : undefined);
    if (!gCrypto || !gCrypto.subtle) {
      return { verified: false, error: 'Web Cryptography Subtle API is not supported in this JS environment.' };
    }

    const encoder = new TextEncoder();
    const messageData = encoder.encode(`${headerB64}.${payloadB64}`);
    
    // Decode signature
    const signatureBase64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const atobFn = getGlobalAtob();
    const rawSignature = atobFn(signatureBase64);
    const signatureBuffer = new Uint8Array(rawSignature.length);
    for (let i = 0; i < rawSignature.length; i++) {
      signatureBuffer[i] = rawSignature.charCodeAt(i);
    }

    if (alg.startsWith('HS')) {
      const hashAlg = alg === 'HS384' ? 'SHA-384' : alg === 'HS512' ? 'SHA-512' : 'SHA-256';
      let keyData: Uint8Array;
      if (secretIsBase64) {
        const base64 = secretOrKey.replace(/-/g, '+').replace(/_/g, '/');
        const raw = atobFn(base64);
        keyData = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) {
          keyData[i] = raw.charCodeAt(i);
        }
      } else {
        keyData = encoder.encode(secretOrKey);
      }
      
      const key = await gCrypto.subtle.importKey(
        'raw' as const,
        keyData as unknown as BufferSource,
        { name: 'HMAC', hash: hashAlg } as unknown as AlgorithmIdentifier,
        false,
        ['verify']
      );
      const ok = await gCrypto.subtle.verify(
        'HMAC' as unknown as AlgorithmIdentifier,
        key,
        signatureBuffer as unknown as BufferSource,
        messageData as unknown as BufferSource
      );
      return { verified: ok };
    } else if (alg.startsWith('RS') || alg.startsWith('PS')) {
      const hashAlg = (alg === 'RS384' || alg === 'PS384') ? 'SHA-384' : (alg === 'RS512' || alg === 'PS512') ? 'SHA-512' : 'SHA-256';
      const keyBuffer = pemToArrayBuffer(secretOrKey);
      const keyName = alg.startsWith('RS') ? 'RSASSA-PKCS1-v1_5' : 'RSA-PSS';
      
      const key = await gCrypto.subtle.importKey(
        'spki' as const,
        keyBuffer as unknown as BufferSource,
        {
          name: keyName,
          hash: hashAlg,
        } as unknown as AlgorithmIdentifier,
        false,
        ['verify']
      );
      
      const params = alg.startsWith('RS') 
        ? 'RSASSA-PKCS1-v1_5' 
        : { name: 'RSA-PSS', saltLength: hashAlg === 'SHA-256' ? 32 : hashAlg === 'SHA-384' ? 48 : 64 };

      const ok = await gCrypto.subtle.verify(
        params as unknown as AlgorithmIdentifier,
        key,
        signatureBuffer as unknown as BufferSource,
        messageData as unknown as BufferSource
      );
      return { verified: ok };
    } else if (alg.startsWith('ES')) {
      const hashAlg = alg === 'ES384' ? 'SHA-384' : alg === 'ES512' ? 'SHA-512' : 'SHA-256';
      const keyBuffer = pemToArrayBuffer(secretOrKey);
      const namedCurve = alg === 'ES256' ? 'P-256' : alg === 'ES384' ? 'P-384' : 'P-521';
      
      const key = await gCrypto.subtle.importKey(
        'spki' as const,
        keyBuffer as unknown as BufferSource,
        {
          name: 'ECDSA',
          namedCurve: namedCurve,
        } as unknown as AlgorithmIdentifier,
        false,
        ['verify']
      );
      const ok = await gCrypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: hashAlg,
        } as unknown as AlgorithmIdentifier,
        key,
        signatureBuffer as unknown as BufferSource,
        messageData as unknown as BufferSource
      );
      return { verified: ok };
    } else {
      return { verified: false, error: `Unsupported algorithm: ${alg}` };
    }
  } catch (err) {
    return { verified: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function parseJwt(token: string): ParseResult {
  const trimmed = token.trim();
  if (!trimmed) {
    return { header: null, payload: null, signature: null, headerRaw: '', payloadRaw: '', signatureRaw: '', error: null };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    let header = null;
    let payload = null;
    const errorMsg = 'JWT structure is invalid. A token must contain exactly 3 dot-separated parts (Header, Payload, Signature).';
    
    try {
      if (parts[0]) header = JSON.parse(base64UrlDecode(parts[0]));
    } catch {
      // ignore
    }
    try {
      if (parts[1]) payload = JSON.parse(base64UrlDecode(parts[1]));
    } catch {
      // ignore
    }

    return {
      header,
      payload,
      signature: null,
      headerRaw: (parts[0] || '') as string,
      payloadRaw: (parts[1] || '') as string,
      signatureRaw: (parts[2] || '') as string,
      error: errorMsg,
    };
  }

  const headerB64 = parts[0] as string;
  const payloadB64 = parts[1] as string;
  const signatureB64 = parts[2] as string;
  let header: Record<string, unknown> | null = null;
  let payload: Record<string, unknown> | null = null;
  let error: string | null = null;

  try {
    header = JSON.parse(base64UrlDecode(headerB64));
  } catch (e) {
    error = `Failed to parse Header: ${e instanceof Error ? e.message : 'Invalid Base64 or JSON'}`;
  }

  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch (e) {
    if (!error) {
      error = `Failed to parse Payload: ${e instanceof Error ? e.message : 'Invalid Base64 or JSON'}`;
    }
  }

  return {
    header,
    payload,
    signature: signatureB64,
    headerRaw: headerB64,
    payloadRaw: payloadB64,
    signatureRaw: signatureB64,
    error,
  };
}

export function formatDuration(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  
  return parts.join(' ');
}
