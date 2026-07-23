import React from 'react';
import { PasswordGeneratorTool } from '@/modules/tools/password-generator/PasswordGeneratorTool';

export const metadata = {
  title: 'Password Generator - Jumpytools',
  description: 'Generate secure, random passwords with custom length, character sets, and a real-time strength indicator. 100% client-side.',
};

export default function Page() {
  return <PasswordGeneratorTool />;
}
