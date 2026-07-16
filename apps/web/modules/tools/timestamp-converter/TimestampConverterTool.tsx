'use client';

import React from 'react';
import {
  useTimestampConverter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/timestamp-converter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Clock,
  Calendar,
  Check,
  Clipboard,
  Pause,
  Play,
  ArrowRightLeft,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function TimestampConverterTool() {
  const {
    state,
    epochDetails,
    dateToEpochDetails,
    setIsClockRunning,
    setEpochInput,
    setUnitMode,
    setDateInput,
    setDateTz,
    setDateMsOffset,
    setCopiedClockSec,
    setCopiedClockMs,
    setCopiedEpochSec,
    setCopiedEpochMs,
    setCopiedField,
  } = useTimestampConverter();

  const handleCopyText = (text: string, fieldName: string, setCopiedState?: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${fieldName} to clipboard!`);
    if (setCopiedState) {
      setCopiedState(true);
    } else {
      setCopiedField(fieldName);
    }
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        {/* Real-time Ticking Clock Card */}
        <Card className="border border-border/80 bg-card overflow-hidden shadow-sm">
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Live Unix Epoch Clock
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="font-mono text-base font-bold text-foreground">{state.currentUnix}</span>
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold">seconds</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-mono text-base font-bold text-foreground">{state.currentMs}</span>
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold">milliseconds</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsClockRunning(!state.isClockRunning)}
                className="h-8.5 px-3 cursor-pointer text-xs"
              >
                {state.isClockRunning ? (
                  <Pause className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                )}
                {state.isClockRunning ? 'Pause Clock' : 'Resume Clock'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyText(state.currentUnix.toString(), 'current seconds timestamp', setCopiedClockSec)}
                className="h-8.5 px-3 cursor-pointer text-xs"
              >
                {state.copiedClockSec ? (
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                ) : (
                  <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                )}
                Copy Seconds
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyText(state.currentMs.toString(), 'current milliseconds timestamp', setCopiedClockMs)}
                className="h-8.5 px-3 cursor-pointer text-xs"
              >
                {state.copiedClockMs ? (
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                ) : (
                  <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                )}
                Copy Milliseconds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid Converter Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Left Side: Epoch to Human Date */}
          <Card className="border border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                Epoch to Human-Readable Date
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-5">
              {/* Input and Mode Selector */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="epoch-input" className="text-xs font-semibold text-muted-foreground">
                    Enter Unix Epoch Timestamp
                  </label>
                  <Input
                    id="epoch-input"
                    type="text"
                    value={state.epochInput}
                    onChange={(e) => setEpochInput(e.target.value)}
                    placeholder="e.g. 1719310800"
                    className="h-9.5 focus-visible:ring-primary shadow-sm font-mono"
                  />
                </div>
                <div className="w-full sm:w-44 flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Timestamp Unit</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left font-semibold text-foreground">
                      <span className="truncate">
                        {state.unitMode === 'auto' && 'Auto-Detect Unit'}
                        {state.unitMode === 'seconds' && 'Seconds (10 digits)'}
                        {state.unitMode === 'ms' && 'Milliseconds (13 digits)'}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--anchor-width) min-w-[176px] text-xs">
                      <DropdownMenuItem onClick={() => setUnitMode('auto')}>Auto-Detect Unit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUnitMode('seconds')}>Seconds (10 digits)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUnitMode('ms')}>Milliseconds (13 digits)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Conversion Output Panel */}
              <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
                {epochDetails.error ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2.5 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{epochDetails.error}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Conversion Results
                      </span>
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        Detected: {epochDetails.detectedUnit}
                      </Badge>
                    </div>

                    {/* Local Time Zone */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">Local Time Zone</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleCopyText(epochDetails.localStr || '', 'local time')}
                          className="h-6 gap-1 text-[10px] cursor-pointer"
                        >
                          {state.copiedField === 'local time' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-semibold text-foreground leading-relaxed">
                        {epochDetails.localStr}
                      </div>
                    </div>

                    {/* UTC Time Zone */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">UTC Time Zone</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleCopyText(epochDetails.utcStr || '', 'UTC time')}
                          className="h-6 gap-1 text-[10px] cursor-pointer"
                        >
                          {state.copiedField === 'UTC time' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-semibold text-foreground leading-relaxed">
                        {epochDetails.utcStr}
                      </div>
                    </div>

                    {/* ISO 8601 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">ISO 8601 String</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleCopyText(epochDetails.isoStr || '', 'ISO 8601 string')}
                          className="h-6 gap-1 text-[10px] cursor-pointer"
                        >
                          {state.copiedField === 'ISO 8601 string' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono text-foreground leading-relaxed">
                        {epochDetails.isoStr}
                      </div>
                    </div>

                    {/* RFC 2822 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">RFC 2822 / UTC String</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleCopyText(epochDetails.utcStringStr || '', 'RFC 2822 string')}
                          className="h-6 gap-1 text-[10px] cursor-pointer"
                        >
                          {state.copiedField === 'RFC 2822 string' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono text-foreground leading-relaxed">
                        {epochDetails.utcStringStr}
                      </div>
                    </div>

                    {/* Relative Human Time */}
                    <div className="flex justify-between items-center bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-xs">
                      <span className="font-semibold text-muted-foreground">Relative Calendar Distance:</span>
                      <span className="font-bold text-primary">{epochDetails.relativeStr}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Side: Human Date to Epoch */}
          <Card className="border border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ArrowRightLeft className="h-4.5 w-4.5 text-primary" />
                Human-Readable Date to Epoch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-5">
              {/* Pick Date-Time */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="date-input" className="text-xs font-semibold text-muted-foreground">
                  Select Date and Time
                </label>
                <Input
                  id="date-input"
                  type="datetime-local"
                  value={state.dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="h-9.5 focus-visible:ring-primary shadow-sm font-semibold select-none cursor-pointer"
                />
              </div>

              {/* Timezone and Milliseconds adjustments */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Interpret Selected Date As</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left font-semibold text-foreground">
                      <span className="truncate">
                        {state.dateTz === 'local'
                          ? 'Local Time Zone (System Time)'
                          : 'Coordinated Universal Time (UTC/GMT)'}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--anchor-width) min-w-[220px] text-xs">
                      <DropdownMenuItem onClick={() => setDateTz('local')}>
                        Local Time Zone (System Time)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateTz('utc')}>
                        Coordinated Universal Time (UTC/GMT)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="w-full sm:w-36 flex flex-col gap-1.5">
                  <label htmlFor="ms-offset-input" className="text-xs font-semibold text-muted-foreground">
                    Add Milliseconds
                  </label>
                  <Input
                    id="ms-offset-input"
                    type="number"
                    min={0}
                    max={999}
                    value={state.dateMsOffset}
                    onChange={(e) =>
                      setDateMsOffset(Math.max(0, Math.min(999, parseInt(e.target.value, 10) || 0)))
                    }
                    className="h-9.5 focus-visible:ring-primary shadow-sm font-mono"
                  />
                </div>
              </div>

              {/* Conversion Output Panel */}
              <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
                {dateToEpochDetails.error ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2.5 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{dateToEpochDetails.error}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Converted Epoch Output
                    </span>

                    {/* Unix Epoch (Seconds) */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">Seconds Timestamp (10 digits)</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            handleCopyText(dateToEpochDetails.sec || '', 'seconds timestamp', setCopiedEpochSec)
                          }
                          className="h-6 gap-1 text-[10px] cursor-pointer"
                        >
                          {state.copiedEpochSec ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono font-bold text-foreground leading-relaxed">
                        {dateToEpochDetails.sec}
                      </div>
                    </div>

                    {/* Unix Epoch (Milliseconds) */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">Milliseconds Timestamp (13 digits)</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            handleCopyText(dateToEpochDetails.ms || '', 'milliseconds timestamp', setCopiedEpochMs)
                          }
                          className="h-6 gap-1 text-[10px] cursor-pointer"
                        >
                          {state.copiedEpochMs ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono font-bold text-foreground leading-relaxed">
                        {dateToEpochDetails.ms}
                      </div>
                    </div>

                    {/* Relative Distance */}
                    <div className="flex justify-between items-center bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-xs">
                      <span className="font-semibold text-muted-foreground">Relative Calendar Distance:</span>
                      <span className="font-bold text-primary">{dateToEpochDetails.relative}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </ToolLayout>
  );
}
