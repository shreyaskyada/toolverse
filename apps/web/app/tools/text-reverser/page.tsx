import React from 'react';
import { TextReverserTool } from '@/modules/tools/text-reverser/TextReverserTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Reverser | Toolverse',
  description: 'Reverse text in multiple ways: flip upside down, reverse words, sentences, or individual characters.',
};

export default function TextReverserPage() {
  return <TextReverserTool />;
}
