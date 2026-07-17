import { useState, useCallback, useMemo } from 'react';
import { parseMarkdownToHtml } from './engine';
import { SAMPLE_TEXT } from './constants';

export function useMarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>('');

  const handleClear = useCallback(() => {
    setMarkdown('');
  }, []);

  const handleLoadSample = useCallback(() => {
    setMarkdown(SAMPLE_TEXT);
  }, []);

  const html = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  return {
    state: {
      markdown,
      html,
    },
    setMarkdown,
    handleClear,
    handleLoadSample,
  };
}
export type UseMarkdownEditorReturn = ReturnType<typeof useMarkdownEditor>;
