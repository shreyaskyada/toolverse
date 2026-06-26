"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  Link2,
  Link2Off,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

// ------------------------------------------------------------------
// RangeSlider — premium filled-track slider
// ------------------------------------------------------------------
interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  minLabel?: string;
  maxLabel?: string;
}

function RangeSlider({ min, max, step, value, onChange, minLabel, maxLabel }: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative flex flex-col gap-1 select-none">
      {/* Track wrapper so we can paint the fill */}
      <div className="relative h-6 flex items-center">
        {/* Rail */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-border/70" />
        {/* Filled portion */}
        <div
          className="absolute h-1.5 rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
        {/* Native input sits on top (transparent) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
          className="slider-range absolute inset-x-0 opacity-0 h-6 z-10"
          style={{ background: "transparent" }}
        />
        {/* Visible thumb */}
        <div
          className="absolute w-4.5 h-4.5 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-transform hover:scale-110 z-20"
          style={{ left: `calc(${pct}% - 9px)` }}
        />
      </div>
      {/* Min / Max tick labels */}
      {(minLabel || maxLabel) && (
        <div className="flex justify-between">
          <span className="text-[10px] text-muted-foreground">{minLabel}</span>
          <span className="text-[10px] text-muted-foreground">{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function ImageCompressor(): React.JSX.Element {
  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSrc, setCompressedSrc] = useState<string>("");
  const [compressing, setCompressing] = useState(false);

  // Controls
  const [quality, setQuality] = useState(0.8);
  const [scale, setScale] = useState(100);
  const [customWidth, setCustomWidth] = useState(0);
  const [customHeight, setCustomHeight] = useState(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState("image/jpeg");

  // Drag-over visual
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stable refs to blob URLs so we can revoke them on cleanup / replacement
  const originalSrcRef = useRef<string>("");
  const compressedSrcRef = useRef<string>("");

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ------------------------------------------------------------------
  // Cleanup on unmount
  // ------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (originalSrcRef.current) URL.revokeObjectURL(originalSrcRef.current);
      if (compressedSrcRef.current) URL.revokeObjectURL(compressedSrcRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ------------------------------------------------------------------
  // Helper: set a new original blob URL (revoke old one)
  // ------------------------------------------------------------------
  const setOriginalBlobUrl = (url: string) => {
    if (originalSrcRef.current) URL.revokeObjectURL(originalSrcRef.current);
    originalSrcRef.current = url;
    setOriginalSrc(url);
  };

  // Helper: set a new compressed blob URL (revoke old one)
  const setCompressedBlobUrl = (blob: Blob) => {
    if (compressedSrcRef.current) URL.revokeObjectURL(compressedSrcRef.current);
    const url = URL.createObjectURL(blob);
    compressedSrcRef.current = url;
    setCompressedBlob(blob);
    setCompressedSrc(url);
  };

  // ------------------------------------------------------------------
  // Core compression – reads directly from the File (no stale URLs)
  // ------------------------------------------------------------------
  const runCompression = useCallback(
    (file: File, targetW: number, targetH: number, fmt: string, q: number) => {
      setCompressing(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!dataUrl) {
          toast.error("Failed to read image for compression.");
          setCompressing(false);
          return;
        }
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = targetW || img.naturalWidth;
          canvas.height = targetH || img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            toast.error("Canvas context unavailable.");
            setCompressing(false);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const applyQuality = fmt === "image/png" ? undefined : q;
          canvas.toBlob(
            (blob) => {
              if (blob) setCompressedBlobUrl(blob);
              setCompressing(false);
            },
            fmt,
            applyQuality
          );
        };
        img.onerror = () => {
          toast.error("Failed to load image for compression.");
          setCompressing(false);
        };
        img.src = dataUrl;
      };
      reader.onerror = () => {
        toast.error("Failed to read image file.");
        setCompressing(false);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // ------------------------------------------------------------------
  // Schedule a debounced compression whenever parameters change
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!originalFile || customWidth === 0 || customHeight === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runCompression(originalFile, customWidth, customHeight, outputFormat, quality);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [originalFile, customWidth, customHeight, outputFormat, quality, runCompression]);

  // ------------------------------------------------------------------
  // File upload handler
  // ------------------------------------------------------------------
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.name.toLowerCase().endsWith(".heic")) {
      toast.error("Please upload an image file (JPEG, PNG, WebP, GIF, HEIC).");
      return;
    }

    let activeFile = file;

    // HEIC → JPEG via heic2any
    if (file.name.toLowerCase().endsWith(".heic")) {
      try {
        toast.info("Converting HEIC to JPEG…");
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        const blob = Array.isArray(result) ? result[0] : result;
        activeFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      } catch (err: any) {
        toast.error("HEIC conversion failed: " + (err.message || String(err)));
        return;
      }
    }

    // Create a preview URL for the original image panel
    const previewUrl = URL.createObjectURL(activeFile);
    setOriginalBlobUrl(previewUrl);
    setOriginalFile(activeFile);

    // Read dimensions from a temporary image element
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setOriginalDimensions({ width: w, height: h });
      setCustomWidth(w);
      setCustomHeight(h);
      setScale(100);
    };
    img.onerror = () => toast.error("Could not read image dimensions.");
    img.src = previewUrl;
  };

  // ------------------------------------------------------------------
  // Dimension controls
  // ------------------------------------------------------------------
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    if (originalDimensions.width > 0) {
      setCustomWidth(Math.round(originalDimensions.width * (newScale / 100)));
      setCustomHeight(Math.round(originalDimensions.height * (newScale / 100)));
    }
  };

  const handleWidthChange = (val: number) => {
    setCustomWidth(val);
    if (lockAspectRatio && originalDimensions.width > 0) {
      setCustomHeight(Math.round(val / (originalDimensions.width / originalDimensions.height)));
    }
  };

  const handleHeightChange = (val: number) => {
    setCustomHeight(val);
    if (lockAspectRatio && originalDimensions.width > 0) {
      setCustomWidth(Math.round(val * (originalDimensions.width / originalDimensions.height)));
    }
  };

  // ------------------------------------------------------------------
  // Download compressed result
  // ------------------------------------------------------------------
  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;
    const ext = outputFormat.split("/")[1] === "jpeg" ? "jpg" : outputFormat.split("/")[1];
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.download = `${baseName}_compressed.${ext}`;
    link.href = compressedSrcRef.current;
    link.click();
    toast.success("Compressed image downloaded!");
  };

  // ------------------------------------------------------------------
  // Reset workspace
  // ------------------------------------------------------------------
  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (originalSrcRef.current) URL.revokeObjectURL(originalSrcRef.current);
    if (compressedSrcRef.current) URL.revokeObjectURL(compressedSrcRef.current);
    originalSrcRef.current = "";
    compressedSrcRef.current = "";
    setOriginalFile(null);
    setOriginalSrc("");
    setCompressedBlob(null);
    setCompressedSrc("");
    setOriginalDimensions({ width: 0, height: 0 });
    setCustomWidth(0);
    setCustomHeight(0);
    setScale(100);
    setQuality(0.8);
    setOutputFormat("image/jpeg");
    setCompressing(false);
    toast.success("Workspace reset");
  };

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savingsPercent =
    originalFile && compressedBlob && originalFile.size > 0
      ? Math.max(0, Math.round(((originalFile.size - compressedBlob.size) / originalFile.size) * 100))
      : 0;

  // ------------------------------------------------------------------
  // Drag & Drop handlers
  // ------------------------------------------------------------------
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6">
      {!originalFile ? (
        /* ── Dropzone ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[300px] ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[0.99] shadow-xs"
              : "border-border hover:border-primary/50 bg-card hover:bg-muted/10"
          }`}
        >
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
            <h3 className="text-base font-semibold text-foreground">Upload Image to Compress</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Drag and drop or click to browse. Supports JPEG, PNG, WebP, GIF, and Apple HEIC.
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider py-1 px-2.5">
            100% Client-Side · Private
          </Badge>
        </div>
      ) : (
        /* ── Active Workspace ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Image Comparison (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original */}
              <Card className="border border-border/80 bg-card shadow-xs overflow-hidden">
                <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Original
                  </h4>
                  <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                    {formatBytes(originalFile.size)}
                  </Badge>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden bg-muted/10">
                  {originalSrc && (
                    <img
                      src={originalSrc}
                      alt="Original"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                    />
                  )}
                </div>
                <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                  {originalDimensions.width} × {originalDimensions.height} px
                </div>
              </Card>

              {/* Compressed */}
              <Card className="border border-border/80 bg-card shadow-xs overflow-hidden">
                <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Compressed
                  </h4>
                  <div className="flex gap-1.5 items-center">
                    {compressedBlob && (
                      <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                        {formatBytes(compressedBlob.size)}
                      </Badge>
                    )}
                    {savingsPercent > 0 && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold text-[10px]">
                        -{savingsPercent}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden bg-muted/10 relative">
                  {compressing && (
                    <div className="absolute inset-0 bg-background/60 flex flex-col gap-2 items-center justify-center z-10 backdrop-blur-sm">
                      <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                      <span className="text-xs font-medium text-muted-foreground">Optimizing…</span>
                    </div>
                  )}
                  {compressedSrc && (
                    <img
                      src={compressedSrc}
                      alt="Compressed"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                    />
                  )}
                </div>
                <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                  {customWidth} × {customHeight} px
                </div>
              </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center gap-3">
              {/* Left: Upload new + Reset */}
              <div className="flex items-center gap-2">
                {/* Upload new image — looks like a real button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.heic"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleReset();
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

                {/* Reset workspace — icon only, destructive */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title="Clear workspace"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/8 cursor-pointer shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Right: Download */}
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                disabled={!compressedBlob || compressing}
                className="font-medium cursor-pointer text-xs gap-1.5 h-9"
              >
                <Download className="h-3.5 w-3.5" />
                Download Compressed File
              </Button>
            </div>
          </div>

          {/* ── Controls (1 col) ── */}
          <Card className="border border-border/80 bg-card shadow-xs self-start">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Compression Controls
              </h3>
            </div>
            <CardContent className="p-5 flex flex-col gap-5">
              {/* Format */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "JPEG", value: "image/jpeg" },
                    { label: "PNG", value: "image/png" },
                    { label: "WebP", value: "image/webp" },
                  ].map((fmt) => (
                    <Button
                      key={fmt.value}
                      variant={outputFormat === fmt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOutputFormat(fmt.value)}
                      className="text-xs font-medium cursor-pointer h-9"
                    >
                      {fmt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality (lossy formats only) */}
              {outputFormat !== "image/png" && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground">Quality</label>
                    <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <RangeSlider
                    min={0.05}
                    max={1.0}
                    step={0.05}
                    value={quality}
                    onChange={setQuality}
                    minLabel="5%"
                    maxLabel="100%"
                  />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    70–80% is the sweet spot — large size savings with minimal visual difference.
                  </p>
                </div>
              )}

              {/* Scale */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground">Dimension Scale</label>
                  <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {scale}%
                  </span>
                </div>
                <RangeSlider
                  min={10}
                  max={100}
                  step={5}
                  value={scale}
                  onChange={handleScaleChange}
                  minLabel="10%"
                  maxLabel="100%"
                />
              </div>

              {/* Custom dimensions */}
              <div className="flex flex-col gap-2 border-t border-border/40 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-muted-foreground">Custom Dimensions (px)</label>
                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    {lockAspectRatio ? (
                      <><Link2 className="h-3 w-3" /> Locked</>
                    ) : (
                      <><Link2Off className="h-3 w-3 text-muted-foreground" /> Unlocked</>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground">Width</span>
                    <Input
                      type="number"
                      value={customWidth || ""}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground">Height</span>
                    <Input
                      type="number"
                      value={customHeight || ""}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
