function getGlobalAtob(): (str: string) => string {
  if (typeof atob === 'function') return atob;
  if (typeof Buffer !== 'undefined') {
    return (str: string) => Buffer.from(str, 'base64').toString('binary');
  }
  throw new Error('Base64 decoding is not supported in this environment.');
}

function getGlobalBtoa(): (str: string) => string {
  if (typeof btoa === 'function') return btoa;
  if (typeof Buffer !== 'undefined') {
    return (str: string) => Buffer.from(str, 'binary').toString('base64');
  }
  throw new Error('Base64 encoding is not supported in this environment.');
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

export function base64UrlEncode(str: string): string {
  const btoaFn = getGlobalBtoa();
  const b64 = btoaFn(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function signJWT(
  headerObj: Record<string, unknown>,
  payloadObj: Record<string, unknown>,
  secretOrKey: string,
  secretIsBase64: boolean
): Promise<string> {
  const alg = headerObj.alg;
  if (typeof alg !== 'string') {
    throw new Error('Header alg property must be a string');
  }

  const headerB64 = base64UrlEncode(JSON.stringify(headerObj));
  const payloadB64 = base64UrlEncode(JSON.stringify(payloadObj));
  const message = `${headerB64}.${payloadB64}`;

  if (alg === 'none') {
    return `${message}.`;
  }

  const gCrypto =
    (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined) ||
    (typeof window !== 'undefined' ? window.crypto : undefined);
  if (!gCrypto || !gCrypto.subtle) {
    throw new Error('Web Cryptography Subtle API is not supported in this environment.');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const atobFn = getGlobalAtob();
  const btoaFn = getGlobalBtoa();

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
      ['sign']
    );
    const sigBuffer = await gCrypto.subtle.sign(
      'HMAC' as unknown as AlgorithmIdentifier,
      key,
      data as unknown as BufferSource
    );
    const sigB64 = btoaFn(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return `${message}.${sigB64}`;
  } else if (alg.startsWith('RS') || alg.startsWith('PS')) {
    const hashAlg =
      alg === 'RS384' || alg === 'PS384' ? 'SHA-384'
        : alg === 'RS512' || alg === 'PS512' ? 'SHA-512'
          : 'SHA-256';
    const keyBuffer = pemToArrayBuffer(secretOrKey);
    const keyName = alg.startsWith('RS') ? 'RSASSA-PKCS1-v1_5' : 'RSA-PSS';

    const key = await gCrypto.subtle.importKey(
      'pkcs8' as const,
      keyBuffer as unknown as BufferSource,
      { name: keyName, hash: hashAlg } as unknown as AlgorithmIdentifier,
      false,
      ['sign']
    );

    const params =
      alg.startsWith('RS')
        ? ('RSASSA-PKCS1-v1_5' as unknown as AlgorithmIdentifier)
        : ({
            name: 'RSA-PSS',
            saltLength: hashAlg === 'SHA-256' ? 32 : hashAlg === 'SHA-384' ? 48 : 64,
          } as unknown as AlgorithmIdentifier);

    const sigBuffer = await gCrypto.subtle.sign(params, key, data as unknown as BufferSource);
    const sigB64 = btoaFn(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return `${message}.${sigB64}`;
  } else if (alg.startsWith('ES')) {
    const hashAlg = alg === 'ES384' ? 'SHA-384' : alg === 'ES512' ? 'SHA-512' : 'SHA-256';
    const keyBuffer = pemToArrayBuffer(secretOrKey);
    const namedCurve = alg === 'ES256' ? 'P-256' : alg === 'ES384' ? 'P-384' : 'P-521';

    const key = await gCrypto.subtle.importKey(
      'pkcs8' as const,
      keyBuffer as unknown as BufferSource,
      { name: 'ECDSA', namedCurve } as unknown as AlgorithmIdentifier,
      false,
      ['sign']
    );
    const sigBuffer = await gCrypto.subtle.sign(
      { name: 'ECDSA', hash: hashAlg } as unknown as AlgorithmIdentifier,
      key,
      data as unknown as BufferSource
    );
    const sigB64 = btoaFn(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return `${message}.${sigB64}`;
  } else {
    throw new Error(`Unsupported algorithm: ${alg}`);
  }
}
