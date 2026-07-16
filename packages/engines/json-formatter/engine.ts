export function checkDuplicateKeys(jsonStr: string): string | null {
  try {
    let index = 0;

    function skipWhitespace() {
      while (index < jsonStr.length && /\s/.test(jsonStr.charAt(index))) {
        index++;
      }
    }

    function parseValue(visitedKeysStack: Set<string>[]): void {
      skipWhitespace();
      if (index >= jsonStr.length) return;

      const char = jsonStr.charAt(index);
      if (char === '{') {
        index++; // skip '{'
        const currentKeys = new Set<string>();
        visitedKeysStack.push(currentKeys);

        while (true) {
          skipWhitespace();
          if (index >= jsonStr.length) {
            throw new Error('Unterminated object');
          }
          if (jsonStr.charAt(index) === '}') {
            index++;
            visitedKeysStack.pop();
            break;
          }
          
          const key = parseString();
          skipWhitespace();
          if (jsonStr.charAt(index) !== ':') {
            throw new Error('Expected ":" after key');
          }
          index++; // skip ':'
          
          if (currentKeys.has(key)) {
            throw new Error(`Duplicate key "${key}" found`);
          }
          currentKeys.add(key);

          parseValue(visitedKeysStack);
          skipWhitespace();

          if (jsonStr.charAt(index) === ',') {
            index++; // skip ','
          } else if (jsonStr.charAt(index) !== '}') {
            throw new Error('Expected "," or "}"');
          }
        }
      } else if (char === '[') {
        index++; // skip '['
        while (true) {
          skipWhitespace();
          if (index >= jsonStr.length) {
            throw new Error('Unterminated array');
          }
          if (jsonStr.charAt(index) === ']') {
            index++;
            break;
          }
          parseValue(visitedKeysStack);
          skipWhitespace();
          if (jsonStr.charAt(index) === ',') {
            index++;
          } else if (jsonStr.charAt(index) !== ']') {
            throw new Error('Expected "," or "]"');
          }
        }
      } else if (char === '"') {
        parseString();
      } else {
        while (index < jsonStr.length && !/[{}[\]\s,:]/.test(jsonStr.charAt(index))) {
          index++;
        }
      }
    }

    function parseString(): string {
      if (jsonStr.charAt(index) !== '"') {
        throw new Error('Expected string');
      }
      index++; // skip opening quote
      const start = index;
      while (index < jsonStr.length) {
        if (jsonStr.charAt(index) === '\\') {
          index += 2; // skip escape sequence
        } else if (jsonStr.charAt(index) === '"') {
          const str = jsonStr.slice(start, index);
          index++; // skip closing quote
          return str;
        } else {
          index++;
        }
      }
      throw new Error('Unterminated string');
    }

    parseValue([]);
    return null;
  } catch (err: unknown) {
    return err instanceof Error ? err.message : String(err);
  }
}

export function prettifyJson(input: string, spaces: number | 'tab'): string {
  try {
    const parsed = JSON.parse(input);
    const spaceArg = spaces === 'tab' ? '\t' : spaces;
    return JSON.stringify(parsed, null, spaceArg);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

export function parseJsonError(input: string): string | null {
  if (!input.trim()) return null;
  try {
    JSON.parse(input);
    
    // Check for duplicate keys
    const duplicateKeyError = checkDuplicateKeys(input);
    if (duplicateKeyError) {
      return duplicateKeyError;
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Invalid JSON';
  }
}

export function parseJsonSafely(input: string): unknown | null {
  if (!input.trim()) return null;
  try {
    if (checkDuplicateKeys(input) !== null) {
      return null;
    }
    return JSON.parse(input);
  } catch {
    return null;
  }
}

export function getJsonStats(input: string, parsed: unknown): { size: number; rootType: string } | null {
  if (!input.trim() || parsed === null) return null;
  return {
    size: new Blob([input]).size,
    rootType: Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' && parsed !== null ? 'Object' : typeof parsed
  };
}
