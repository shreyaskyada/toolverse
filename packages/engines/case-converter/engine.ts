// Case Transformations
export const toUpperCase = (str: string) => str.toUpperCase();
export const toLowerCase = (str: string) => str.toLowerCase();

export const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const toSentenceCase = (str: string) => {
  return str
    .split('\n')
    .map((line) => {
      if (!line.trim()) return line;
      const lower = line.toLowerCase();
      return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + (p2 ? p2.toUpperCase() : ''));
    })
    .join('\n');
};

export const toCamelCase = (str: string) => {
  return str
    .split('\n')
    .map((line) => {
      if (!line.trim()) return line;
      const words = line.split(' ');
      return words
        .map((word, idx) => {
          if (!word) return word;
          if (idx === 0) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    })
    .join('\n');
};

export const toPascalCase = (str: string) => {
  return str
    .split('\n')
    .map((line) => {
      if (!line.trim()) return line;
      const words = line.split(' ');
      return words
        .map((word) => {
          if (!word) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    })
    .join('\n');
};

export const toSnakeCase = (str: string) => {
  return str
    .split('\n')
    .map((line) => {
      if (!line.trim()) return line;
      return line
        .replace(/[^a-zA-Z0-9\s-_]+/g, '')
        .trim()
        .toLowerCase()
        .replace(/[\s-_]+/g, '_');
    })
    .join('\n');
};

export const toKebabCase = (str: string) => {
  return str
    .split('\n')
    .map((line) => {
      if (!line.trim()) return line;
      return line
        .replace(/[^a-zA-Z0-9\s-_]+/g, '')
        .trim()
        .toLowerCase()
        .replace(/[\s-_]+/g, '-');
    })
    .join('\n');
};

export const toAlternatingCase = (str: string) => {
  const chars = str.split('');
  let upper = true;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c !== undefined && /[a-zA-Z]/.test(c)) {
      chars[i] = upper ? c.toLowerCase() : c.toUpperCase();
      upper = !upper;
    }
  }
  return chars.join('');
};

export const toInverseCase = (str: string) => {
  return str
    .split('')
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join('');
};

// Cleanups
export const collapseSpaces = (str: string) => {
  return str
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');
};

export const removeEmptyLines = (str: string) => {
  return str
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
};

export const removeDuplicateLines = (str: string) => {
  const lines = str.split('\n');
  return Array.from(new Set(lines)).join('\n');
};

export const stripHtml = (str: string) => {
  return str.replace(/<[^>]*>/g, '');
};
