import React from 'react';
import { UuidGeneratorTool } from '@/modules/tools/uuid-generator/UuidGeneratorTool';

export const metadata = {
  title: 'UUID Generator - Toolverse',
  description: 'Generate unique UUID (v4 and v1) strings instantly. Configure count, casing, and hyphens with local browser execution.',
};

export default function Page() {
  return <UuidGeneratorTool />;
}
