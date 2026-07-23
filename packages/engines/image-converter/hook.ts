'use client';

import { useState, useCallback, useEffect } from 'react';
import { ConversionStats } from './types';

export function useImageConverter() {
  const [targetFormat, setTargetFormat] = useState<string>('image/png');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [stats, setStats] = useState<ConversionStats | null>(null);

  // Clean up object URLs on unmount/re-load
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (targetUrl) URL.revokeObjectURL(targetUrl);
    };
  }, [sourceUrl, targetUrl]);

  const loadFile = useCallback((file: File): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      setIsProcessing(true);
      let activeFile = file;

      if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
        try {
          const heic2any = (await import('heic2any') as any).default;
          const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
          const blob = Array.isArray(result) ? result[0] : result;
          if (!blob) throw new Error('Converted blob is empty');
          activeFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
        } catch (err: any) {
          setIsProcessing(false);
          reject(new Error('HEIC conversion failed: ' + (err.message || String(err))));
          return;
        }
      }

      const url = URL.createObjectURL(activeFile);
      const img = new Image();
      img.onload = () => {
        setSourceFile(activeFile);
        if (sourceUrl) URL.revokeObjectURL(sourceUrl);
        setSourceUrl(url);
        setIsProcessing(false);
        resolve();
      };
      img.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Failed to load image file.'));
      };
      img.src = url;
    });
  }, [sourceUrl]);

  const convertImage = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!sourceFile || !sourceUrl) {
        reject(new Error('No image loaded.'));
        return;
      }
      setIsProcessing(true);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          reject(new Error('Failed to create canvas context.'));
          return;
        }

        // Fill background color white if target is JPEG (since JPEG doesn't support transparency)
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        // Convert
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              reject(new Error('Format conversion failed.'));
              return;
            }
            if (targetUrl) URL.revokeObjectURL(targetUrl);
            const compUrl = URL.createObjectURL(blob);
            setTargetUrl(compUrl);

            setStats({
              name: sourceFile.name,
              sourceSize: sourceFile.size,
              targetSize: blob.size,
              sourceType: sourceFile.type,
              targetType: blob.type || targetFormat,
            });
            setIsProcessing(false);
            resolve();
          },
          targetFormat,
          0.92
        );
      };
      img.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Image failed to load for conversion.'));
      };
      img.src = sourceUrl;
    });
  }, [sourceFile, sourceUrl, targetFormat, targetUrl]);

  const handleClear = useCallback(() => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (targetUrl) URL.revokeObjectURL(targetUrl);
    setSourceFile(null);
    setSourceUrl('');
    setTargetUrl('');
    setStats(null);
    setIsProcessing(false);
  }, [sourceUrl, targetUrl]);

  // Auto-run conversion on target format or source image change
  useEffect(() => {
    if (sourceUrl && sourceFile) {
      const timeout = setTimeout(() => {
        convertImage().catch(() => {});
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [sourceUrl, sourceFile, targetFormat, convertImage]);

  return {
    state: {
      targetFormat,
      isProcessing,
      sourceUrl,
      targetUrl,
      stats,
      hasImage: !!sourceUrl,
    },
    setTargetFormat,
    loadFile,
    convertImage,
    handleClear,
  };
}
export type UseImageConverterReturn = ReturnType<typeof useImageConverter>;
