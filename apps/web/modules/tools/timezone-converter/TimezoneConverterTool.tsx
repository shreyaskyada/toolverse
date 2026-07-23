'use client';

import React, { useState, useEffect } from 'react';
import {
  useTimezoneConverter,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
  AVAILABLE_TIMEZONES,
  formatDateTz,
  formatTimeTz,
  getGmtOffset,
  getOffsetDiffMinutes,
  formatOffsetDiff,
  getHourInTz,
  getHourStyle,
  getHourBadgeStyle,
} from '@repo/engines/timezone-converter';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Clock,
  Plus,
  Trash2,
  RefreshCw,
  ChevronDown,
  Copy,
  Check,
  MapPin,
  Info,
  Calendar,
  Sliders,
  Share2,
  ArrowUp,
  ArrowDown,
  Pin,
  CalendarDays,
  ExternalLink,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function TimezoneConverterTool() {
  const {
    state,
    meetingSlots,
    setIsLive,
    setCopiedTz,
    setSearchQuery,
    handleDateChange,
    handleTimeChange,
    handleResetToNow,
    handleBlockClick,
    handleSliderChange,
    handleAddTz,
    handleRemoveTz,
    handleMoveTz,
    handlePinTz,
    setBaseDate,
  } = useTimezoneConverter();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyTimezone = (tzName: string) => {
    const formatted = `${formatTimeTz(state.baseDate, tzName)} on ${formatDateTz(state.baseDate, tzName)} (${tzName})`;
    navigator.clipboard.writeText(formatted);
    toast.success(`Copied: ${formatted}`);
    setCopiedTz(tzName);
  };

  const getShareText = () => {
    const formattedDate = formatDateTz(state.baseDate, state.activeTzs[0] || 'UTC');
    let text = `📅 Meeting Schedule: ${formattedDate}\n\n`;
    state.activeTzs.forEach((tz) => {
      const city = tz.split('/').pop()?.replace(/_/g, ' ') || tz;
      text += `- 🕒 ${city}: ${formatTimeTz(state.baseDate, tz)} (${getGmtOffset(state.baseDate, tz)})\n`;
    });
    text += `\nConverted via Jumpytools Timezone Converter`;
    return text;
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(getShareText());
    toast.success('Meeting details copied to clipboard!');
  };

  const getGoogleCalendarUrl = () => {
    const formatUtcDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const startDate = formatUtcDate(state.baseDate);
    const endDate = formatUtcDate(new Date(state.baseDate.getTime() + 60 * 60 * 1000));
    const title = encodeURIComponent('Sync Meeting');
    const details = encodeURIComponent(getShareText());
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
  };

  const getOutlookCalendarUrl = () => {
    const startDate = state.baseDate.toISOString();
    const endDate = new Date(state.baseDate.getTime() + 60 * 60 * 1000).toISOString();
    const title = encodeURIComponent('Sync Meeting');
    const details = encodeURIComponent(getShareText());
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${details}`;
  };

  const getNextMonday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() + (day === 0 ? 1 : 8 - day);
    d.setDate(diff);
    return d;
  };

  const getLocalDateString = () => {
    const year = state.baseDate.getFullYear();
    const month = String(state.baseDate.getMonth() + 1).padStart(2, '0');
    const day = String(state.baseDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTimeString = () => {
    const hours = String(state.baseDate.getHours()).padStart(2, '0');
    const minutes = String(state.baseDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const filteredTzs = AVAILABLE_TIMEZONES.filter(
    (tz) =>
      tz.label.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      tz.value.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-60" />
          <p className="text-xs text-muted-foreground font-semibold">Loading Time Zone Converter...</p>
        </div>
      </div>
    );
  }

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="flex flex-col gap-6">
        {/* Control Header Card */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardContent className="p-5 flex flex-col gap-5">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                {/* Date Pick & Presets */}
                <div className="flex flex-col gap-1.5 w-full sm:w-56">
                  <label htmlFor="base-date-pick" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Select Date
                  </label>
                  <Input
                    id="base-date-pick"
                    type="date"
                    value={getLocalDateString()}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="h-9.5 font-semibold text-xs cursor-pointer select-none"
                  />
                  {/* Date presets */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-2 text-[10px] hover:bg-muted font-bold text-muted-foreground cursor-pointer"
                      onClick={() => {
                        setIsLive(false);
                        const d = new Date();
                        d.setHours(state.baseDate.getHours(), state.baseDate.getMinutes(), 0, 0);
                        setBaseDate(d);
                        toast.success('Set to Today');
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-2 text-[10px] hover:bg-muted font-bold text-muted-foreground cursor-pointer"
                      onClick={() => {
                        setIsLive(false);
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        d.setHours(state.baseDate.getHours(), state.baseDate.getMinutes(), 0, 0);
                        setBaseDate(d);
                        toast.success('Set to Tomorrow');
                      }}
                    >
                      Tomorrow
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-2 text-[10px] hover:bg-muted font-bold text-muted-foreground cursor-pointer"
                      onClick={() => {
                        setIsLive(false);
                        const d = getNextMonday();
                        d.setHours(state.baseDate.getHours(), state.baseDate.getMinutes(), 0, 0);
                        setBaseDate(d);
                        toast.success('Set to Next Monday');
                      }}
                    >
                      Next Mon
                    </Button>
                  </div>
                </div>

                {/* Time Selector */}
                <div className="flex flex-col gap-1.5 w-full sm:w-44 self-start">
                  <label htmlFor="base-time-pick" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Select Time
                  </label>
                  <Input
                    id="base-time-pick"
                    type="time"
                    value={getTimeString()}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="h-9.5 font-semibold text-xs cursor-pointer select-none"
                  />
                </div>
              </div>

              {/* Top Action buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end self-start md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToNow}
                  className="h-9 px-3.5 cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${state.isLive ? 'animate-spin text-emerald-500' : ''}`} />
                  {state.isLive ? 'Live Clock Active' : 'Reset to Current Time'}
                </Button>

                <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                  <DialogTrigger
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'sm' }),
                      'h-9 px-3.5 text-xs flex items-center gap-1.5 cursor-pointer'
                    )}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share Meeting
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-md sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-base font-bold">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        Share Sync Meeting
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        Review conversions and copy coordinates or add this directly to calendars.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mt-2">
                      {/* Plain Text Display */}
                      <div className="relative">
                        <pre className="p-3 text-[11px] font-mono border rounded-lg bg-muted/30 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {getShareText()}
                        </pre>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleCopyShareText}
                          className="absolute right-2.5 bottom-2.5 h-7 text-[10px] gap-1 cursor-pointer"
                        >
                          <Copy className="h-3 w-3" />
                          Copy Details
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-foreground">Direct Calendar Actions</h4>
                        <div className="grid grid-cols-2 gap-3.5">
                          <a
                            href={getGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-border p-2.5 text-center text-xs font-bold transition hover:bg-muted/50 cursor-pointer"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                            Google Calendar
                          </a>
                          <a
                            href={getOutlookCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-border p-2.5 text-center text-xs font-bold transition hover:bg-muted/50 cursor-pointer"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                            Outlook Calendar
                          </a>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Add Time Zone Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-9 items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-3.5 py-1.5 text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left font-semibold text-foreground">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Time Zone
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 text-xs max-h-72 overflow-y-auto" align="end">
                    <div className="p-2 border-b border-border/50 sticky top-0 bg-popover z-10">
                      <Input
                        type="text"
                        placeholder="Search time zone or city..."
                        value={state.searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 text-xs font-medium focus-visible:ring-primary shadow-sm"
                      />
                    </div>
                    {filteredTzs.length === 0 ? (
                      <div className="text-center text-muted-foreground p-3 text-[11px]">No zones found</div>
                    ) : (
                      filteredTzs.map((tz) => (
                        <DropdownMenuItem
                          key={tz.value}
                          onClick={() => handleAddTz(tz.value)}
                          disabled={state.activeTzs.includes(tz.value)}
                          className="cursor-pointer py-1.5 flex justify-between items-center"
                        >
                          <span>{tz.label}</span>
                          {state.activeTzs.includes(tz.value) && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                              Added
                            </span>
                          )}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Master time slider */}
            <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
              <div className="flex flex-col gap-2 bg-muted/20 border border-border/40 p-4 rounded-xl">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5" />
                    Drag Slider to Scrub Time (15m Intervals)
                  </span>
                  <span className="font-mono text-primary font-bold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                    {formatTimeTz(state.baseDate, state.activeTzs[0] || 'UTC')} ({state.activeTzs[0]?.split('/').pop()?.replace(/_/g, ' ')})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={state.baseDate.getHours() * 4 + Math.floor(state.baseDate.getMinutes() / 15)}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-1 focus:ring-primary py-1"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground font-bold px-1 font-mono">
                  <span>12:00 AM (Midnight)</span>
                  <span>6:00 AM</span>
                  <span>12:00 PM (Noon)</span>
                  <span>6:00 PM</span>
                  <span>11:45 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timezone Cards Listing */}
        <div className="flex flex-col gap-4">
          {state.activeTzs.map((tz, index) => {
            const isMainTz = index === 0;
            const currentHour = getHourInTz(state.baseDate, tz);
            const offsetMinutes = getOffsetDiffMinutes(state.baseDate, state.activeTzs[0] || 'UTC', tz);
            const offsetDiffFormatted = formatOffsetDiff(offsetMinutes);
            const gmtOffset = getGmtOffset(state.baseDate, tz);
            const formattedTime = formatTimeTz(state.baseDate, tz);
            const formattedDate = formatDateTz(state.baseDate, tz);
            const activeStyle = getHourStyle(currentHour, true);
            const badgeStyle = getHourBadgeStyle(currentHour);

            return (
              <Card
                key={tz}
                className={`border bg-card overflow-hidden shadow-sm relative group transition-all duration-200 ${
                  isMainTz ? 'border-primary/30 ring-1 ring-primary/15' : 'border-border/80'
                }`}
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  {/* Timezone Main info row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isMainTz ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="font-bold text-foreground text-sm tracking-tight">
                            {tz.split('/').pop()?.replace(/_/g, ' ')}
                          </h3>
                          <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-mono font-bold leading-normal">
                            {gmtOffset}
                          </Badge>
                          {!isMainTz && (
                            <Badge
                              variant="outline"
                              className={`text-[9px] py-0 px-1.5 font-bold leading-normal ${
                                offsetMinutes >= 0
                                  ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                                  : 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5'
                              }`}
                            >
                              {offsetDiffFormatted} {offsetMinutes > 0 ? 'ahead' : offsetMinutes < 0 ? 'behind' : ''}
                            </Badge>
                          )}
                          {isMainTz && (
                            <Badge
                              variant="outline"
                              className="text-[9px] py-0 px-1.5 border-primary/30 text-primary bg-primary/5 font-extrabold leading-normal"
                            >
                              Primary Home
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{tz}</p>
                      </div>
                    </div>

                    {/* Visual Date-Time values & interactive buttons */}
                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <div className="text-right">
                        <p className="font-mono text-2xl font-black text-foreground leading-none tracking-tight">
                          {formattedTime}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-semibold">{formattedDate}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Move Up Button */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveTz(index, 'up')}
                          className="h-8 w-8 rounded-lg cursor-pointer opacity-40 group-hover:opacity-100 disabled:opacity-20 transition-all hover:bg-muted flex items-center justify-center disabled:cursor-not-allowed text-foreground"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Down Button */}
                        <button
                          type="button"
                          disabled={index === state.activeTzs.length - 1}
                          onClick={() => handleMoveTz(index, 'down')}
                          className="h-8 w-8 rounded-lg cursor-pointer opacity-40 group-hover:opacity-100 disabled:opacity-20 transition-all hover:bg-muted flex items-center justify-center disabled:cursor-not-allowed text-foreground"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Pin to Home Button */}
                        {!isMainTz && (
                          <button
                            type="button"
                            onClick={() => handlePinTz(index)}
                            className="h-8 w-8 rounded-lg cursor-pointer opacity-40 group-hover:opacity-100 hover:text-primary transition-all hover:bg-muted flex items-center justify-center text-foreground"
                            title="Pin as Primary Timezone"
                          >
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Copy Action Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyTimezone(tz)}
                          className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted flex items-center justify-center text-foreground"
                          title="Copy Time details"
                        >
                          {state.copiedTz === tz ? (
                            <Check className="h-4.5 w-4.5 text-green-500 animate-bounce" />
                          ) : (
                            <Copy className="h-4.5 w-4.5" />
                          )}
                        </button>

                        {/* Remove timezone Button */}
                        {!isMainTz && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTz(tz)}
                            className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer flex items-center justify-center transition-colors hover:bg-destructive/5"
                            title="Remove Timezone"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 24-hour visual blocks visualizer */}
                  <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1.5">
                      <span className="flex items-center gap-1">
                        <Info className="h-3.5 w-3.5 text-primary/75" />
                        Click any hour cell to synchronize all time zones to that hour.
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded-full border text-[9px] ${badgeStyle}`}>
                        {activeStyle.indicator} {activeStyle.label} at Selected Time
                      </span>
                    </div>

                    {/* 24 slots grid */}
                    <div className="grid grid-cols-24 gap-1 w-full bg-muted/20 border border-border/30 rounded-xl p-2 overflow-x-auto min-w-[320px]">
                      {Array.from({ length: 24 }).map((_, h) => {
                        const isSelected = h === currentHour;
                        const style = getHourStyle(h, isSelected);

                        return (
                          <button
                            key={h}
                            onClick={() => handleBlockClick(tz, h)}
                            className={`
                              h-8.5 rounded-md flex flex-col items-center justify-center font-mono text-[10px] font-bold border transition-all cursor-pointer select-none outline-none focus:ring-1 focus:ring-primary/40
                              ${style.bg}
                              ${
                                isSelected
                                  ? 'ring-2 ring-primary/30 ring-offset-1 dark:ring-offset-card relative z-10 font-extrabold'
                                  : ''
                              }
                            `}
                            title={`Click to set schedule to ${h}:00 (${style.label})`}
                          >
                            <span>{h}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold mt-1.5 px-1 font-mono">
                      <span>12 AM (Midnight)</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Working Hours (9am-5pm)
                      </span>
                      <span>12 PM (Noon)</span>
                      <span className="text-indigo-400 font-bold flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Sleeping Hours
                        (10pm-6am)
                      </span>
                      <span>11 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Meeting Overlap Planner Panel */}
        {state.activeTzs.length > 1 && (
          <Card className="border border-border/80 bg-card shadow-sm mt-2">
            <CardHeader className="p-5 pb-2 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                <Users className="h-4.5 w-4.5 text-primary" />
                Smart Meeting Overlap Planner
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Calculated overlap windows based on waking & working slots across all active locations.
              </p>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetingSlots.map((slot, sIdx) => {
                  const isOptimal = slot.quality === 'Optimal';
                  const isFair = slot.quality === 'Fair';
                  const statusBg = isOptimal
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : isFair
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-muted text-muted-foreground border-transparent';

                  return (
                    <div
                      key={sIdx}
                      className="flex flex-col justify-between p-4 border border-border/60 bg-muted/10 rounded-xl gap-3 hover:border-primary/20 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-foreground">{slot.label} Slot</span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            (in {state.activeTzs[0]?.split('/').pop()?.replace(/_/g, ' ')})
                          </span>
                        </div>
                        <Badge className={`text-[10px] font-bold py-0.5 px-2 ${statusBg}`}>
                          {slot.quality === 'Optimal' ? '🟢 Best Overlap' : '🟡 Fair Overlap'}
                        </Badge>
                      </div>

                      {/* Zone Times list */}
                      <div className="flex flex-col gap-1.5">
                        {slot.times.map((t, tIdx) => (
                          <div key={tIdx} className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground font-semibold">{t.tzName}</span>
                            <span
                              className={`font-mono flex items-center gap-1 ${
                                t.isSleep
                                  ? 'text-indigo-400 dark:text-indigo-300 font-normal'
                                  : t.label === 'Work'
                                    ? 'text-emerald-500 font-extrabold'
                                    : 'text-amber-500 font-bold'
                              }`}
                            >
                              {t.isSleep ? '🌙' : t.label === 'Work' ? '💼' : '🏠'} {t.formatted}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsLive(false);
                          setBaseDate(slot.dateObj);
                          toast.success(`Adjusted schedule to slot starting at ${slot.label}`);
                        }}
                        className="w-full text-xs h-8 cursor-pointer mt-1"
                      >
                        Apply This Meeting Time
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
