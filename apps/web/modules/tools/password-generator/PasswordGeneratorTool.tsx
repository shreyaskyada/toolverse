'use client';

import React, { useState, useEffect } from 'react';
import { usePasswordGenerator } from '@repo/engines/password-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RangeSlider } from '@/components/ui/range-slider';
import { Copy, RefreshCw, CheckCircle2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { TOOL_METADATA, TOOL_FAQS, TOOL_ABOUT } from '@repo/engines/password-generator';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function PasswordGeneratorTool() {
  const {
    state,
    setLength,
    setIncludeUppercase,
    setIncludeLowercase,
    setIncludeNumbers,
    setIncludeSymbols,
    generate,
  } = usePasswordGenerator();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = async () => {
    if (!state.password) return;
    try {
      await navigator.clipboard.writeText(state.password);
      setCopied(true);
      toast.success('Password copied to clipboard');
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const OptionToggle = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer select-none ${
        checked ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'
      }`}
      onClick={() => {
        // Prevent unchecking the last option
        if (
          checked &&
          [
            state.options.includeUppercase,
            state.options.includeLowercase,
            state.options.includeNumbers,
            state.options.includeSymbols,
          ].filter(Boolean).length === 1
        ) {
          toast.error('You must select at least one character type');
          return;
        }
        onChange(!checked);
      }}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
          checked ? 'bg-primary text-primary-foreground' : 'border border-muted-foreground/30'
        }`}
      >
        {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
    </div>
  );

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        
        {/* Settings Panel (Left) */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Password Settings
            </h3>
          </div>
          <CardContent className="p-5 flex flex-col gap-6">
            {/* Length Slider */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground">Password Length</label>
                <Input
                  type="number"
                  min={6}
                  max={64}
                  value={state.options.length || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setLength(val);
                    }
                  }}
                  onBlur={() => {
                    if (state.options.length < 6) setLength(6);
                    if (state.options.length > 64) setLength(64);
                  }}
                  className="w-16 h-8 text-xs font-mono font-bold text-center bg-primary/10 text-primary border-transparent focus-visible:ring-1"
                />
              </div>
              <RangeSlider
                min={6}
                max={64}
                step={1}
                value={state.options.length}
                onChange={setLength}
                minLabel="6"
                maxLabel="64"
              />
            </div>

            {/* Character Types */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground mb-1">Character Types</label>
              <OptionToggle
                label="Uppercase (A-Z)"
                checked={state.options.includeUppercase}
                onChange={setIncludeUppercase}
              />
              <OptionToggle
                label="Lowercase (a-z)"
                checked={state.options.includeLowercase}
                onChange={setIncludeLowercase}
              />
              <OptionToggle
                label="Numbers (0-9)"
                checked={state.options.includeNumbers}
                onChange={setIncludeNumbers}
              />
              <OptionToggle
                label="Symbols (!@#$%)"
                checked={state.options.includeSymbols}
                onChange={setIncludeSymbols}
              />
            </div>
          </CardContent>
        </Card>

        {/* Result Panel (Right) */}
        <Card className="border border-border/80 bg-card shadow-xs self-start">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Generated Password
            </h3>
          </div>
          <CardContent className="p-5 flex flex-col gap-5">
            {/* Password Display Box */}
            <div className="relative group">
              <div className="w-full min-h-24 p-4 rounded-xl border-2 border-border bg-muted/20 flex flex-wrap break-all items-center justify-center text-center text-xl sm:text-2xl font-mono font-medium tracking-wider text-foreground">
                {state.password || 'Select options to generate'}
              </div>

              {state.password && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-md bg-background shadow-sm hover:bg-muted"
                    onClick={copyToClipboard}
                    title="Copy password"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-md bg-background shadow-sm hover:bg-muted"
                    onClick={generate}
                    title="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                className="flex-1 font-medium gap-2"
                variant="default"
                disabled={!state.password}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Password'}
              </Button>
              <Button onClick={generate} className="font-medium gap-2" variant="outline">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>

            {/* Strength Meter */}
            {state.password && (
              <div className="mt-2 p-4 rounded-xl border border-border/60 bg-muted/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Password Strength</span>
                  <span
                    className={`text-xs font-bold ${
                      state.strength.score >= 3
                        ? 'text-emerald-500'
                        : state.strength.score === 2
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }`}
                  >
                    {state.strength.label}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-colors duration-300 ${
                        state.strength.score >= level ? state.strength.color : 'bg-muted-foreground/20'
                      }`}
                    />
                  ))}
                </div>
                {state.strength.score < 3 && (
                  <div className="flex items-start gap-1.5 mt-3 text-muted-foreground">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                    <p className="text-[10px] leading-relaxed">
                      Try increasing the length or adding more character types to make your password stronger.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </ToolLayout>
  );
}
