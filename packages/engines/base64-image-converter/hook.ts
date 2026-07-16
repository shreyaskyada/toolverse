import { useState, useEffect, useRef, useCallback } from 'react';
import { Base64ImageConverterState } from './types';
import { MIME_EXTENSIONS } from './constants';
import { detectMimeType, base64ToBlob } from './engine';

const initialEncodeState = {
  encFile: null,
  encBase64: '',
  encDataUri: '',
  encLoading: false,
  encCopiedType: null,
  encDimensions: null,
  encDuration: null,
};

const initialDecodeState = {
  hasDecInput: false,
  decError: null,
  decPreviewUrl: null,
  decMimeType: 'application/octet-stream',
  decExtension: 'bin',
  decFileSize: 0,
  decBlob: null,
  decManualType: null,
  decDimensions: null,
  decDuration: null,
};

export function useBase64ImageConverter() {
  const [state, setState] = useState<Base64ImageConverterState>({
    ...initialEncodeState,
    ...initialDecodeState,
  });

  const decTextRef = useRef('');
  const decodeIdRef = useRef(0);
  const decInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-clears copy checks
  useEffect(() => {
    if (state.encCopiedType) {
      const t = setTimeout(() => {
        setState((prev) => ({ ...prev, encCopiedType: null }));
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [state.encCopiedType]);

  // Decode cleanup preview URIs
  useEffect(() => {
    return () => {
      if (state.decPreviewUrl) {
        URL.revokeObjectURL(state.decPreviewUrl);
      }
    };
  }, [state.decPreviewUrl]);

  // --- ENCODE HANDLERS ---
  const processEncFile = useCallback(async (file: File) => {
    let activeFile = file;
    const isHeic = activeFile.type === 'image/heic' ||
                   activeFile.type === 'image/heif' ||
                   activeFile.name.toLowerCase().endsWith('.heic') ||
                   activeFile.name.toLowerCase().endsWith('.heif');

    setState((prev) => ({
      ...prev,
      encLoading: true,
      encFile: null,
      encBase64: '',
      encDataUri: '',
      encDimensions: null,
      encDuration: null,
    }));

    if (isHeic) {
      try {
        // Dynamic import heic2any for HEIC support
        const heic2anyModule = await import('heic2any');
        const heic2any = heic2anyModule.default as any;
        const result = await heic2any({
          blob: activeFile,
          toType: 'image/jpeg',
          quality: 0.85,
        });
        const blob = Array.isArray(result) ? result[0] : result;
        activeFile = new File([blob], activeFile.name.replace(/\.[^/.]+$/, '') + '.jpg', {
          type: 'image/jpeg',
          lastModified: new Date().getTime(),
        });
      } catch (err: any) {
        console.error('HEIC conversion failed:', err);
        setState((prev) => ({ ...prev, encLoading: false }));
        throw new Error(err.message || String(err));
      }
    }

    const isImg = activeFile.type.startsWith('image/');
    const isVid = activeFile.type.startsWith('video/');

    if (!isImg && !isVid) {
      setState((prev) => ({ ...prev, encLoading: false }));
      throw new Error('Unsupported format. Please select an image or video file.');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const fullUri = e.target.result;
        const payload = fullUri.split(';base64,')[1] || '';

        setState((prev) => ({
          ...prev,
          encFile: activeFile,
          encDataUri: fullUri,
          encBase64: payload,
          encLoading: false,
        }));

        if (isImg) {
          const img = new Image();
          img.onload = () => {
            setState((prev) => ({
              ...prev,
              encDimensions: { width: img.width, height: img.height },
            }));
          };
          img.src = fullUri;
        } else if (isVid) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            setState((prev) => ({
              ...prev,
              encDimensions: { width: video.videoWidth, height: video.videoHeight },
              encDuration: video.duration,
            }));
          };
          video.src = URL.createObjectURL(activeFile);
        }
      }
    };
    reader.onerror = () => {
      setState((prev) => ({ ...prev, encLoading: false }));
      throw new Error('Failed to convert the file.');
    };
    reader.readAsDataURL(activeFile);
  }, []);

  const handleClearEnc = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ...initialEncodeState,
    }));
  }, []);

  const handleEncCopy = useCallback((type: 'raw' | 'uri' | 'html' | 'css') => {
    setState((prev) => {
      let text = '';
      if (type === 'raw') text = prev.encBase64;
      else if (type === 'uri') text = prev.encDataUri;
      else if (type === 'html') {
        text = prev.encFile?.type.startsWith('image/')
          ? `<img src="${prev.encDataUri}" alt="${prev.encFile?.name || 'Embedded Image'}" />`
          : `<video controls src="${prev.encDataUri}"></video>`;
      } else if (type === 'css') {
        text = `background-image: url("${prev.encDataUri}");`;
      }

      if (text) {
        navigator.clipboard.writeText(text);
        return { ...prev, encCopiedType: type };
      }
      return prev;
    });
  }, []);

  // --- DECODE HANDLERS ---
  const runDecode = useCallback(async (text: string, manualMimeType: string | null) => {
    const trimmed = text.trim();
    if (!trimmed) {
      handleClearDec();
      return;
    }

    decodeIdRef.current += 1;
    const currentId = decodeIdRef.current;

    try {
      let cleanB64 = trimmed;
      let parsedMime = '';

      if (cleanB64.startsWith('data:')) {
        const match = cleanB64.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          parsedMime = match[1] ?? '';
          cleanB64 = match[2] ?? '';
        }
      }

      if (/[-_]/.test(cleanB64)) {
        cleanB64 = cleanB64.replace(/-/g, '+').replace(/_/g, '/');
      }

      const pad = cleanB64.length % 4;
      if (pad === 2) cleanB64 += '==';
      else if (pad === 3) cleanB64 += '=';

      if (/[\s\r\n]/.test(cleanB64)) {
        cleanB64 = cleanB64.replace(/[\s\r\n]+/g, '');
      }

      if (!parsedMime) {
        const sampleB64 = cleanB64.slice(0, 32);
        try {
          const sampleRaw = atob(sampleB64);
          const sampleBytes = new Uint8Array(sampleRaw.length);
          for (let i = 0; i < sampleRaw.length; ++i) {
            sampleBytes[i] = sampleRaw.charCodeAt(i);
          }
          parsedMime = detectMimeType(sampleBytes);
        } catch {
          parsedMime = 'application/octet-stream';
        }
      }

      if (currentId !== decodeIdRef.current) return;

      const finalMime = manualMimeType || parsedMime;
      const mapped = MIME_EXTENSIONS[finalMime] || { mime: finalMime, ext: 'bin' };

      let fileBlob: Blob;
      try {
        const dataUrl = trimmed.startsWith('data:')
          ? trimmed
          : `data:${finalMime};base64,${cleanB64}`;
        const res = await fetch(dataUrl);
        fileBlob = await res.blob();
      } catch {
        const raw = atob(cleanB64);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        fileBlob = new Blob([uInt8Array], { type: finalMime });
      }

      if (currentId !== decodeIdRef.current) return;

      let previewBlob = fileBlob;
      let previewMime = mapped.mime;
      let previewExt = mapped.ext;

      const isHeic = finalMime === 'image/heic' || finalMime === 'image/heif';

      if (isHeic) {
        try {
          const heic2anyModule = await import('heic2any');
          const heic2any = heic2anyModule.default as any;
          const converted = await heic2any({
            blob: fileBlob,
            toType: 'image/jpeg',
            quality: 0.85,
          });
          if (currentId !== decodeIdRef.current) return;
          previewBlob = Array.isArray(converted) ? converted[0] : converted;
          previewMime = 'image/jpeg';
          previewExt = 'jpg';
        } catch (heicErr) {
          console.error('HEIC decoding preview failed:', heicErr);
        }
      }

      const objUrl = URL.createObjectURL(previewBlob);

      if (currentId !== decodeIdRef.current) {
        URL.revokeObjectURL(objUrl);
        return;
      }

      setState((prev) => {
        if (prev.decPreviewUrl) {
          URL.revokeObjectURL(prev.decPreviewUrl);
        }
        return {
          ...prev,
          decBlob: fileBlob,
          decPreviewUrl: objUrl,
          decMimeType: previewMime,
          decExtension: previewExt,
          decFileSize: fileBlob.size,
          decError: null,
          decDimensions: null,
          decDuration: null,
        };
      });

      const isImg = previewMime.startsWith('image/');
      const isVid = previewMime.startsWith('video/');

      if (isImg) {
        const img = new Image();
        img.onload = () => {
          if (currentId === decodeIdRef.current) {
            setState((prev) => ({
              ...prev,
              decDimensions: { width: img.width, height: img.height },
            }));
          }
        };
        img.src = objUrl;
      } else if (isVid) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          if (currentId === decodeIdRef.current) {
            setState((prev) => ({
              ...prev,
              decDimensions: { width: video.videoWidth, height: video.videoHeight },
              decDuration: video.duration,
            }));
          }
        };
        video.src = objUrl;
      }
    } catch {
      if (currentId === decodeIdRef.current) {
        setState((prev) => {
          if (prev.decPreviewUrl) {
            URL.revokeObjectURL(prev.decPreviewUrl);
          }
          return {
            ...prev,
            decError: 'Invalid Base64 format or corrupt content payload.',
            decBlob: null,
            decPreviewUrl: null,
            decDimensions: null,
            decDuration: null,
          };
        });
      }
    }
  }, []);

  const handleClearDec = useCallback(() => {
    decodeIdRef.current += 1;
    if (decInputRef.current) {
      decInputRef.current.value = '';
    }
    decTextRef.current = '';
    setState((prev) => {
      if (prev.decPreviewUrl) {
        URL.revokeObjectURL(prev.decPreviewUrl);
      }
      return {
        ...prev,
        ...initialDecodeState,
      };
    });
  }, []);

  const setDecManualType = useCallback((type: string | null) => {
    setState((prev) => ({ ...prev, decManualType: type }));
  }, []);

  const handleDecodeInputChange = useCallback((val: string) => {
    decTextRef.current = val;
    setState((prev) => ({
      ...prev,
      hasDecInput: !!val.trim(),
      decManualType: null,
    }));
    runDecode(val, null);
  }, [runDecode]);

  return {
    state,
    decInputRef,
    processEncFile,
    handleClearEnc,
    handleEncCopy,
    handleClearDec,
    setDecManualType,
    handleDecodeInputChange,
    runDecode,
  };
}
export type UseBase64ImageConverterReturn = ReturnType<typeof useBase64ImageConverter>;
