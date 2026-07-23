'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { parseNames, easeOutQuart, getPointerIndex } from './engine';
import { DEFAULT_NAMES, COLORS } from './constants';

export function useNameWheelPicker(onSpinComplete?: (winnerName: string) => void) {
  const [input, setInput] = useState(DEFAULT_NAMES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const spinAnimationFrame = useRef<number | null>(null);

  const names = parseNames(input);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '600 40px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add names to spin!', centerX, centerY);
      return;
    }

    const arc = (2 * Math.PI) / names.length;

    for (let i = 0; i < names.length; i++) {
      const angle = rotationRef.current + i * arc;

      // Draw slice segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = COLORS[i % COLORS.length] || '#ccc';
      ctx.fill();

      // Slice borders
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      // Text labels
      ctx.save();
      ctx.translate(
        centerX + Math.cos(angle + arc / 2) * (radius - 50),
        centerY + Math.sin(angle + arc / 2) * (radius - 50)
      );
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      const fontSize = names.length > 20 ? 20 : names.length > 12 ? 28 : 36;
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      let displayName = names[i] || '';
      if (displayName.length > 18) {
        displayName = displayName.substring(0, 16) + '...';
      }

      ctx.fillText(displayName, 0, 0);
      ctx.restore();
    }

    // Central overlay circles
    ctx.beginPath();
    ctx.arc(centerX, centerY, 65, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fill();
  }, [names]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const finishSpin = useCallback(() => {
    if (names.length === 0) return;
    const winningIndex = getPointerIndex(rotationRef.current, names.length);
    const winningName = names[winningIndex] || '';

    setWinner(winningName);
    setShowWinnerModal(true);

    if (onSpinComplete) {
      onSpinComplete(winningName);
    }
  }, [names, onSpinComplete]);

  const spinWheel = useCallback(() => {
    if (names.length <= 1) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    const spinDuration = 4000 + Math.random() * 2000;
    const startRotation = rotationRef.current;
    const totalRotation = startRotation + Math.PI * 2 * (5 + Math.random() * 5);

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easedProgress = easeOutQuart(progress);

      rotationRef.current = startRotation + (totalRotation - startRotation) * easedProgress;
      drawWheel();

      if (progress < 1) {
        spinAnimationFrame.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        finishSpin();
      }
    };

    spinAnimationFrame.current = requestAnimationFrame(animate);
  }, [names, isSpinning, drawWheel, finishSpin]);

  useEffect(() => {
    return () => {
      if (spinAnimationFrame.current) {
        cancelAnimationFrame(spinAnimationFrame.current);
      }
    };
  }, []);

  return {
    state: {
      input,
      isSpinning,
      winner,
      showWinnerModal,
      names,
    },
    refs: {
      canvasRef,
    },
    setInput,
    setShowWinnerModal,
    spinWheel,
    drawWheel,
  };
}
