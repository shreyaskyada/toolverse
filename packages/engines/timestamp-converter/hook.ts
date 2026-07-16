import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimestampConverterState, EpochDetails, DateToEpochDetails } from './types';
import { getRelativeTime, getLocalDateTimeString } from './engine';

export function useTimestampConverter() {
  const [state, setState] = useState<TimestampConverterState>({
    currentUnix: Math.floor(Date.now() / 1000),
    currentMs: Date.now(),
    isClockRunning: true,
    copiedClockSec: false,
    copiedClockMs: false,

    epochInput: Math.floor(Date.now() / 1000).toString(),
    unitMode: 'auto',
    copiedField: null,

    dateInput: getLocalDateTimeString(),
    dateTz: 'local',
    dateMsOffset: 0,
    copiedEpochSec: false,
    copiedEpochMs: false,
  });

  // Clock ticking side effect
  useEffect(() => {
    if (!state.isClockRunning) return;
    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        currentUnix: Math.floor(Date.now() / 1000),
        currentMs: Date.now(),
      }));
    }, 250);
    return () => clearInterval(timer);
  }, [state.isClockRunning]);

  // Clean copied checks
  useEffect(() => {
    if (state.copiedClockSec) {
      const t = setTimeout(() => setState((prev) => ({ ...prev, copiedClockSec: false })), 2000);
      return () => clearTimeout(t);
    }
  }, [state.copiedClockSec]);

  useEffect(() => {
    if (state.copiedClockMs) {
      const t = setTimeout(() => setState((prev) => ({ ...prev, copiedClockMs: false })), 2000);
      return () => clearTimeout(t);
    }
  }, [state.copiedClockMs]);

  useEffect(() => {
    if (state.copiedField) {
      const t = setTimeout(() => setState((prev) => ({ ...prev, copiedField: null })), 2000);
      return () => clearTimeout(t);
    }
  }, [state.copiedField]);

  useEffect(() => {
    if (state.copiedEpochSec) {
      const t = setTimeout(() => setState((prev) => ({ ...prev, copiedEpochSec: false })), 2000);
      return () => clearTimeout(t);
    }
  }, [state.copiedEpochSec]);

  useEffect(() => {
    if (state.copiedEpochMs) {
      const t = setTimeout(() => setState((prev) => ({ ...prev, copiedEpochMs: false })), 2000);
      return () => clearTimeout(t);
    }
  }, [state.copiedEpochMs]);

  // --- SETTERS ---
  const setIsClockRunning = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, isClockRunning: val }));
  }, []);

  const setEpochInput = useCallback((val: string) => {
    setState((prev) => ({ ...prev, epochInput: val }));
  }, []);

  const setUnitMode = useCallback((val: 'auto' | 'seconds' | 'ms') => {
    setState((prev) => ({ ...prev, unitMode: val }));
  }, []);

  const setDateInput = useCallback((val: string) => {
    setState((prev) => ({ ...prev, dateInput: val }));
  }, []);

  const setDateTz = useCallback((val: 'local' | 'utc') => {
    setState((prev) => ({ ...prev, dateTz: val }));
  }, []);

  const setDateMsOffset = useCallback((val: number) => {
    setState((prev) => ({ ...prev, dateMsOffset: val }));
  }, []);

  const setCopiedClockSec = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, copiedClockSec: val }));
  }, []);

  const setCopiedClockMs = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, copiedClockMs: val }));
  }, []);

  const setCopiedEpochSec = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, copiedEpochSec: val }));
  }, []);

  const setCopiedEpochMs = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, copiedEpochMs: val }));
  }, []);

  const setCopiedField = useCallback((val: string | null) => {
    setState((prev) => ({ ...prev, copiedField: val }));
  }, []);

  // --- COMPUTATIONS ---
  const epochDetails = useMemo<EpochDetails>(() => {
    const rawVal = state.epochInput.trim();
    if (!rawVal) {
      return { error: 'Please enter a timestamp.' };
    }

    const numVal = Number(rawVal);
    if (isNaN(numVal)) {
      return { error: 'Invalid timestamp: Not a number.' };
    }

    let isMs = false;
    if (state.unitMode === 'ms') {
      isMs = true;
    } else if (state.unitMode === 'seconds') {
      isMs = false;
    } else {
      isMs = rawVal.length >= 12 || numVal > 30000000000;
    }

    const finalMs = isMs ? numVal : numVal * 1000;
    const dateObj = new Date(finalMs);

    if (isNaN(dateObj.getTime())) {
      return { error: 'Invalid timestamp range.' };
    }

    const localFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const utcFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'UTC',
    });

    return {
      detectedUnit: isMs ? 'Milliseconds' : 'Seconds',
      localStr: localFormatter.format(dateObj),
      utcStr: utcFormatter.format(dateObj),
      isoStr: dateObj.toISOString(),
      utcStringStr: dateObj.toUTCString(),
      relativeStr: getRelativeTime(finalMs),
    };
  }, [state.epochInput, state.unitMode]);

  const dateToEpochDetails = useMemo<DateToEpochDetails>(() => {
    if (!state.dateInput) {
      return { error: 'Please pick a date.' };
    }

    try {
      let parsedMs = 0;
      if (state.dateTz === 'utc') {
        const [yr, mo, dy, hr, mn] = state.dateInput.split(/[-T:]/).map(Number);
        if (yr === undefined || mo === undefined || dy === undefined || hr === undefined || mn === undefined) {
          return { error: 'Invalid date format.' };
        }
        parsedMs = Date.UTC(yr, mo - 1, dy, hr, mn, 0) + state.dateMsOffset;
      } else {
        parsedMs = new Date(state.dateInput).getTime() + state.dateMsOffset;
      }

      if (isNaN(parsedMs)) {
        return { error: 'Invalid date value.' };
      }

      const secVal = Math.floor(parsedMs / 1000);

      return {
        sec: secVal.toString(),
        ms: parsedMs.toString(),
        relative: getRelativeTime(parsedMs),
      };
    } catch {
      return { error: 'Error parsing date.' };
    }
  }, [state.dateInput, state.dateTz, state.dateMsOffset]);

  return {
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
  };
}
