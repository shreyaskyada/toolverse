'use client';

import React from 'react';
import {
  useImageCompressor,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  formatBytes,
} from '@repo/engines/image-compressor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Trash2, Sliders, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function ImageCompressorTool() {
  const {
    state,
    setQuality,
    setWidth,
    setHeight,
    setLockAspectRatio,
    loadFile,
    handleClear,
  } = useImageCompressor();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.promise(loadFile(e.target.files[0]), {
        loading: 'Loading image asset...',
        success: 'Image loaded successfully!',
        error: 'Failed to parse image file.',
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      toast.promise(loadFile(e.dataTransfer.files[0]), {
        loading: 'Loading image asset...',
        success: 'Image loaded successfully!',
        error: 'Failed to parse image file.',
      });
    }
  };

  const handleDownload = () => {
    if (!state.compressedUrl || !state.stats) return;
    const link = document.createElement('a');
    link.href = state.compressedUrl;
    link.download = `optimized_${state.stats.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Optimized image saved!');
  };

  const reductionPercentage = state.stats
    ? (((state.stats.originalSize - state.stats.compressedSize) / state.stats.originalSize) * 100).toFixed(1)
    : '0';

  const sourceFmtLabel = state.stats?.mimeType.split('/')[1]?.toUpperCase() || 'PNG';

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        {!state.hasImage ? (
          /* Dropzone */
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !state.isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[300px] relative ${
              isDragOver
                ? 'border-primary bg-primary/5 scale-[0.99]'
                : 'border-border hover:border-primary/50 bg-card hover:bg-muted/10'
            }`}
          >
            {state.isProcessing && (
              <div className="absolute inset-0 bg-background/80 flex flex-col gap-2.5 items-center justify-center z-10 rounded-xl backdrop-blur-xs">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-foreground">Processing Image…</span>
                <span className="text-xs text-muted-foreground">This may take a moment for HEIC files</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.heic"
              className="hidden"
            />
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Upload an Image to Compress</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Supports JPEG, PNG, WebP, GIF, BMP. Drag & drop or click to browse.
              </p>
            </div>
          </div>
        ) : (
          /* Active Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Image Panels (Left + Middle Column) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Original View */}
                <Card className="border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Original
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground">
                        {sourceFmtLabel}
                      </span>
                    </h4>
                    {state.stats && (
                      <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                        {formatBytes(state.stats.originalSize)}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center min-h-[260px] max-h-[360px] bg-muted/10">
                    <img
                      src={state.originalUrl}
                      alt="Original"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                    />
                  </div>
                  <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                    {state.stats ? state.stats.originalWidth : state.width} × {state.stats ? state.stats.originalHeight : state.height} px
                  </div>
                </Card>

                {/* Optimized View */}
                <Card className="border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Optimized
                      {state.stats && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          -{reductionPercentage}%
                        </span>
                      )}
                    </h4>
                    {state.stats && (
                      <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                        {formatBytes(state.stats.compressedSize)}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center min-h-[260px] max-h-[360px] bg-muted/10 relative">
                    {state.isProcessing && (
                      <div className="absolute inset-0 bg-background/60 flex flex-col gap-2 items-center justify-center z-10 backdrop-blur-xs">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <span className="text-xs font-medium text-muted-foreground">Compressing…</span>
                      </div>
                    )}
                    {state.compressedUrl && (
                      <img
                        src={state.compressedUrl}
                        alt="Optimized"
                        className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                      />
                    )}
                  </div>
                  <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                    {state.stats ? state.stats.compressedWidth : state.width} × {state.stats ? state.stats.compressedHeight : state.height} px
                  </div>
                </Card>

              </div>

              {/* Action Toolbar */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  {/* Upload New Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          loadFile(e.target.files[0]).catch(() => {});
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      title=""
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-xs gap-1.5 h-9 font-medium pointer-events-none"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload New Image
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    title="Clear workspace"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 cursor-pointer animate-none"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!state.compressedUrl || state.isProcessing}
                  className="font-medium cursor-pointer text-xs gap-1.5 h-9"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Optimized Image
                </Button>
              </div>
            </div>

            {/* Sidebar Settings Panel */}
            <Card className="border border-border/80 bg-card shadow-xs self-start">
              <div className="px-5 py-4 border-b border-border/60">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sliders className="h-4 w-4 text-primary" />
                  Settings
                </h3>
              </div>
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Quality Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">Compression Quality</span>
                    <span className="text-xs font-mono font-bold text-primary">
                      {Math.round(state.quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={state.quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                  />
                </div>

                {/* Size Dimensions */}
                <div className="flex flex-col gap-3 border-t border-border/40 pt-4 mt-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    Resize Dimensions
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Width (px)</span>
                      <Input
                        type="number"
                        value={state.width || ''}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Height (px)</span>
                      <Input
                        type="number"
                        value={state.height || ''}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  {/* Lock Aspect Ratio Custom Switch */}
                  <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-lg border border-border/40 mt-1">
                    <span className="text-xs font-semibold text-foreground">Lock Aspect Ratio</span>
                    <button
                      onClick={() => setLockAspectRatio(!state.lockAspectRatio)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-all cursor-pointer relative ${
                        state.lockAspectRatio
                          ? 'bg-primary'
                          : 'bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                          state.lockAspectRatio ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </ToolLayout>
  );
}
export default ImageCompressorTool;
