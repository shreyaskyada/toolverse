'use client';

import React from 'react';
import {
  useQrCodeGenerator,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  PRESET_COLORS,
} from '@repo/engines/qr-code-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeSlider } from '@/components/ui/range-slider';
import { Download, Link, Type, User, Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function QRCodeGeneratorTool() {
  const {
    state,
    setActiveTab,
    setUrl,
    setText,
    updateVCard,
    setSize,
    setMargin,
    setFgColor,
    setBgColor,
  } = useQrCodeGenerator();

  const handleDownload = () => {
    if (!state.qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode_${Date.now()}.png`;
    link.href = state.qrDataUrl;
    link.click();
    toast.success('QR Code downloaded!');
  };

  const ColorPicker = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-muted-foreground">{label}</label>
      <div className="relative flex items-center">
        <Popover>
          <PopoverTrigger
            type="button"
            className="absolute left-1.5 h-7 w-7 rounded-sm border border-border/80 shadow-sm overflow-hidden shrink-0 z-10 cursor-pointer transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: value }}
            title="Pick a color"
          />
          <PopoverContent
            className="w-auto p-4 flex flex-col gap-4 rounded-xl shadow-xl border-border/80 bg-card"
            align="start"
            sideOffset={12}
          >
            <div className="rounded-lg shadow-sm">
              <HexColorPicker color={value} onChange={onChange} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Presets
              </span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`h-6 w-6 rounded-md shadow-xs border cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                      value.toUpperCase() === c.toUpperCase()
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border/60 hover:border-border'
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => onChange(c)}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 pl-11 font-mono text-sm uppercase bg-background shadow-xs transition-colors focus-visible:ring-1 focus-visible:border-primary"
          maxLength={7}
        />
      </div>
    </div>
  );

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Data Input Card */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-1 py-1 border-b border-border/60 flex">
              <button
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  state.activeTab === 'url'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('url')}
              >
                <Link className="h-4 w-4" /> URL
              </button>
              <button
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  state.activeTab === 'text'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('text')}
              >
                <Type className="h-4 w-4" /> Text
              </button>
              <button
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  state.activeTab === 'vcard'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('vcard')}
              >
                <User className="h-4 w-4" /> Contact
              </button>
            </div>
            <CardContent className="p-5">
              {state.activeTab === 'url' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">Website URL</label>
                  <Input
                    type="url"
                    value={state.url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-10 px-3"
                  />
                </div>
              )}

              {state.activeTab === 'text' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">Custom Text</label>
                  <Textarea
                    value={state.text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter the text to encode..."
                    rows={4}
                    className="w-full resize-none p-3"
                  />
                </div>
              )}

              {state.activeTab === 'vcard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground">First Name</label>
                    <Input
                      type="text"
                      value={state.vCard.firstName}
                      onChange={(e) => updateVCard({ firstName: e.target.value })}
                      placeholder="Jane"
                      className="w-full h-10 px-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground">Last Name</label>
                    <Input
                      type="text"
                      value={state.vCard.lastName}
                      onChange={(e) => updateVCard({ lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full h-10 px-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground">Phone Number</label>
                    <Input
                      type="tel"
                      value={state.vCard.phone}
                      onChange={(e) => updateVCard({ phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-10 px-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground">Email</label>
                    <Input
                      type="email"
                      value={state.vCard.email}
                      onChange={(e) => updateVCard({ email: e.target.value })}
                      placeholder="jane.doe@example.com"
                      className="w-full h-10 px-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground">Website</label>
                    <Input
                      type="url"
                      value={state.vCard.website}
                      onChange={(e) => updateVCard({ website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full h-10 px-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground">Company</label>
                    <Input
                      type="text"
                      value={state.vCard.company}
                      onChange={(e) => updateVCard({ company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full h-10 px-3"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Design Settings Card */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Palette className="h-4 w-4 text-primary" /> Customize Style
              </h3>
            </div>
            <CardContent className="p-5 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPicker label="Foreground Color" value={state.fgColor} onChange={setFgColor} />
                <ColorPicker label="Background Color" value={state.bgColor} onChange={setBgColor} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground">Size (px)</label>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {state.size}
                    </span>
                  </div>
                  <RangeSlider
                    min={128}
                    max={512}
                    step={16}
                    value={state.size}
                    onChange={setSize}
                    minLabel="128"
                    maxLabel="512"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground">Quiet Zone (Margin)</label>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {state.margin}
                    </span>
                  </div>
                  <RangeSlider
                    min={0}
                    max={8}
                    step={1}
                    value={state.margin}
                    onChange={setMargin}
                    minLabel="0"
                    maxLabel="8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Preview Panel (1 col) ── */}
        <div className="lg:col-span-1">
          <Card className="border border-border/80 bg-card shadow-xs h-full flex flex-col items-center justify-between sticky top-6">
            <div className="px-5 py-4 border-b border-border/60 w-full">
              <h3 className="text-sm font-semibold text-foreground">QR Code Preview</h3>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col items-center justify-center gap-6 w-full min-h-[320px]">
              <div className="relative aspect-square w-full max-w-[240px] rounded-xl border border-border/60 bg-muted/20 p-4 flex items-center justify-center shadow-inner">
                {state.qrDataUrl ? (
                  <img
                    src={state.qrDataUrl}
                    alt="Generated QR Code"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-xs text-muted-foreground">Generating...</div>
                )}
              </div>

              <Button
                onClick={handleDownload}
                disabled={!state.qrDataUrl || state.generating}
                className="w-full h-11 flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer hover:bg-primary/95 active:scale-[0.98] transition-all"
              >
                <Download className="h-4 w-4" /> Download PNG
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
export default QRCodeGeneratorTool;
