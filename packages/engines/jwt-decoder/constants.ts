export const TOOL_METADATA = {
  title: 'JWT Decoder & Signer Verifier',
  description: 'Decode, inspect, and verify JSON Web Tokens (JWT) client-side. Parse headers, payload claims, and verify signatures for HS256, RS256, and ES256.',
  slug: 'jwt-decoder',
  category: 'developer-tools',
  fullWidth: true,
};

export const TOOL_FAQS = [
  {
    question: 'Is my JWT token data safe on this site?',
    answer: 'Yes, absolutely. The decoding, claims parsing, and signature verification are processed 100% locally in your browser using client-side JavaScript. Your token, payload data, and secret keys never leave your machine.',
  },
  {
    question: 'What are the three parts of a JWT?',
    answer: 'A JSON Web Token is composed of three parts separated by dots (.): Header (specifies the algorithm and token type), Payload (contains the claims/data), and Signature (used to verify that the sender is who it says it is and to ensure the message wasn\'t changed along the way).',
  },
  {
    question: 'How does signature verification work in this tool?',
    answer: 'For HMAC algorithms (like HS256), you can input a text or Base64 secret. For RSA and ECDSA (like RS256 or ES256), you can paste a public key in PEM format. The browser uses the Web Crypto API to cryptographically verify if the signature matches the message header and payload.',
  },
  {
    question: 'Why does the tool show my token is expired?',
    answer: 'A JWT often contains an expiration claim (\'exp\') which is a Unix timestamp. The tool compares this timestamp with your computer\'s current time to determine if the token has expired and displays how much time remains or has elapsed since expiration.',
  },
];

export const TOOL_ABOUT = [
  'JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.',
  'Understanding JWT Structure:',
  '• Header: Typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 (HS256) or RSA SHA256 (RS256).',
  '• Payload: Contains the claims. Claims are statements about an entity (typically, the user) and additional data.',
  '• Signature: To create the signature part you must take the encoded header, the encoded payload, a secret (or public/private key), the algorithm specified in the header, and sign that.',
  'Standard Registered Claims:',
  '• iss (Issuer): Identifies the principal that issued the JWT.',
  '• sub (Subject): Identifies the principal that is the subject of the JWT (e.g. user ID).',
  '• aud (Audience): Identifies the recipients that the JWT is intended for.',
  '• exp (Expiration Time): The time on or after which the JWT must not be accepted.',
  '• nbf (Not Before): The time before which the JWT must not be accepted.',
  '• iat (Issued At): The time at which the JWT was issued.',
  '• jti (JWT ID): A unique identifier for the token (can prevent replay attacks).',
];

export const CLAIM_DESCRIPTIONS: Record<string, string> = {
  // Header
  alg: 'Algorithm: The cryptographic algorithm used to secure the token (e.g. HS256, RS256).',
  typ: 'Type: The type of the token (typically JWT).',
  kid: 'Key ID: A hint indicating which key was used to secure the JWT.',
  jku: 'JWK Set URL: A URI that refers to a resource for a set of JSON-encoded public keys.',
  jwk: 'JSON Web Key: The public key that corresponds to the key used to sign the token.',
  x5u: 'X.509 URL: A URI pointing to a set of X.509 public certificates.',
  x5c: 'X.509 Certificate Chain: The X.509 public key certificate or certificate chain.',
  x5t: 'X.509 Certificate SHA-1 Thumbprint: SHA-1 thumbprint of the X.509 certificate.',
  crit: 'Critical: An array of header names that the client must recognize and process.',
  
  // Registered Payload Claims
  iss: 'Issuer: Identifies the principal that issued the JWT.',
  sub: 'Subject: Identifies the principal that is the subject of the JWT (e.g. user ID).',
  aud: 'Audience: Identifies the recipients that the JWT is intended for.',
  exp: 'Expiration Time: The time on or after which the JWT must not be accepted.',
  nbf: 'Not Before: The time before which the JWT must not be accepted.',
  iat: 'Issued At: The time at which the JWT was issued.',
  jti: 'JWT ID: A unique identifier for the token (can prevent replay attacks).',
  
  // Common Private/Public Claims
  name: 'Name: The subject\'s full name.',
  given_name: 'Given Name: The subject\'s first or given name.',
  family_name: 'Family Name: The subject\'s surname or family name.',
  middle_name: 'Middle Name: The subject\'s middle name.',
  nickname: 'Nickname: The casual name for the subject.',
  preferred_username: 'Preferred Username: Shorthand name chosen by the subject.',
  profile: 'Profile: URL of the subject\'s profile page.',
  picture: 'Picture: URL of the subject\'s profile picture.',
  website: 'Website: URL of the subject\'s web page.',
  email: 'Email: The subject\'s email address.',
  email_verified: 'Email Verified: Indicates if the subject\'s email has been verified.',
  gender: 'Gender: The subject\'s gender.',
  birthdate: 'Birthdate: The subject\'s date of birth.',
  zoneinfo: 'Zone Info: The subject\'s time zone.',
  locale: 'Locale: The subject\'s locale (language/country).',
  phone_number: 'Phone Number: The subject\'s phone number.',
  phone_number_verified: 'Phone Number Verified: Indicates if the subject\'s phone number has been verified.',
  address: 'Address: The subject\'s preferred postal address.',
  updated_at: 'Updated At: The time the subject\'s information was last updated.',
  role: 'Role: The user authorization role.',
  roles: 'Roles: List of user authorization roles.',
  admin: 'Admin: Indicates if the user has administrative privileges.',
  scope: 'Scope: List of OAuth scopes granted to the token.',
  scp: 'Scope: Shortened notation for OAuth scopes.',
};
