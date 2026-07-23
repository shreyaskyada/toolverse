'use client';

import React from 'react';
import {
  useAgeCalculator,
  TOOL_METADATA,
  TOOL_FAQS,
  TOOL_ABOUT,
} from '@repo/engines/age-calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Hourglass,
  Clock,
  Sparkles,
  Heart,
  Wind,
  Moon,
  Gift,
} from 'lucide-react';
import { ToolLayout } from '@/components/layout/ToolLayout';

export function AgeCalculatorTool() {
  const { state, setBirthDateInput, setTargetDateInput } = useAgeCalculator();

  const formattedStat = (val: number) => {
    return val.toLocaleString();
  };

  return (
    <ToolLayout
      metadata={TOOL_METADATA}
      faqs={TOOL_FAQS}
      aboutParagraphs={TOOL_ABOUT}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Date Inputs Panel (1 col) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border border-border/80 bg-card shadow-xs">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-amber-500" />
                Select Dates
              </h3>
            </div>
            <CardContent className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Date of Birth</label>
                <Input
                  type="date"
                  value={state.birthDateInput}
                  onChange={(e) => setBirthDateInput(e.target.value)}
                  className="w-full h-11 px-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Calculate Age At</label>
                <Input
                  type="date"
                  value={state.targetDateInput}
                  onChange={(e) => setTargetDateInput(e.target.value)}
                  className="w-full h-11 px-3"
                />
              </div>
            </CardContent>
          </Card>

          {state.result && (
            <Card className="border border-border/80 bg-card shadow-xs">
              <div className="px-5 py-4 border-b border-border/60">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Gift className="h-4 w-4 text-amber-500" />
                  Zodiac & Birthday Info
                </h3>
              </div>
              <CardContent className="p-5 flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Born on:</span>
                  <span className="font-bold text-foreground">{state.result.dayOfWeek}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Sun Sign:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{state.result.zodiac}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground font-medium">Chinese Zodiac:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{state.result.chineseZodiac}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Panel (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {state.result ? (
            <>
              {/* Primary Age Output Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-4xl md:text-5xl font-black text-amber-600 dark:text-amber-400">
                    {state.result.years}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase mt-2 tracking-wider">
                    Years
                  </span>
                </div>

                <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-4xl md:text-5xl font-black text-amber-600 dark:text-amber-400">
                    {state.result.months}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase mt-2 tracking-wider">
                    Months
                  </span>
                </div>

                <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-4xl md:text-5xl font-black text-amber-600 dark:text-amber-400">
                    {state.result.days}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase mt-2 tracking-wider">
                    Days
                  </span>
                </div>
              </div>

              {/* Next Birthday Timer Banner */}
              <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl p-5 md:p-6 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    Next Birthday Countdown
                  </span>
                  <h4 className="text-lg font-black text-foreground">
                    In {state.result.nextBirthday.months} months and {state.result.nextBirthday.days} days
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Next birthday falls on a <span className="font-bold">{state.result.nextBirthday.dayOfWeek}</span>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Hourglass className="h-6 w-6 animate-pulse" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Lifetime Age Summary
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="border border-border/60 rounded-xl p-4 bg-muted/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Months</span>
                    <span className="text-lg font-extrabold text-foreground mt-1 block">
                      {formattedStat(state.result.totalMonths)}
                    </span>
                  </div>

                  <div className="border border-border/60 rounded-xl p-4 bg-muted/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Weeks</span>
                    <span className="text-lg font-extrabold text-foreground mt-1 block">
                      {formattedStat(state.result.totalWeeks)}
                    </span>
                  </div>

                  <div className="border border-border/60 rounded-xl p-4 bg-muted/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Days</span>
                    <span className="text-lg font-extrabold text-foreground mt-1 block">
                      {formattedStat(state.result.totalDays)}
                    </span>
                  </div>

                  <div className="border border-border/60 rounded-xl p-4 bg-muted/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Hours</span>
                    <span className="text-lg font-extrabold text-foreground mt-1 block">
                      {formattedStat(state.result.totalHours)}
                    </span>
                  </div>

                  <div className="border border-border/60 rounded-xl p-4 bg-muted/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Minutes</span>
                    <span className="text-lg font-extrabold text-foreground mt-1 block">
                      {formattedStat(state.result.totalMinutes)}
                    </span>
                  </div>

                  <div className="border border-border/60 rounded-xl p-4 bg-muted/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Seconds</span>
                    <span className="text-lg font-extrabold text-foreground mt-1 block">
                      {formattedStat(state.result.totalSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Life Milestone estimates */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Estimated Life Milestones
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-border/60 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Heartbeats</span>
                      <span className="text-base font-extrabold text-foreground mt-1 block">
                        {formattedStat(state.result.milestones.heartbeats)}
                      </span>
                    </div>
                  </div>

                  <div className="border border-border/60 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                      <Wind className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Breaths Taken</span>
                      <span className="text-base font-extrabold text-foreground mt-1 block">
                        {formattedStat(state.result.milestones.breaths)}
                      </span>
                    </div>
                  </div>

                  <div className="border border-border/60 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Hours Slept</span>
                      <span className="text-base font-extrabold text-foreground mt-1 block">
                        {formattedStat(state.result.milestones.sleepHours)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Please enter valid dates to calculate your age.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
export default AgeCalculatorTool;
