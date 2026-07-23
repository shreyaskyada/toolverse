'use client';

import { useState, useCallback } from 'react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  formatRgb,
  formatHsl,
  formatCmyk,
} from './engine';

export function useColorConverter() {
  const [hex, setHex] = useState('#3B82F6');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Derived state
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const rgbString = formatRgb(rgb);
  const hslString = formatHsl(hsl);
  const cmykString = formatCmyk(cmyk);

  const handleHexChange = useCallback((value: string) => {
    let val = value;
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    if (val.length <= 7) {
      setHex(val);
    }
  }, []);

  const handleRgbChange = useCallback((value: string) => {
    const match = value.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = Math.min(255, Math.max(0, parseInt(match[0] || '0')));
      const g = Math.min(255, Math.max(0, parseInt(match[1] || '0')));
      const b = Math.min(255, Math.max(0, parseInt(match[2] || '0')));
      setHex(rgbToHex(r, g, b));
    }
  }, []);

  const handleHslChange = useCallback((value: string) => {
    const match = value.match(/\d+/g);
    if (match && match.length >= 3) {
      const h = Math.min(360, Math.max(0, parseInt(match[0] || '0')));
      const s = Math.min(100, Math.max(0, parseInt(match[1] || '0')));
      const l = Math.min(100, Math.max(0, parseInt(match[2] || '0')));
      const newRgb = hslToRgb(h, s, l);
      setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
  }, []);

  const triggerCopy = useCallback((format: string) => {
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  }, []);

  return {
    state: {
      hex,
      copiedFormat,
      rgb,
      hsl,
      cmyk,
      rgbString,
      hslString,
      cmykString,
    },
    setHex,
    handleHexChange,
    handleRgbChange,
    handleHslChange,
    triggerCopy,
  };
}
