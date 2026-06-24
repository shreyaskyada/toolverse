export const faq = [
  {
    question: "Is it secure to generate tokens on this site?",
    answer: "Yes, 100%. The token generation and cryptographic signing are executed entirely client-side in your web browser. No keys, payloads, or secrets are sent to a server. Your inputs remain entirely local and private.",
  },
  {
    question: "Which signing algorithms are supported?",
    answer: "We support HMAC symmetric algorithms (HS256, HS384, HS512) and asymmetric public/private key algorithms like RSA (RS256, RS384, RS512) and ECDSA (ES256, ES384, ES512). An unsigned 'none' option is also available for basic testing.",
  },
  {
    question: "How do I sign with an RSA private key?",
    answer: "Select an RSA algorithm (e.g. RS256) and paste your private key in PKCS#8 PEM format (starts with -----BEGIN PRIVATE KEY-----). The browser uses the Web Crypto API to import this key and compute the signature.",
  },
  {
    question: "What format do standard claims require?",
    answer: "Standard claims like 'exp' (expiration), 'iat' (issued at), and 'nbf' (not before) are defined as numbers containing a Unix timestamp (seconds since Unix Epoch, January 1, 1970). Our helper builders handle this conversion automatically.",
  },
];
