'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  useJwtDecoder,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  CLAIM_DESCRIPTIONS,
} from '@repo/engines/jwt-decoder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
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
  Key,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronDown,
  Terminal,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { JSONTree } from '@/modules/tools/json-formatter/components/JSONTree';

// --- Safe syntax highlight function ---
const highlightJson = (jsonString: string, type: 'header' | 'payload') => {
  if (!jsonString) return '';
  const safeStr = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return safeStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-600 dark:text-amber-400';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls =
            type === 'header'
              ? 'text-rose-500 font-semibold'
              : 'text-violet-500 font-semibold';
        } else {
          cls = 'text-green-600 dark:text-green-400';
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-600 dark:text-purple-400 font-medium';
      } else if (/null/.test(match)) {
        cls = 'text-rose-500 font-medium';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

// --- Date Formatter Helper ---
const formatTimestamp = (sec: unknown) => {
  if (typeof sec !== 'number') return '-';
  return new Date(sec * 1000).toLocaleString();
};

function formatDuration(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export function JwtDecoderTool() {
  const {
    state,
    decoded,
    setToken,
    setSecretOrKey,
    setSecretIsBase64,
    loadSample,
    clear,
  } = useJwtDecoder();

  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Copied indicator reset
  useEffect(() => {
    if (copiedPart) {
      const timer = setTimeout(() => setCopiedPart(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPart]);

  const handleCopy = (text: string, part: string) => {
    if (!text.trim()) {
      toast.error('Nothing to copy.');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedPart(part);
    toast.success(`Copied ${part} to clipboard!`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setToken(text);
        toast.success('Token pasted!');
      } else {
        toast.error('Clipboard is empty.');
      }
    } catch {
      toast.error('Failed to read clipboard. Please paste manually.');
    }
  };

  const getProgressPercent = () => {
    if (!decoded.payload) return 0;
    const { iat, exp } = decoded.payload;
    if (typeof iat !== 'number' || typeof exp !== 'number') return 0;
    const total = exp - iat;
    if (total <= 0) return 0;
    const now = Date.now() / 1000;
    const percent = ((exp - now) / total) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const hasExp = decoded.payload && typeof decoded.payload.exp === 'number';
  const hasIat = decoded.payload && typeof decoded.payload.iat === 'number';
  const alg = String(decoded.header?.alg || '');
  const tokenParts = state.token.split('.');

  return (
    <ToolLayout metadata={TOOL_METADATA} faqs={TOOL_FAQS} aboutParagraphs={TOOL_ABOUT}>
      <TooltipProvider>
        <div className="flex flex-col gap-6">

          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Load Demo Token:</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-9 w-44 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                  Select Sample
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuItem onClick={() => loadSample('hs256-active')}>
                    HS256 - Active Token
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => loadSample('hs256-expired')}>
                    HS256 - Expired Token
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => loadSample('rs256')}>
                    RS256 - RSA Public Key
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="text-destructive hover:bg-destructive/5 border-destructive/20"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Workspace Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT SIDE: Encoded Input & Signature Verification (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Input card */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    Encoded JWT Token
                  </label>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handlePaste} className="h-8 text-xs gap-1">
                      <Clipboard className="h-3.5 w-3.5" />
                      Paste
                    </Button>
                  </div>
                </div>
                <Textarea
                  ref={inputRef}
                  value={state.token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your base64-encoded JWT token here..."
                  className="min-h-[220px] font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner"
                  spellCheck={false}
                />
              </div>

              {/* Token visual representation */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Token Structure (Color Coded)
                </h3>
                {state.token ? (
                  <div className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap select-all border border-border p-3.5 bg-muted/15 rounded-xl">
                    <span className="text-rose-500 font-semibold">{tokenParts[0] || ''}</span>
                    {tokenParts[1] !== undefined && (
                      <>
                        <span className="text-muted-foreground font-bold mx-0.5">.</span>
                        <span className="text-violet-500 font-semibold">{tokenParts[1]}</span>
                      </>
                    )}
                    {tokenParts[2] !== undefined && (
                      <>
                        <span className="text-muted-foreground font-bold mx-0.5">.</span>
                        <span className="text-cyan-500 font-semibold">{tokenParts.slice(2).join('.')}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-16 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                    Paste a token to see its structure
                  </div>
                )}
              </div>

              {/* Signature Verification Block */}
              <Card className="border border-border">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Signature Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col gap-4">

                  {decoded.header?.alg ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          Algorithm: <strong className="text-foreground">{alg}</strong>
                        </span>
                        {alg.startsWith('HS') && (
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

                      {alg.startsWith('HS') ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            type="text"
                            value={state.secretOrKey}
                            onChange={(e) => setSecretOrKey(e.target.value)}
                            placeholder="Enter HMAC Secret..."
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            For HMAC-SHA algorithms, verify signature by entering the signing secret key.
                          </p>
                        </div>
                      ) : alg.startsWith('RS') || alg.startsWith('PS') || alg.startsWith('ES') ? (
                        <div className="flex flex-col gap-1.5">
                          <Textarea
                            value={state.secretOrKey}
                            onChange={(e) => setSecretOrKey(e.target.value)}
                            placeholder="Paste PEM Public Key (starts with -----BEGIN PUBLIC KEY-----)..."
                            className="min-h-[140px] font-mono text-[10px]"
                            spellCheck={false}
                          />
                          <p className="text-[10px] text-muted-foreground">
                            For RSA/ECDSA asymmetric algorithms, verify the token by pasting the PEM public key.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-amber-500/5 border border-amber-500/25 p-3 text-xs text-amber-600 flex gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>The token algorithm is set to <strong>{alg}</strong>, which does not support standard cryptographic key verification in this tool.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground py-4 text-center">
                      Enter a token to configure verification
                    </div>
                  )}

                  {/* Status Indicator */}
                  {state.token.trim() && (
                    <div className="border-t border-border pt-4">
                      {state.verificationResult.verified === true ? (
                        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-xs text-green-600 dark:text-green-400 flex items-start gap-2.5 font-medium animate-fade-in">
                          <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Signature Verified</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">The signature matches the payload. The integrity of this token is cryptographically confirmed.</p>
                          </div>
                        </div>
                      ) : state.verificationResult.verified === false ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex items-start gap-2.5 font-medium animate-fade-in">
                          <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Invalid Signature</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {state.verificationResult.error || "The signature does not match the payload. The token structure might be correct, but the keys do not align or the token has been altered."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2.5 animate-fade-in">
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Signature Verification Pending</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {state.verificationResult.error || "Please enter the matching secret or public key to verify this token's authenticity."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* RIGHT SIDE: Decoded breakdown and details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Token Meta Status Ribbon */}
              {state.token.trim() && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Alg metadata card */}
                  <div className="border border-border rounded-xl p-3.5 bg-card flex flex-col gap-1 shadow-sm">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Algorithm</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-bold text-foreground font-mono text-sm">
                        {decoded.header?.alg ? String(decoded.header.alg) : "-"}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {decoded.header?.typ ? String(decoded.header.typ) : "JWT"}
                      </Badge>
                    </div>
                  </div>

                  {/* Expiration Card */}
                  <div className="border border-border rounded-xl p-3.5 bg-card flex flex-col gap-1 shadow-sm sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Token Expiry Status</span>
                      {state.tokenStatus === "active" && (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-green-500/25 border font-semibold text-[10px]">
                          ✓ Active
                        </Badge>
                      )}
                      {state.tokenStatus === "expired" && (
                        <Badge variant="destructive" className="font-semibold text-[10px]">
                          ✕ Expired
                        </Badge>
                      )}
                      {state.tokenStatus === "no-exp" && (
                        <Badge variant="outline" className="text-[10px]">No exp Claim</Badge>
                      )}
                      {state.tokenStatus === "invalid" && (
                        <Badge variant="destructive" className="text-[10px]">Error</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {state.tokenStatus === "active" && state.timeRemaining !== null && (
                          <span>{formatDuration(state.timeRemaining)} remaining</span>
                        )}
                        {state.tokenStatus === "expired" && state.timeRemaining !== null && (
                          <span className="text-destructive font-medium">Expired {formatDuration(state.timeRemaining)} ago</span>
                        )}
                        {state.tokenStatus === "no-exp" && (
                          <span className="text-muted-foreground text-xs">This token has no expiration timestamp.</span>
                        )}
                        {state.tokenStatus === "invalid" && (
                          <span className="text-destructive text-xs">Invalid token structure.</span>
                        )}
                      </span>
                    </div>

                    {/* Expiry Lifespan Progress Bar */}
                    {state.tokenStatus === "active" && hasExp && hasIat && (
                      <div className="w-full bg-muted rounded-full h-1.5 mt-2.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${getProgressPercent() < 15
                            ? "bg-gradient-to-r from-red-500 to-amber-500 animate-pulse"
                            : "bg-gradient-to-r from-green-500 to-emerald-400"
                            }`}
                          style={{ width: `${getProgressPercent()}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Decoded tabs views */}
              <div className="flex flex-col gap-2.5">
                <Tabs defaultValue="payload" className="w-full flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <TabsList className="grid w-auto grid-cols-3 h-9">
                      <TabsTrigger value="payload" className="text-xs px-3.5">
                        Payload
                      </TabsTrigger>
                      <TabsTrigger value="header" className="text-xs px-3.5">
                        Header
                      </TabsTrigger>
                      <TabsTrigger value="explorer" className="text-xs px-3.5">
                        Tree Explorer
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(
                          decoded.payload ? JSON.stringify(decoded.payload, null, 2) : "",
                          "Payload"
                        )}
                        className="h-8 w-8 rounded-lg"
                        title="Copy payload JSON"
                        disabled={!decoded.payload}
                      >
                        {copiedPart === "Payload" ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* --- TAB CONTENT: PAYLOAD --- */}
                  <TabsContent value="payload" className="flex-1 mt-0">
                    <div className="border border-border rounded-xl bg-muted/10 p-4 min-h-[300px] max-h-[420px] overflow-y-auto relative">
                      {decoded.payload ? (
                        <div className="flex flex-col gap-1.5">
                          <pre
                            className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                            dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(decoded.payload, null, 2), "payload") }}
                          />
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-28 border border-dashed border-border/80 rounded-xl">
                          Decoded payload JSON will appear here...
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* --- TAB CONTENT: HEADER --- */}
                  <TabsContent value="header" className="flex-1 mt-0">
                    <div className="border border-border rounded-xl bg-muted/10 p-4 min-h-[300px] max-h-[420px] overflow-y-auto relative">
                      {decoded.header ? (
                        <pre
                          className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                          dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(decoded.header, null, 2), "header") }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-28 border border-dashed border-border/80 rounded-xl">
                          Decoded header JSON will appear here...
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* --- TAB CONTENT: EXPLORER --- */}
                  <TabsContent value="explorer" className="flex-1 mt-0">
                    <div className="border border-border rounded-xl bg-muted/10 p-4 min-h-[300px] max-h-[420px] overflow-y-auto">
                      {decoded.payload || decoded.header ? (
                        <div className="flex flex-col gap-4 p-1 select-none">
                          <div>
                            <h4 className="text-xs font-semibold text-rose-500 font-mono mb-2 border-b border-border/60 pb-1 uppercase tracking-wide">
                              Header
                            </h4>
                            <JSONTree data={decoded.header || {}} />
                          </div>
                          <div className="mt-2">
                            <h4 className="text-xs font-semibold text-violet-500 font-mono mb-2 border-b border-border/60 pb-1 uppercase tracking-wide">
                              Payload
                            </h4>
                            <JSONTree data={decoded.payload || {}} />
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-28 border border-dashed border-border/80 rounded-xl">
                          Tree explorer nodes will appear here...
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Claims Explanation Table */}
              {decoded.payload && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Claims Breakdown
                  </h3>

                  <div className="border border-border rounded-xl overflow-x-auto bg-card shadow-sm">
                    <div className="max-h-[220px] overflow-y-auto">
                      <table className="min-w-full divide-y divide-border text-xs">
                        <thead className="bg-muted/40 font-medium text-muted-foreground sticky top-0 border-b border-border z-10">
                          <tr>
                            <th className="px-4 py-2 text-left">Claim</th>
                            <th className="px-4 py-2 text-left">Interpretation / Meaning</th>
                            <th className="px-4 py-2 text-left">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {/* Header Claims */}
                          {Object.entries(decoded.header || {}).map(([key, val]) => (
                            <tr key={`header-${key}`} className="hover:bg-muted/15">
                              <td className="px-4 py-2.5 font-mono font-semibold text-rose-500 whitespace-nowrap">
                                {key}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {CLAIM_DESCRIPTIONS[key] || "Custom header property"}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-[11px] text-foreground font-medium break-all">
                                {JSON.stringify(val)}
                              </td>
                            </tr>
                          ))}

                          {/* Payload Claims */}
                          {Object.entries(decoded.payload || {}).map(([key, val]) => {
                            const isTimestamp = (key === "exp" || key === "iat" || key === "nbf" || key === "auth_time" || key === "updated_at");
                            return (
                              <tr key={`payload-${key}`} className="hover:bg-muted/15">
                                <td className="px-4 py-2.5 font-mono font-semibold text-violet-500 whitespace-nowrap">
                                  {key}
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground">
                                  {CLAIM_DESCRIPTIONS[key] || "Custom claim payload property"}
                                </td>
                                <td className="px-4 py-2.5 font-mono text-[11px] text-foreground font-medium break-all">
                                  {isTimestamp ? (
                                    <div className="flex flex-col gap-0.5">
                                      <span>{String(val)}</span>
                                      <span className="text-[10px] text-muted-foreground font-sans">
                                        ({formatTimestamp(val)})
                                      </span>
                                    </div>
                                  ) : (
                                    JSON.stringify(val)
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Error box */}
              {decoded.error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed shadow-sm">
                  <p className="font-semibold mb-1 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Structure Error
                  </p>
                  <p className="mt-1.5">{decoded.error}</p>
                </div>
              )}

            </div>

          </div>
        </div>
      </TooltipProvider>
    </ToolLayout>
  );
}
