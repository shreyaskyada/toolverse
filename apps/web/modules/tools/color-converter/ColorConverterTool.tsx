'use client';

import React from 'react';
import {
  useColorConverter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/color-converter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function ColorConverterTool() {
  const {
    state,
    setHex,
    handleHexChange,
    handleRgbChange,
    handleHslChange,
    triggerCopy,
  } = useColorConverter();

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      triggerCopy(format);
      toast.success(`Copied ${format} to clipboard`);
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const ValueRow = ({
    label,
    value,
    rawStr,
    onChange,
  }: {
    label: string;
    value: string;
    rawStr: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange || (() => {})}
          readOnly={!onChange}
          className="font-mono text-sm bg-background flex-1 h-9 px-3"
        />
        <Button
          variant="secondary"
          className="w-12 px-0 shrink-0 h-9 cursor-pointer"
          onClick={() => copyToClipboard(rawStr, label)}
          title={`Copy ${label}`}
        >
          {state.copiedFormat === label ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Color Visual Picker Card */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-6 flex flex-col gap-6">
            <style>{`
              .custom-color-picker .react-colorful {
                width: 100% !important;
                height: 260px !important;
                border-radius: 12px;
                overflow: hidden;
              }
              .custom-color-picker .react-colorful__saturation {
                border-radius: 8px;
              }
              .custom-color-picker .react-colorful__hue {
                height: 14px !important;
                border-radius: 9999px;
                margin-top: 14px;
              }
              .custom-color-picker .react-colorful__pointer {
                width: 20px !important;
                height: 20px !important;
                border: 3px solid #ffffff !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
              }
            `}</style>

            <div
              className="w-full aspect-video rounded-xl shadow-inner border border-border/50 transition-colors duration-200 flex items-end p-4"
              style={{ backgroundColor: state.hex }}
            >
              <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-md text-foreground font-mono text-sm font-bold shadow-sm">
                {state.hex.toUpperCase()}
              </div>
            </div>

            <div className="w-full custom-color-picker mt-1">
              <HexColorPicker
                color={state.hex}
                onChange={setHex}
              />
            </div>
          </CardContent>
        </Card>

        {/* Input Form Fields Card */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-6 flex flex-col gap-6">
            <ValueRow
              label="HEX"
              value={state.hex.toUpperCase()}
              rawStr={state.hex.toUpperCase()}
              onChange={(e) => handleHexChange(e.target.value)}
            />

            <ValueRow
              label="RGB"
              value={state.rgbString}
              rawStr={state.rgbString}
              onChange={(e) => handleRgbChange(e.target.value)}
            />

            <ValueRow
              label="HSL"
              value={state.hslString}
              rawStr={state.hslString}
              onChange={(e) => handleHslChange(e.target.value)}
            />

            <ValueRow
              label="CMYK"
              value={state.cmykString}
              rawStr={state.cmykString}
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
export default ColorConverterTool;
