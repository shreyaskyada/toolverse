import React from 'react';
import { JwtGeneratorTool } from '@/modules/tools/jwt-generator/JwtGeneratorTool';

export const metadata = {
  title: 'JWT Generator & Signer',
  description: 'Generate and sign JSON Web Tokens (JWT) client-side instantly.',
};

export default function Page() {
  return <JwtGeneratorTool />;
}
