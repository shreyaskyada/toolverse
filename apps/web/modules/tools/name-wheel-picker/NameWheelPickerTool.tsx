'use client';

import React from 'react';
import {
  useNameWheelPicker,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/name-wheel-picker';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Trophy, RotateCw, X } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function NameWheelPickerTool() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      zIndex: 100,
    });
  };

  const { state, refs, setInput, setShowWinnerModal, spinWheel } =
    useNameWheelPicker(triggerConfetti);

  const handleClear = () => {
    setInput('');
    toast.success('Names cleared');
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Panel (Left) */}
        <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-6">
          <Card className="border border-border/80 bg-card shadow-xs h-full flex flex-col">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Names List
              </h3>
              {state.input && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                </Button>
              )}
            </div>
            <CardContent className="p-5 flex-1 flex flex-col gap-4">
              <label className="text-xs font-bold text-muted-foreground">
                Enter Names (one per line)
              </label>
              <Textarea
                value={state.input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter names here..."
                className="w-full flex-1 min-h-[280px] resize-none font-medium leading-relaxed"
              />

              <div className="flex justify-between text-xs text-muted-foreground font-semibold px-1">
                <span>Total Names: {state.names.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wheel & Animation Panel (Right) */}
        <div className="flex-grow flex flex-col items-center justify-center relative">
          <Card className="border border-border/80 bg-card shadow-sm w-full flex flex-col items-center p-6 gap-6 relative overflow-hidden">
            {/* Spinning Wheel */}
            <div className="relative aspect-square w-full max-w-[420px] flex items-center justify-center">
              {/* Pointer indicator */}
              <div className="absolute top-0 z-30 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-foreground drop-shadow-md" />

              <canvas
                ref={refs.canvasRef}
                width={500}
                height={500}
                className="w-full h-full max-w-full rounded-full shadow-2xl bg-white border border-border/50 ring-4 ring-muted/30"
              />

              {/* Center button overlays */}
              <button
                onClick={spinWheel}
                disabled={state.isSpinning || state.names.length <= 1}
                className="absolute w-28 h-28 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xl transition-all hover:scale-105 active:scale-95 border-4 border-background z-20"
              >
                <RotateCw
                  className={`h-6 w-6 ${state.isSpinning ? 'animate-spin' : ''}`}
                />
                <span className="text-xs font-black tracking-widest uppercase">
                  SPIN
                </span>
              </button>
            </div>

            {/* Spin Instructions */}
            <div className="text-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {state.names.length <= 1
                  ? 'Add at least 2 names to start spinning'
                  : 'Click SPIN or press the wheel to select a random name!'}
              </span>
            </div>
          </Card>

          {/* Winner Announcement Dialog Backdrop */}
          {state.showWinnerModal && state.winner && (
            <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur-md flex items-center justify-center p-6 rounded-2xl animate-in fade-in duration-300">
              <div className="bg-card border border-border max-w-md w-full p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 text-center relative animate-in zoom-in-95 duration-300">
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Trophy className="h-8 w-8 text-amber-500 animate-bounce" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    We Have a Winner!
                  </span>
                  <h3 className="text-3xl font-black text-foreground tracking-tight break-all px-2">
                    {state.winner}
                  </h3>
                </div>

                <Button
                  onClick={spinWheel}
                  className="w-full h-11 font-bold mt-2 cursor-pointer"
                >
                  Spin Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
export default NameWheelPickerTool;
