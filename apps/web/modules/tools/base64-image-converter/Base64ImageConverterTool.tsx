'use client';

import React, { useState, useEffect } from 'react';
import {
  useBase64ImageConverter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  MIME_EXTENSIONS,
  truncateText,
  formatBytes,
} from '@repo/engines/base64-image-converter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  Clipboard,
  Trash2,
  Upload,
  Download,
  RefreshCw,
  Sparkles,
  Terminal,
  AlertTriangle,
  FileImage,
  FileVideo,
  FileArchive,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function Base64ImageConverterTool() {
  const {
    state,
    decInputRef,
    processEncFile,
    handleClearEnc,
    handleEncCopy,
    handleClearDec,
    setDecManualType,
    handleDecodeInputChange,
  } = useBase64ImageConverter();

  const handleEncDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      toast.promise(processEncFile(e.dataTransfer.files[0]), {
        loading: 'Processing media file...',
        success: 'File successfully converted to Base64!',
        error: (err) => err.message || 'Failed to convert file.',
      });
    }
  };

  const handleEncFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.promise(processEncFile(e.target.files[0]), {
        loading: 'Processing media file...',
        success: 'File successfully converted to Base64!',
        error: (err) => err.message || 'Failed to convert file.',
      });
    }
  };

  const handleDecPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (decInputRef.current) {
          decInputRef.current.value = text;
        }
        handleDecodeInputChange(text);
        toast.success('Pasted Base64 from clipboard!');
      }
    } catch {
      toast.error('Failed to read clipboard.');
    }
  };

  const handleDownloadDec = () => {
    if (!state.decBlob || !state.decPreviewUrl) return;
    const link = document.createElement('a');
    link.href = state.decPreviewUrl;
    link.download = `decoded_file.${state.decExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`File saved as decoded_file.${state.decExtension}!`);
  };

  const isImage = state.decMimeType.startsWith('image/');
  const isVideo = state.decMimeType.startsWith('video/');

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="encode" className="w-full flex flex-col">
          <TabsList className="grid w-fit grid-cols-2 h-9 mb-4">
            <TabsTrigger value="encode" className="text-xs px-6 cursor-pointer">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Encode Image/Video
            </TabsTrigger>
            <TabsTrigger value="decode" className="text-xs px-6 cursor-pointer">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Decode Base64 Code
            </TabsTrigger>
          </TabsList>

          {/* --- ENCODE TAB VIEW --- */}
          <TabsContent value="encode" className="flex flex-col gap-5 mt-0 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left side: upload area and properties */}
              <div className="flex flex-col gap-5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                  Image or Video Input File
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleEncDrop}
                  className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer bg-muted/5 relative group min-h-[160px]"
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleEncFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-9 w-9 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Drag and drop file here</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Supports images & videos (MP4, WebM)</p>
                  </div>
                </div>

                {state.encLoading && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs">Converting media...</span>
                  </div>
                )}

                {state.encFile && !state.encLoading && (
                  <Card className="border border-border animate-fade-in bg-card overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-semibold flex items-center gap-2">
                        {state.encFile.type.startsWith('image/') ? (
                          <FileImage className="h-4 w-4 text-primary" />
                        ) : (
                          <FileVideo className="h-4 w-4 text-primary" />
                        )}
                        Media Visual Preview
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearEnc}
                        className="h-8 w-8 text-destructive hover:bg-destructive/5 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col gap-4">
                      <div className="relative flex items-center justify-center bg-muted/20 border border-border/40 rounded-xl overflow-hidden min-h-[220px] max-h-[350px]">
                        {state.encFile.type.startsWith('image/') ? (
                          <img
                            src={state.encDataUri}
                            alt="Encoded Preview"
                            className="max-h-[320px] object-contain rounded-lg p-2 selection:bg-transparent"
                          />
                        ) : (
                          <video
                            controls
                            src={state.encDataUri}
                            className="w-full max-h-[320px] rounded-lg p-2"
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-1 border-t border-border/40 pt-3 text-[11px] font-mono text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Filename:</span>
                          <span className="text-foreground font-semibold truncate max-w-[200px]">
                            {state.encFile.name}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Mime Type:</span>
                          <span className="text-foreground font-semibold">{state.encFile.type}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>File Size:</span>
                          <span className="text-foreground font-semibold">{formatBytes(state.encFile.size)}</span>
                        </div>
                        {state.encDimensions && (
                          <div className="flex justify-between mt-1">
                            <span>Dimensions:</span>
                            <span className="text-foreground font-semibold">
                              {state.encDimensions.width} × {state.encDimensions.height}px
                            </span>
                          </div>
                        )}
                        {state.encDuration !== null && (
                          <div className="flex justify-between mt-1">
                            <span>Duration:</span>
                            <span className="text-foreground font-semibold">{state.encDuration.toFixed(2)}s</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right side: generated copiers */}
              <div className="flex flex-col gap-5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  Base64 Code Output Snippets
                </label>

                {state.encBase64 ? (
                  <div className="flex flex-col gap-3.5 animate-fade-in">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">Raw Base64 string</span>
                        <Button
                          onClick={() => handleEncCopy('raw')}
                          variant="ghost"
                          size="xs"
                          className="h-7 gap-1 text-[11px] cursor-pointer"
                        >
                          {state.encCopiedType === 'raw' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy Raw
                        </Button>
                      </div>
                      <Textarea
                        readOnly
                        value={truncateText(state.encBase64)}
                        className="min-h-[75px] max-h-[100px] font-mono text-[10px] bg-muted/15"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">Data URL</span>
                        <Button
                          onClick={() => handleEncCopy('uri')}
                          variant="ghost"
                          size="xs"
                          className="h-7 gap-1 text-[11px] cursor-pointer"
                        >
                          {state.encCopiedType === 'uri' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy URI
                        </Button>
                      </div>
                      <Textarea
                        readOnly
                        value={truncateText(state.encDataUri)}
                        className="min-h-[75px] max-h-[100px] font-mono text-[10px] bg-muted/15"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">HTML Embed Tag</span>
                        <Button
                          onClick={() => handleEncCopy('html')}
                          variant="ghost"
                          size="xs"
                          className="h-7 gap-1 text-[11px] cursor-pointer"
                        >
                          {state.encCopiedType === 'html' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy Tag
                        </Button>
                      </div>
                      <Textarea
                        readOnly
                        value={truncateText(
                          state.encFile?.type.startsWith('image/')
                            ? `<img src="${state.encDataUri}" alt="${state.encFile?.name || 'Embedded Image'}" />`
                            : `<video controls src="${state.encDataUri}"></video>`
                        )}
                        className="min-h-[60px] max-h-[80px] font-mono text-[10px] bg-muted/15"
                      />
                    </div>

                    {state.encFile?.type.startsWith('image/') && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-muted-foreground">CSS Background Code</span>
                          <Button
                            onClick={() => handleEncCopy('css')}
                            variant="ghost"
                            size="xs"
                            className="h-7 gap-1 text-[11px] cursor-pointer"
                          >
                            {state.encCopiedType === 'css' ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clipboard className="h-3 w-3" />
                            )}
                            Copy CSS
                          </Button>
                        </div>
                        <Textarea
                          readOnly
                          value={truncateText(`background-image: url("${state.encDataUri}");`)}
                          className="min-h-[60px] max-h-[80px] font-mono text-[10px] bg-muted/15"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                    Upload an image or video file to view Base64 code tags
                  </div>
                )}
              </div>

            </div>
          </TabsContent>

          {/* --- DECODE TAB VIEW --- */}
          <TabsContent value="decode" className="flex flex-col gap-5 mt-0 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left side: inputs and format overrides */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                    Paste Base64 Code or Data URL
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDecPaste}
                      className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
                    >
                      <Clipboard className="h-3 w-3" />
                      Paste
                    </Button>
                    {state.hasDecInput && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearDec}
                        className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/5 gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                <Textarea
                  ref={decInputRef}
                  onChange={(e) => handleDecodeInputChange(e.target.value)}
                  placeholder="Paste standard Data URL (data:image/png;base64,...) or plain Base64 string here..."
                  className="h-36 font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner resize-y overflow-y-auto"
                />

                {state.hasDecInput && !state.decError && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border border-border/60 bg-muted/10 p-3 rounded-xl text-xs">
                    <span className="text-muted-foreground">Force Decoded Format Override:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                        {state.decManualType ? (
                          `Format: .${MIME_EXTENSIONS[state.decManualType]?.ext || 'bin'}`
                        ) : (
                          'Auto-Detected Format'
                        )}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 text-xs max-h-60 overflow-y-auto" align="end">
                        <DropdownMenuItem onClick={() => setDecManualType(null)}>
                          Auto-Detected Format
                        </DropdownMenuItem>
                        {Object.keys(MIME_EXTENSIONS).map((key) => (
                          <DropdownMenuItem key={key} onClick={() => setDecManualType(key)}>
                            .{MIME_EXTENSIONS[key]?.ext.toUpperCase()} ({key})
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* Right side: visual previews */}
              <div className="flex flex-col gap-5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {state.decMimeType.startsWith('image/') ? (
                    <FileImage className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : state.decMimeType.startsWith('video/') ? (
                    <FileVideo className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <FileArchive className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  Decoded Visual Media Output
                </label>

                {state.decPreviewUrl && !state.decError ? (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="relative flex items-center justify-center bg-muted/20 border border-border/40 rounded-xl overflow-hidden min-h-[220px] max-h-[350px]">
                      {isImage && (
                        <img
                          src={state.decPreviewUrl}
                          alt="Decoded Visual Media"
                          className="max-h-[320px] object-contain rounded-lg p-2 selection:bg-transparent"
                        />
                      )}
                      {isVideo && (
                        <video
                          controls
                          src={state.decPreviewUrl}
                          className="w-full max-h-[320px] rounded-lg p-2"
                        />
                      )}
                      {!isImage && !isVideo && (
                        <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                          <FileArchive className="h-10 w-10 text-primary opacity-60" />
                          <div>
                            <p className="font-semibold text-foreground text-xs">Binary Stream Decoded</p>
                            <p className="text-[10px] mt-0.5">
                              Preview not supported for MIME type: {state.decMimeType}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/10 p-3.5 flex flex-col gap-1.5 font-mono text-[11px] text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Detected MIME Type:</span>
                        <span className="text-foreground font-semibold">{state.decMimeType}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Guessed Extension:</span>
                        <span className="text-foreground font-semibold">.{state.decExtension}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>File Size:</span>
                        <span className="text-foreground font-semibold">{formatBytes(state.decFileSize)}</span>
                      </div>
                      {state.decDimensions && (
                        <div className="flex justify-between mt-1">
                          <span>Dimensions:</span>
                          <span className="text-foreground font-semibold">
                            {state.decDimensions.width} × {state.decDimensions.height}px
                          </span>
                        </div>
                      )}
                      {state.decDuration !== null && (
                        <div className="flex justify-between mt-1">
                          <span>Duration:</span>
                          <span className="text-foreground font-semibold">{state.decDuration.toFixed(2)}s</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button
                        onClick={handleDownloadDec}
                        variant="default"
                        size="sm"
                        className="h-8 px-4 text-xs gap-1.5 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download File
                      </Button>
                    </div>
                  </div>
                ) : state.decError ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed flex items-start gap-2.5 shadow-sm animate-fade-in">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Decryption Failure</p>
                      <p className="mt-1 leading-normal opacity-90">{state.decError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                    Paste Base64 code to visually preview the decoded media
                  </div>
                )}
              </div>

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
