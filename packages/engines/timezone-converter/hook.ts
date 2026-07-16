import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimezoneConverterState, MeetingSlot } from './types';
import { getHourInTz, formatTimeTz } from './engine';

const getLocalTz = () => {
  if (typeof Intl !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }
  return 'UTC';
};

export function useTimezoneConverter() {
  const localTz = useMemo(() => getLocalTz(), []);
  const initialTzs = useMemo(() => {
    return [localTz, 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'].filter(
      (v, i, a) => a.indexOf(v) === i
    );
  }, [localTz]);

  const [state, setState] = useState<TimezoneConverterState>({
    baseDate: new Date(),
    isLive: true,
    copiedTz: null,
    searchQuery: '',
    activeTzs: initialTzs,
  });

  // Ticking effect
  useEffect(() => {
    if (!state.isLive) return;
    const timer = setInterval(() => {
      setState((prev) => ({ ...prev, baseDate: new Date() }));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.isLive]);

  // Clean copied checks
  useEffect(() => {
    if (state.copiedTz) {
      const t = setTimeout(() => setState((prev) => ({ ...prev, copiedTz: null })), 2000);
      return () => clearTimeout(t);
    }
  }, [state.copiedTz]);

  const setBaseDate = useCallback((val: Date) => {
    setState((prev) => ({ ...prev, baseDate: val }));
  }, []);

  const setIsLive = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, isLive: val }));
  }, []);

  const setCopiedTz = useCallback((val: string | null) => {
    setState((prev) => ({ ...prev, copiedTz: val }));
  }, []);

  const setSearchQuery = useCallback((val: string) => {
    setState((prev) => ({ ...prev, searchQuery: val }));
  }, []);

  const setActiveTzs = useCallback((val: string[]) => {
    setState((prev) => ({ ...prev, activeTzs: val }));
  }, []);

  // Preset Date calculations
  const handleDateChange = useCallback((dateString: string) => {
    if (!dateString) return;
    const [year, month, day] = dateString.split('-').map(Number);
    if (year === undefined || month === undefined || day === undefined) return;
    setState((prev) => {
      const updatedDate = new Date(prev.baseDate);
      updatedDate.setFullYear(year, month - 1, day);
      return { ...prev, isLive: false, baseDate: updatedDate };
    });
  }, []);

  const handleTimeChange = useCallback((timeString: string) => {
    if (!timeString) return;
    const [hours, minutes] = timeString.split(':').map(Number);
    if (hours === undefined || minutes === undefined) return;
    setState((prev) => {
      const updatedDate = new Date(prev.baseDate);
      updatedDate.setHours(hours, minutes, 0, 0);
      return { ...prev, isLive: false, baseDate: updatedDate };
    });
  }, []);

  const handleResetToNow = useCallback(() => {
    setState((prev) => ({ ...prev, isLive: true, baseDate: new Date() }));
  }, []);

  // Block click
  const handleBlockClick = useCallback((tz: string, targetHour: number) => {
    setState((prev) => {
      let updatedDate: Date;
      try {
        const currentHourInTz = getHourInTz(prev.baseDate, tz);
        const diffHours = targetHour - currentHourInTz;

        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          minute: 'numeric',
          second: 'numeric',
        }).formatToParts(prev.baseDate);

        const currentMins = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
        const currentSecs = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);

        const msAdjustment = (diffHours * 3600000) - (currentMins * 60000) - (currentSecs * 1000);
        updatedDate = new Date(prev.baseDate.getTime() + msAdjustment);
      } catch {
        const currentHourInTz = getHourInTz(prev.baseDate, tz);
        const diffHours = targetHour - currentHourInTz;
        updatedDate = new Date(prev.baseDate.getTime() + diffHours * 3600000);
        updatedDate.setMinutes(0, 0, 0);
      }
      return { ...prev, isLive: false, baseDate: updatedDate };
    });
  }, []);

  // Slider change
  const handleSliderChange = useCallback((sliderValue: number) => {
    const hours = Math.floor(sliderValue / 4);
    const minutes = (sliderValue % 4) * 15;
    setState((prev) => {
      const updatedDate = new Date(prev.baseDate);
      updatedDate.setHours(hours, minutes, 0, 0);
      return { ...prev, isLive: false, baseDate: updatedDate };
    });
  }, []);

  // Add TZ
  const handleAddTz = useCallback((tz: string) => {
    setState((prev) => {
      if (prev.activeTzs.includes(tz)) {
        return prev;
      }
      return { ...prev, activeTzs: [...prev.activeTzs, tz] };
    });
  }, []);

  // Remove TZ
  const handleRemoveTz = useCallback((tz: string) => {
    setState((prev) => {
      if (prev.activeTzs.length <= 1) return prev;
      return { ...prev, activeTzs: prev.activeTzs.filter((t) => t !== tz) };
    });
  }, []);

  // Move TZ
  const handleMoveTz = useCallback((index: number, direction: 'up' | 'down') => {
    setState((prev) => {
      const updated = [...prev.activeTzs];
      if (direction === 'up' && index > 0) {
        const temp = updated[index];
        if (temp !== undefined && updated[index - 1] !== undefined) {
          updated[index] = updated[index - 1] as string;
          updated[index - 1] = temp;
        }
      } else if (direction === 'down' && index < prev.activeTzs.length - 1) {
        const temp = updated[index];
        if (temp !== undefined && updated[index + 1] !== undefined) {
          updated[index] = updated[index + 1] as string;
          updated[index + 1] = temp;
        }
      }
      return { ...prev, activeTzs: updated };
    });
  }, []);

  // Pin TZ
  const handlePinTz = useCallback((index: number) => {
    if (index === 0) return;
    setState((prev) => {
      const updated = [...prev.activeTzs];
      const target = updated.splice(index, 1)[0];
      if (target !== undefined) {
        updated.unshift(target);
      }
      return { ...prev, activeTzs: updated };
    });
  }, []);

  // Overlap Meeting calculations
  const meetingSlots = useMemo<MeetingSlot[]>(() => {
    if (state.activeTzs.length === 0) return [];
    const primaryTz = state.activeTzs[0] || 'UTC';
    const slots: MeetingSlot[] = [];

    for (let h = 0; h < 24; h++) {
      const currentHourInPrimary = getHourInTz(state.baseDate, primaryTz);
      const diffHours = h - currentHourInPrimary;

      let currentMins = 0;
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: primaryTz,
          minute: 'numeric',
        }).formatToParts(state.baseDate);
        currentMins = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
      } catch {}

      const slotDate = new Date(state.baseDate.getTime() + (diffHours * 3600000) - (currentMins * 60000));
      slotDate.setSeconds(0, 0);

      let totalScore = 0;
      let sleepCount = 0;
      let workCount = 0;
      const times: MeetingSlot['times'] = [];

      state.activeTzs.forEach((tz) => {
        const hr = getHourInTz(slotDate, tz);
        const isSleep = hr >= 22 || hr < 6;
        const isWork = hr >= 9 && hr < 17;

        let score = 1; // Personal
        let label = 'Personal';
        if (isSleep) {
          score = -5;
          sleepCount++;
          label = 'Sleep';
        } else if (isWork) {
          score = 2;
          workCount++;
          label = 'Work';
        }
        totalScore += score;

        let formattedTime = '';
        try {
          formattedTime = formatTimeTz(slotDate, tz);
        } catch {
          formattedTime = `${hr}:00`;
        }

        times.push({
          tzName: tz.split('/').pop()?.replace(/_/g, ' ') || tz,
          formatted: formattedTime,
          isSleep,
          label,
        });
      });

      let quality: MeetingSlot['quality'] = 'Fair';
      if (sleepCount > 0) {
        quality = 'Poor';
      } else if (workCount === state.activeTzs.length) {
        quality = 'Optimal';
      }

      slots.push({
        label: `${h === 0 ? '12 AM' : h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`}`,
        score: totalScore,
        quality,
        times,
        dateObj: slotDate,
      });
    }

    const qualityWeight = { Optimal: 3, Fair: 2, Poor: 1 };
    return [...slots]
      .sort((a, b) => {
        if (qualityWeight[a.quality] !== qualityWeight[b.quality]) {
          return qualityWeight[b.quality] - qualityWeight[a.quality];
        }
        return b.score - a.score;
      })
      .slice(0, 4);
  }, [state.baseDate, state.activeTzs]);

  return {
    state,
    localTz,
    meetingSlots,
    setBaseDate,
    setIsLive,
    setCopiedTz,
    setSearchQuery,
    setActiveTzs,
    handleDateChange,
    handleTimeChange,
    handleResetToNow,
    handleBlockClick,
    handleSliderChange,
    handleAddTz,
    handleRemoveTz,
    handleMoveTz,
    handlePinTz,
  };
}
export type UseTimezoneConverterReturn = ReturnType<typeof useTimezoneConverter>;
