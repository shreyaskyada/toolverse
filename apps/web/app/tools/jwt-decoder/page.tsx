import React from 'react';
import { JwtDecoderTool } from '@/modules/tools/jwt-decoder/JwtDecoderTool';

export const metadata = {
  title: 'JWT Decoder & Signer Verifier',
  description: 'Decode, inspect, and verify JSON Web Tokens (JWT) client-side.',
};

export default function Page() {
  return <JwtDecoderTool />;
}
