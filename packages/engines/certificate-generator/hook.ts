'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { certificateCategories } from './constants';
import { TemplateType, drawClassic, drawModern, drawElegant } from './engine';

export function useCertificateGenerator() {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigFileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState('Education');
  const [certType, setCertType] = useState(certificateCategories['Education']?.[0] || '');

  const [customTitle, setCustomTitle] = useState('');
  const [recipient, setRecipient] = useState('Jane Doe');
  const [organization, setOrganization] = useState('Global Tech University');
  const [achievement, setAchievement] = useState('Advanced Web Development Program');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0] || '');
  const [issuer, setIssuer] = useState('John Smith');
  const [template, setTemplate] = useState<TemplateType>('classic');

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [sigImageUrl, setSigImageUrl] = useState<string | null>(null);
  const [sigImageObj, setSigImageObj] = useState<HTMLImageElement | null>(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);

  const displayTitle = customTitle || certType.toUpperCase();

  // Load Logo Image
  useEffect(() => {
    if (logoUrl) {
      const img = new Image();
      img.onload = () => setLogoImage(img);
      img.src = logoUrl;
    } else {
      setLogoImage(null);
    }
  }, [logoUrl]);

  // Load Signature Image
  useEffect(() => {
    if (sigImageUrl) {
      const img = new Image();
      img.onload = () => setSigImageObj(img);
      img.src = sigImageUrl;
    } else {
      setSigImageObj(null);
    }
  }, [sigImageUrl]);

  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSigUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setSigImageUrl(event.target?.result as string);
      setHasSignature(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    setSigImageUrl(null);
    setSigImageObj(null);
    if (sigFileInputRef.current) {
      sigFileInputRef.current.value = '';
    }
  }, []);

  const drawCertificate = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (template === 'classic') {
      drawClassic(ctx, width, height, displayTitle, recipient, achievement, organization, date, logoImage);
    } else if (template === 'modern') {
      drawModern(ctx, width, height, displayTitle, recipient, achievement, organization, date, logoImage);
    } else if (template === 'elegant') {
      drawElegant(ctx, width, height, displayTitle, recipient, achievement, organization, date, logoImage);
    }

    // Draw Signature Image if available, otherwise draw typed name
    if (sigImageObj) {
      const sigRatio = sigImageObj.width / sigImageObj.height;
      const drawHeight = 75;
      const drawWidth = drawHeight * sigRatio;
      ctx.drawImage(sigImageObj, width - 250 - drawWidth / 2, 470, drawWidth, drawHeight);
    } else if (hasSignature && sigCanvasRef.current) {
      ctx.drawImage(sigCanvasRef.current, width - 350, 470, 200, 75);
    } else {
      ctx.textAlign = 'center';
      ctx.font = 'italic 28px serif';
      ctx.fillStyle = template === 'elegant' ? '#4338ca' : '#0f172a';
      ctx.fillText(issuer || '[Issuer Name]', width - 250, 520);
    }
  }, [
    recipient,
    displayTitle,
    achievement,
    organization,
    date,
    issuer,
    template,
    hasSignature,
    logoImage,
    sigImageObj,
  ]);

  // Redraw certificate whenever dependent properties update
  useEffect(() => {
    drawCertificate();
  }, [drawCertificate]);

  return {
    state: {
      category,
      certType,
      customTitle,
      recipient,
      organization,
      achievement,
      date,
      issuer,
      template,
      logoUrl,
      isDrawing,
      hasSignature,
      sigImageUrl,
      openCategory,
      openType,
      displayTitle,
    },
    refs: {
      mainCanvasRef,
      sigCanvasRef,
      fileInputRef,
      sigFileInputRef,
    },
    setCategory,
    setCertType,
    setCustomTitle,
    setRecipient,
    setOrganization,
    setAchievement,
    setDate,
    setIssuer,
    setTemplate,
    setLogoUrl,
    setIsDrawing,
    setHasSignature,
    setSigImageUrl,
    setOpenCategory,
    setOpenType,
    handleLogoUpload,
    handleSigUpload,
    clearSignature,
    drawCertificate,
  };
}
