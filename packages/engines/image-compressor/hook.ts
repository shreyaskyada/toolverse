'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImageStats } from './types';
import { calculateResizedDimensions } from './engine';

export function useImageCompressor() {
  const [quality, setQuality] = useState<number>(0.8);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [stats, setStats] = useState<ImageStats | null>(null);

  // Clean up object URLs on unmount/re-load
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

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
        setOriginalFile(activeFile);
        if (originalUrl) URL.revokeObjectURL(originalUrl);
        setOriginalUrl(url);
        setOriginalDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setIsProcessing(false);
        resolve();
      };
      img.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Failed to load image file.'));
      };
      img.src = url;
    });
  }, [originalUrl]);

  const handleWidthChange = useCallback((newW: number) => {
    setWidth(newW);
    if (lockAspectRatio && originalDimensions.w > 0) {
      const resized = calculateResizedDimensions(
        originalDimensions.w,
        originalDimensions.h,
        newW,
        height,
        true,
        'width'
      );
      setHeight(resized.height);
    }
  }, [lockAspectRatio, originalDimensions, height]);

  const handleHeightChange = useCallback((newH: number) => {
    setHeight(newH);
    if (lockAspectRatio && originalDimensions.w > 0) {
      const resized = calculateResizedDimensions(
        originalDimensions.w,
        originalDimensions.h,
        width,
        newH,
        true,
        'height'
      );
      setWidth(resized.width);
    }
  }, [lockAspectRatio, originalDimensions, width]);

  const compressImage = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!originalFile || !originalUrl) {
        reject(new Error('No image loaded.'));
        return;
      }
      setIsProcessing(true);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width || img.naturalWidth;
        canvas.height = height || img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          reject(new Error('Failed to create canvas context.'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              reject(new Error('Compression failed.'));
              return;
            }
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            const compUrl = URL.createObjectURL(blob);
            setCompressedUrl(compUrl);

            setStats({
              name: originalFile.name,
              originalSize: originalFile.size,
              compressedSize: blob.size,
              originalWidth: originalDimensions.w,
              originalHeight: originalDimensions.h,
              compressedWidth: canvas.width,
              compressedHeight: canvas.height,
              mimeType: blob.type || originalFile.type,
            });
            setIsProcessing(false);
            resolve();
          },
          originalFile.type,
          quality
        );
      };
      img.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Image failed to load for compression.'));
      };
      img.src = originalUrl;
    });
  }, [originalFile, originalUrl, width, height, quality, compressedUrl, originalDimensions]);

  const handleClear = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalDimensions({ w: 0, h: 0 });
    setWidth(0);
    setHeight(0);
    setStats(null);
    setIsProcessing(false);
  }, [originalUrl, compressedUrl]);

  // Auto-run compression on configuration change
  useEffect(() => {
    if (originalUrl && originalFile && width > 0 && height > 0) {
      const timeout = setTimeout(() => {
        compressImage().catch(() => {});
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [originalUrl, originalFile, quality, width, height, compressImage]);

  return {
    state: {
      quality,
      width,
      height,
      lockAspectRatio,
      isProcessing,
      originalUrl,
      compressedUrl,
      stats,
      hasImage: !!originalUrl,
    },
    setQuality,
    setWidth: handleWidthChange,
    setHeight: handleHeightChange,
    setLockAspectRatio,
    loadFile,
    compressImage,
    handleClear,
  };
}
export type UseImageCompressorReturn = ReturnType<typeof useImageCompressor>;
