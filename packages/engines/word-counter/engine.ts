import { STOP_WORDS } from './constants';
import { DensityItem } from './types';

export function getWordDensity(text: string, excludeStopWords: boolean): { densityArray: DensityItem[]; targetCount: number } {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^\d+$/.test(w));

  const freqMap: Record<string, number> = {};
  let targetCount = 0;

  words.forEach((word) => {
    if (excludeStopWords && STOP_WORDS.has(word)) return;
    freqMap[word] = (freqMap[word] || 0) + 1;
    targetCount++;
  });

  const densityArray = Object.entries(freqMap)
    .map(([word, freq]) => ({
      word,
      freq,
      percentage: targetCount > 0 ? ((freq / targetCount) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.freq - a.freq)
    .slice(0, 8);

  return { densityArray, targetCount };
}
