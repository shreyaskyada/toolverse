'use client';

import React, { useState, useEffect } from 'react';
import {
  useJwtGenerator,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  ALGORITHMS,
  EXPIRATION_PRESETS,
  RSA_PUBLIC_KEY,
  ECDSA_PUBLIC_KEY,
} from '@repo/engines/jwt-generator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  Clipboard,
  Key,
  Sparkles,
  Terminal,
  ArrowRight,
  Lock,
  AlertTriangle,
  RefreshCw,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function JwtGeneratorTool() {
  const {
    state,
    setAlg,
    setSecretOrKey,
    setSecretIsBase64,
    setSub,
    setIss,
    setAud,
    setExpOffset,
    setAddIat,
    setAddNbf,
    setJti,
    refreshJti,
    handleHeaderChange,
    handlePayloadChange,
    prettifyTextareas,
    clear,
  } = useJwtGenerator();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!state.generatedToken) return;
    navigator.clipboard.writeText(state.generatedToken);
    setCopied(true);
    toast.success('Copied generated JWT to clipboard!');
  };

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  // Build the public key param for the decoder deep link
  const getPublicKeyParam = () => {
    if (state.alg.startsWith('HS') || state.alg === 'none') return state.secretOrKey;
    if (state.alg.startsWith('RS') || state.alg.startsWith('PS')) return RSA_PUBLIC_KEY;
    if (state.alg.startsWith('ES')) return ECDSA_PUBLIC_KEY;
    return '';
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">

        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Select Algorithm:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-28 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                {state.alg}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36 max-h-60 overflow-y-auto">
                {ALGORITHMS.map((item) => (
                  <DropdownMenuItem key={item} onClick={() => setAlg(item)}>
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prettifyTextareas}>
              Format JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="text-destructive hover:bg-destructive/5 border-destructive/20"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Claim Builder + Signing Config (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Payload Claim Builder Card */}
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Payload Claim Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4 text-xs">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">Subject (sub)</label>
                    <input
                      type="text"
                      value={state.sub}
                      onChange={(e) => setSub(e.target.value)}
                      placeholder="User ID, subject..."
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">Issuer (iss)</label>
                    <input
                      type="text"
                      value={state.iss}
                      onChange={(e) => setIss(e.target.value)}
                      placeholder="Token issuer..."
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">Audience (aud)</label>
                    <input
                      type="text"
                      value={state.aud}
                      onChange={(e) => setAud(e.target.value)}
                      placeholder="Audience recipient..."
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">Expiration Lifetime</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                        {EXPIRATION_PRESETS[state.expOffset] ?? 'Custom'}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 text-xs">
                        {Object.entries(EXPIRATION_PRESETS).map(([val, label]) => (
                          <DropdownMenuItem key={val} onClick={() => setExpOffset(val)}>
                            {label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-1.5 border-t border-border/40">
                  <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.addIat}
                      onChange={(e) => setAddIat(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    Issued At (iat)
                  </label>
                  <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.addNbf}
                      onChange={(e) => setAddNbf(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    Not Before (nbf)
                  </label>
                  <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.jti}
                      onChange={(e) => setJti(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    Token ID (jti)
                  </label>
                </div>

                {/* UUID Seed */}
                {state.jti && (
                  <div className="flex items-center gap-2 mt-1 bg-muted/40 p-2.5 rounded-lg border border-border/40">
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">Token UUID</span>
                      <span className="font-mono text-[10px] truncate select-all">{state.uuidSeed}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={refreshJti}
                      className="h-7 w-7 rounded-md shrink-0"
                      title="Generate New UUID"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Signing Configuration Card */}
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Signing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-3">
                {state.alg !== 'none' ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        Signing Algorithm: <strong className="text-foreground">{state.alg}</strong>
                      </span>
                      {state.alg.startsWith('HS') && (
                        <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state.secretIsBase64}
                            onChange={(e) => setSecretIsBase64(e.target.checked)}
                            className="rounded border-input text-primary focus:ring-ring"
                          />
                          Secret is Base64
                        </label>
                      )}
                    </div>

                    {state.alg.startsWith('HS') ? (
                      <input
                        type="text"
                        value={state.secretOrKey}
                        onChange={(e) => setSecretOrKey(e.target.value)}
                        placeholder="Enter HMAC Secret..."
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <Textarea
                          value={state.secretOrKey}
                          onChange={(e) => setSecretOrKey(e.target.value)}
                          placeholder="Paste PKCS#8 Private Key (starts with -----BEGIN PRIVATE KEY-----)..."
                          className="min-h-[120px] font-mono text-[10px]"
                        />
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          Pre-populated with a valid, secure key template for instant testing. Replace with your custom private key as needed.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/25 p-3 text-xs text-amber-600 flex gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>
                      The token algorithm is set to <strong>none</strong>. No signature will be generated, and the key configuration is skipped.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: JSON Editors + Generated Token (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Header & Payload Editor Tabs */}
            <div className="flex flex-col gap-2.5">
              <Tabs defaultValue="payload" className="w-full flex flex-col h-full">
                <TabsList className="grid w-auto grid-cols-2 h-9 mb-1.5">
                  <TabsTrigger value="payload" className="text-xs px-3.5">
                    Payload JSON
                  </TabsTrigger>
                  <TabsTrigger value="header" className="text-xs px-3.5">
                    Header JSON
                  </TabsTrigger>
                </TabsList>

                {/* Payload Tab */}
                <TabsContent value="payload" className="flex-1 mt-0 flex flex-col gap-2">
                  <Textarea
                    value={state.payloadInput}
                    onChange={(e) => handlePayloadChange(e.target.value)}
                    placeholder="Paste or write payload JSON here..."
                    className="min-h-[220px] font-mono text-xs leading-relaxed"
                  />
                  {state.payloadError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-2 text-[10px] text-destructive font-mono leading-relaxed">
                      Syntax Error: {state.payloadError}
                    </div>
                  )}
                </TabsContent>

                {/* Header Tab */}
                <TabsContent value="header" className="flex-1 mt-0 flex flex-col gap-2">
                  <Textarea
                    value={state.headerInput}
                    onChange={(e) => handleHeaderChange(e.target.value)}
                    placeholder="Paste or write header JSON here..."
                    className="min-h-[220px] font-mono text-xs leading-relaxed"
                  />
                  {state.headerError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-2 text-[10px] text-destructive font-mono leading-relaxed">
                      Syntax Error: {state.headerError}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Generated Token Output Card */}
            <Card className="border border-border bg-card">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  Generated Token
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8 rounded-lg shrink-0"
                  disabled={!state.generatedToken}
                  title="Copy generated token"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">

                {state.generatedToken ? (
                  <div className="flex flex-col gap-4 animate-fade-in">

                    {/* Color-coded JWT visualization */}
                    <div className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap select-all border border-border p-3.5 bg-muted/15 rounded-xl">
                      <span className="text-rose-500 font-semibold">{state.generatedToken.split('.')[0]}</span>
                      {state.generatedToken.split('.')[1] !== undefined && (
                        <>
                          <span className="text-muted-foreground font-bold mx-0.5">.</span>
                          <span className="text-violet-500 font-semibold">{state.generatedToken.split('.')[1]}</span>
                        </>
                      )}
                      {state.generatedToken.split('.')[2] !== undefined && (
                        <>
                          <span className="text-muted-foreground font-bold mx-0.5">.</span>
                          <span className="text-cyan-500 font-semibold">{state.generatedToken.split('.')[2]}</span>
                        </>
                      )}
                    </div>

                    {/* Deep link to JWT Decoder */}
                    <div className="flex justify-end pt-1">
                      <Link
                        href={`/tools/jwt-decoder?token=${encodeURIComponent(state.generatedToken)}&key=${encodeURIComponent(getPublicKeyParam())}`}
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline focus:outline-none"
                      >
                        <Eye className="h-4 w-4" />
                        Verify in JWT Decoder
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : state.signingError ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Signing Failure</p>
                      <p className="mt-1 leading-normal">{state.signingError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                    <div className="flex flex-col items-center gap-2">
                      <Lock className="h-5 w-5 opacity-40" />
                      Provide valid JSON to generate a token
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
