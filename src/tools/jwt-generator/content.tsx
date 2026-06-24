import React from "react";

export default function Content() {
  return (
    <>
      <p>
        A JSON Web Token (JWT) is a standard method for securely representing claims between two parties. JWTs are signed using a cryptographic key to ensure data integrity and authenticity.
      </p>
      <p className="font-semibold text-foreground mt-4">HMAC vs. Asymmetric Signing:</p>
      <ul className="list-disc pl-4 mt-2 space-y-2">
        <li>
          <strong>HMAC (HS256/384/512):</strong> A symmetric algorithm. Both the generator and verifier share the same secret key. It is lightweight and popular for internal microservices.
        </li>
        <li>
          <strong>RSA / ECDSA (RS256, ES256, etc.):</strong> An asymmetric algorithm. The generator signs the token with a <strong>Private Key</strong>, and the verifier validates it using a corresponding <strong>Public Key</strong>. Useful for public APIs where the secret key shouldn't be shared.
        </li>
      </ul>
      <p className="font-semibold text-foreground mt-4">Security Best Practices:</p>
      <ul className="list-disc pl-4 mt-2 space-y-2">
        <li>
          <strong>Never store secrets in public repos:</strong> Keep your signing keys secure and environment-specific.
        </li>
        <li>
          <strong>Keep lifetimes short:</strong> Set sensible expiration times (`exp` claim) to minimize the impact of leaked tokens.
        </li>
        <li>
          <strong>Validate always:</strong> Always verify signatures on your API gateway/server before trusting the token claims.
        </li>
      </ul>
    </>
  );
}
