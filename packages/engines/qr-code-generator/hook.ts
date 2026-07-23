'use client';

import { useState, useEffect, useCallback } from 'react';
import { QrTabType, VCardDetails } from './types';
import { getFormattedQrText, generateQrDataUrl } from './engine';
import { DEFAULT_SIZE, DEFAULT_MARGIN, DEFAULT_FG_COLOR, DEFAULT_BG_COLOR } from './constants';

export function useQrCodeGenerator() {
  const [activeTab, setActiveTab] = useState<QrTabType>('url');

  // Input states
  const [url, setUrl] = useState('https://example.com');
  const [text, setText] = useState('');
  const [vCard, setVCard] = useState<VCardDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    website: '',
    company: '',
  });

  // Settings
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [margin, setMargin] = useState(DEFAULT_MARGIN);
  const [fgColor, setFgColor] = useState(DEFAULT_FG_COLOR);
  const [bgColor, setBgColor] = useState(DEFAULT_BG_COLOR);

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generating, setGenerating] = useState(false);

  const updateVCard = useCallback((fields: Partial<VCardDetails>) => {
    setVCard((prev) => ({ ...prev, ...fields }));
  }, []);

  // Effect to automatically generate/debounce QR code updates
  useEffect(() => {
    let active = true;
    const generate = async () => {
      setGenerating(true);
      try {
        const qrText = getFormattedQrText(activeTab, url, text, vCard);
        const dataUrl = await generateQrDataUrl(qrText, {
          size,
          margin,
          fgColor,
          bgColor,
        });
        if (active) {
          setQrDataUrl(dataUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setGenerating(false);
        }
      }
    };

    const timeoutId = setTimeout(generate, 300);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [activeTab, url, text, vCard, size, margin, fgColor, bgColor]);

  return {
    state: {
      activeTab,
      url,
      text,
      vCard,
      size,
      margin,
      fgColor,
      bgColor,
      qrDataUrl,
      generating,
    },
    setActiveTab,
    setUrl,
    setText,
    updateVCard,
    setSize,
    setMargin,
    setFgColor,
    setBgColor,
  };
}
