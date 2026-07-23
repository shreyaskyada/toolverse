import React from 'react';
import { WordFrequencyAnalyzerTool } from '@/modules/tools/word-frequency-analyzer/WordFrequencyAnalyzerTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Frequency Analyzer | Jumpytools',
  description: 'Analyze text for keyword density, word frequencies, and find duplicate words instantly.',
};

export default function WordFrequencyAnalyzerPage() {
  return <WordFrequencyAnalyzerTool />;
}
