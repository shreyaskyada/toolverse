'use client';

import React from 'react';
import {
  useCertificateGenerator,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  certificateCategories,
  TemplateType,
} from '@repo/engines/certificate-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Download, Eraser, Upload, FileText, Check, ChevronsUpDown } from 'lucide-react';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function CertificateGeneratorTool() {
  const {
    state,
    refs,
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
  } = useCertificateGenerator();

  // Signature Pad Coordinates
  const getCoordinates = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = refs.sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in event && event.touches && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(event);
    if (!coords) return;
    const ctx = refs.sigCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';
    }
  };

  const draw = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    if (!state.isDrawing) return;
    const coords = getCoordinates(event);
    if (!coords) return;
    const ctx = refs.sigCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    if (state.isDrawing) {
      setIsDrawing(false);
      drawCertificate();
    }
  };

  const handleDownloadPNG = () => {
    const canvas = refs.mainCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const certName = state.certType || '';
    link.download = `${certName.replace(/\s+/g, '-').toLowerCase()}-${state.recipient.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownloadPDF = () => {
    const canvas = refs.mainCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Certificate</title>
            <style>
              @page { size: landscape; margin: 0; }
              body { margin: 0; display: flex; align-items: center; justify-content: center; background: white; width: 100vw; height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Editor Panel */}
        <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm h-fit max-h-[85vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold tracking-tight">Design & Details</h2>

          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="flex flex-col gap-4 mt-0">
              {/* Template Selector */}
              <div className="flex flex-col gap-2">
                <Label>Template</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['classic', 'modern', 'elegant'] as TemplateType[]).map((t) => (
                    <Button
                      key={t}
                      onClick={() => setTemplate(t)}
                      variant={state.template === t ? 'default' : 'outline'}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        state.template === t ? 'shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <Label>Category</Label>
                  <Popover open={state.openCategory} onOpenChange={setOpenCategory} modal={false}>
                    <PopoverTrigger
                      className="flex w-full items-center justify-between h-10 font-normal bg-background rounded-md border border-input px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      role="combobox"
                      aria-expanded={state.openCategory}
                    >
                      <span className="truncate">{state.category || 'Select category...'}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search category..." autoFocus={false} />
                        <CommandList className="max-h-[300px]">
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {Object.keys(certificateCategories).map((cat) => (
                              <CommandItem
                                key={cat}
                                value={cat}
                                onSelect={(currentValue) => {
                                  const exactMatch =
                                    Object.keys(certificateCategories).find(
                                      (k) => k.toLowerCase() === currentValue.toLowerCase()
                                    ) || cat;
                                  setCategory(exactMatch);
                                  setCertType(certificateCategories[exactMatch]?.[0] || '');
                                  setCustomTitle('');
                                  setOpenCategory(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    state.category === cat ? 'opacity-100' : 'opacity-0'
                                  }`}
                                />
                                {cat}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Label>Type</Label>
                  <Popover open={state.openType} onOpenChange={setOpenType} modal={false}>
                    <PopoverTrigger
                      className="flex w-full items-center justify-between h-10 font-normal bg-background rounded-md border border-input px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      role="combobox"
                      aria-expanded={state.openType}
                    >
                      <span className="truncate">{state.certType || 'Select type...'}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search type..." autoFocus={false} />
                        <CommandList className="max-h-[300px]">
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {certificateCategories[state.category]?.map((type) => (
                              <CommandItem
                                key={type}
                                value={type}
                                onSelect={(currentValue) => {
                                  const exactMatch = (certificateCategories[state.category] || []).find(
                                    (t) => t.toLowerCase() === currentValue.toLowerCase()
                                  ) || type;
                                  setCertType(exactMatch);
                                  setCustomTitle('');
                                  setOpenType(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    state.certType === type ? 'opacity-100' : 'opacity-0'
                                  }`}
                                />
                                {type}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Certificate Title (Custom Override)</Label>
                <Input
                  type="text"
                  value={state.customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={`e.g. ${(state.certType || '').toUpperCase()}`}
                  className="w-full h-10 px-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => refs.fileInputRef.current?.click()}
                    className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" /> Upload Image
                  </Button>
                  {state.logoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogoUrl(null)}
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Remove Logo
                    </Button>
                  )}
                  <input
                    ref={refs.fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="flex flex-col gap-4 mt-0">
              <div className="flex flex-col gap-2">
                <Label>Organization Name</Label>
                <Input
                  type="text"
                  value={state.organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Global Tech University"
                  className="w-full h-10 px-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Recipient Name</Label>
                <Input
                  type="text"
                  value={state.recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full h-10 px-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Reason / Achievement Details</Label>
                <Input
                  type="text"
                  value={state.achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  placeholder="Advanced Web Development Program"
                  className="w-full h-10 px-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={state.date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3"
                />
              </div>
            </TabsContent>

            <TabsContent value="signature" className="flex flex-col gap-4 mt-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>Digital Signature</Label>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refs.sigFileInputRef.current?.click()}
                      className="h-6 px-2 text-xs cursor-pointer"
                    >
                      <Upload className="h-3 w-3 mr-1" /> Upload
                    </Button>
                    {state.hasSignature && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSignature}
                        className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 font-medium h-6 px-2 cursor-pointer"
                      >
                        <Eraser className="h-3 w-3" /> Clear
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={refs.sigFileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleSigUpload(e.target.files[0])}
                  />
                </div>

                <div className="relative w-full h-28 rounded-lg border border-border bg-background overflow-hidden group">
                  {state.sigImageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted/10">
                      <img
                        src={state.sigImageUrl}
                        className="max-h-full max-w-full object-contain p-2"
                        alt="Signature"
                      />
                    </div>
                  ) : (
                    <>
                      <canvas
                        ref={refs.sigCanvasRef}
                        width={350}
                        height={112}
                        className="w-full h-full cursor-crosshair touch-none bg-muted/10"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      {!state.hasSignature && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-muted-foreground/50 select-none">
                          Draw signature here
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="h-[1px] flex-1 bg-border/60"></div>
                  <span className="text-[10px] uppercase text-muted-foreground/60 font-semibold tracking-wider">
                    OR TYPE BELOW
                  </span>
                  <div className="h-[1px] flex-1 bg-border/60"></div>
                </div>

                <Input
                  type="text"
                  value={state.issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="John Smith (Issuer Name)"
                  disabled={state.hasSignature}
                  className="w-full h-10 px-3 mt-2 disabled:opacity-50"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-4">
            <Button
              variant="secondary"
              onClick={handleDownloadPNG}
              className="flex-1 h-12 flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer hover:bg-secondary/80 active:scale-[0.98] transition-all"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="flex-1 h-12 flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-full lg:flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight">Live Preview</h2>
          <div className="w-full overflow-hidden rounded-2xl border border-border bg-muted/30 p-4 sm:p-8 flex items-center justify-center min-h-[400px]">
            <canvas
              ref={refs.mainCanvasRef}
              width={1000}
              height={700}
              className="max-w-full h-auto shadow-2xl rounded-sm ring-1 ring-border/50 bg-white"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
export default CertificateGeneratorTool;
