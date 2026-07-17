import React from 'react';
import { ListRandomizerTool } from '@/modules/tools/list-randomizer/ListRandomizerTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Randomizer | Toolverse',
  description: 'Shuffle and randomize lists instantly. Great for generating random selections or unbiased ordering.',
};

export default function ListRandomizerPage() {
  return <ListRandomizerTool />;
}
