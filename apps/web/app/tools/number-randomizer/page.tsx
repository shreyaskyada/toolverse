import React from 'react';
import { NumberRandomizerTool } from '@/modules/tools/number-randomizer/NumberRandomizerTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Number Generator | Jumpytools',
  description: 'Generate truly random numbers or sequences instantly. Customize ranges, length, and formatting.',
};

export default function NumberRandomizerPage() {
  return <NumberRandomizerTool />;
}
