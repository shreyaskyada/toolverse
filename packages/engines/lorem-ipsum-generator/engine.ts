import { LOREM_WORDS } from './constants';

export const generateSentence = (wordCount: number) => {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    const randomWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    if (randomWord !== undefined) {
      words.push(randomWord);
    }
  }
  let sentence = words.join(' ');
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  return sentence;
};

export const generateParagraph = (sentenceCount: number) => {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    const wordsPerSentence = Math.floor(Math.random() * 10) + 5;
    sentences.push(generateSentence(wordsPerSentence));
  }
  return sentences.join(' ');
};

export const generateLoremText = (
  count: number,
  type: 'paragraphs' | 'sentences' | 'words',
  startWithLorem: boolean
): string => {
  let result = '';

  if (type === 'paragraphs') {
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
      const sentences = Math.floor(Math.random() * 4) + 4;
      let p = generateParagraph(sentences);
      if (i === 0 && startWithLorem) {
        const words = p.split(' ');
        words.splice(0, 5, 'Lorem', 'ipsum', 'dolor', 'sit', 'amet,');
        p = words.join(' ');
      }
      paragraphs.push(p);
    }
    result = paragraphs.join('\n\n');
  } else if (type === 'sentences') {
    const sentences = [];
    for (let i = 0; i < count; i++) {
      const wordsPerSentence = Math.floor(Math.random() * 10) + 5;
      sentences.push(generateSentence(wordsPerSentence));
    }
    result = sentences.join('\n\n');
    if (startWithLorem) {
      const firstLine = result.split('\n')[0];
      if (firstLine !== undefined) {
        const words = firstLine.split(' ');
        words.splice(0, 5, 'Lorem', 'ipsum', 'dolor', 'sit', 'amet,');
        const resultLines = result.split('\n');
        resultLines[0] = words.join(' ');
        result = resultLines.join('\n');
      }
    }
  } else if (type === 'words') {
    const words = [];
    for (let i = 0; i < count; i++) {
      const randomWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
      if (randomWord !== undefined) {
        words.push(randomWord);
      }
    }
    if (startWithLorem && count >= 5) {
      words.splice(0, 5, 'lorem', 'ipsum', 'dolor', 'sit', 'amet');
    }
    result = words.join(' ');
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
};
