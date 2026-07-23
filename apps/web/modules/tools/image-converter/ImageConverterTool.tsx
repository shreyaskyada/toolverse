'use client';

import React from 'react';
import {
  useImageConverter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  TARGET_FORMATS,
  formatBytes,
} from '@repo/engines/image-converter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Trash2, Loader2, Image as ImageIcon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function ImageConverterTool() {
  const {
    state,
    setTargetFormat,
    loadFile,
    handleClear,
  } = useImageConverter();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [originalDimensions, setOriginalDimensions] = React.useState({ w: 0, h: 0 });

  const handleFileChange = (file: File) => {
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';
    toast.promise(
      loadFile(file),
      {
        loading: isHeic ? 'Converting HEIC to JPEG...' : 'Loading image asset...',
        success: isHeic ? 'HEIC converted successfully!' : 'Image loaded successfully!',
        error: isHeic ? 'HEIC conversion failed.' : 'Failed to parse image file.',
      }
    );
  };

  React.useEffect(() => {
    if (state.sourceUrl) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      };
      img.src = state.sourceUrl;
    } else {
      setOriginalDimensions({ w: 0, h: 0 });
    }
  }, [state.sourceUrl]);

  const handleDownload = () => {
    if (!state.targetUrl || !state.stats) return;
    const matched = TARGET_FORMATS.find((f) => f.value === state.targetFormat);
    const ext = matched ? matched.ext : 'png';
    const originalNameWithoutExt = state.stats.name.substring(0, state.stats.name.lastIndexOf('.')) || state.stats.name;

    const link = document.createElement('a');
    link.href = state.targetUrl;
    link.download = `${originalNameWithoutExt}_converted.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Converted image saved!');
  };

  const targetFmtInfo = TARGET_FORMATS.find((f) => f.value === state.targetFormat);
  const sourceFmtLabel = state.stats?.sourceType.split('/')[1]?.toUpperCase() || 'PNG';

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
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]); }}
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
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/*,.heic"
              className="hidden"
            />
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Upload an Image to Convert</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Supports JPEG, PNG, WebP, BMP. Drag & drop or click to browse.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {TARGET_FORMATS.map((f) => (
                <Badge key={f.value} variant="outline" className="text-[10px] font-bold px-2 py-0.5">
                  {f.label}
                </Badge>
              ))}
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
                        {formatBytes(state.stats.sourceSize)}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center min-h-[260px] max-h-[360px] bg-muted/10">
                    <img
                      src={state.sourceUrl}
                      alt="Original"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                    />
                  </div>
                  <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                    {originalDimensions.w} × {originalDimensions.h} px
                  </div>
                </Card>

                {/* Converted View */}
                <Card className="border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Converted
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {targetFmtInfo?.label}
                      </span>
                    </h4>
                    {state.stats && (
                      <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                        {formatBytes(state.stats.targetSize)}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center min-h-[260px] max-h-[360px] bg-muted/10 relative">
                    {state.isProcessing && (
                      <div className="absolute inset-0 bg-background/60 flex flex-col gap-2 items-center justify-center z-10 backdrop-blur-xs">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <span className="text-xs font-medium text-muted-foreground">Converting…</span>
                      </div>
                    )}
                    {state.targetUrl && (
                      <img
                        src={state.targetUrl}
                        alt="Converted"
                        className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                      />
                    )}
                  </div>
                  <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                    {originalDimensions.w} × {originalDimensions.h} px
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
                      accept="image/*,.heic"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileChange(e.target.files[0]);
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
                  disabled={!state.targetUrl || state.isProcessing}
                  className="font-medium cursor-pointer text-xs gap-1.5 h-9"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .{targetFmtInfo?.ext}
                </Button>
              </div>
            </div>

            {/* Sidebar Target Format Picker */}
            <Card className="border border-border/80 bg-card shadow-xs self-start">
              <div className="px-5 py-4 border-b border-border/60">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Convert To
                </h3>
              </div>
              <CardContent className="p-4 flex flex-col gap-2">
                {TARGET_FORMATS.map((fmt) => {
                  const isSelected = state.targetFormat === fmt.value;
                  const isSameFormat = sourceFmtLabel === fmt.label;
                  return (
                    <button
                      key={fmt.value}
                      type="button"
                      onClick={() => setTargetFormat(fmt.value)}
                      disabled={isSameFormat}
                      className={`w-full rounded-lg px-3 py-2.5 text-left flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-primary/60 bg-primary/5 text-foreground'
                          : 'border-border/50 bg-transparent hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                      } ${isSameFormat ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{fmt.label}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">.{fmt.ext}</span>
                          {isSameFormat && (
                            <span className="text-[10px] text-muted-foreground">(current)</span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            fmt.label === 'PNG' || fmt.label === 'BMP'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {fmt.label === 'PNG' || fmt.label === 'BMP' ? 'Lossless' : 'Lossy'}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}

                {/* Transparency Warning */}
                {state.targetFormat === 'image/jpeg' && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed mt-2 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                    ⚠ This format does not support transparency. Transparent areas will be filled with white.
                  </p>
                )}
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </ToolLayout>
  );
}
export default ImageConverterTool;
