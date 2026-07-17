import { NumberDelimiter, SortOrder } from './types';

export function getNumberDelimiter(delim: NumberDelimiter): string {
  switch (delim) {
    case 'comma':
      return ', ';
    case 'newline':
      return '\n';
    case 'space':
    default:
      return ' ';
  }
}

export function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean,
  sortBy: SortOrder,
  delimiter: NumberDelimiter
): string {
  if (min > max || count <= 0) return '';

  const rangeSize = max - min + 1;
  const numbers: number[] = [];

  if (!allowDuplicates) {
    const actualCount = Math.min(count, rangeSize);
    const pool = Array.from({ length: rangeSize }, (_, i) => min + i);
    for (let i = 0; i < actualCount; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const val = pool.splice(idx, 1)[0];
      if (val !== undefined) {
        numbers.push(val);
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      const num = Math.floor(Math.random() * rangeSize) + min;
      numbers.push(num);
    }
  }

  // Sort
  if (sortBy === 'asc') {
    numbers.sort((a, b) => a - b);
  } else if (sortBy === 'desc') {
    numbers.sort((a, b) => b - a);
  }

  const joinStr = getNumberDelimiter(delimiter);
  return numbers.join(joinStr);
}
