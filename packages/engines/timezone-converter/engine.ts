export function formatDateTz(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'full',
      timeZone,
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

export function formatTimeTz(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeStyle: 'short',
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

export function getGmtOffset(date: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZone,
      timeZoneName: 'longOffset',
    }).formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : 'GMT';
  } catch {
    return 'GMT';
  }
}

export function getOffsetDiffMinutes(date: Date, tzA: string, tzB: string): number {
  try {
    const getUtcMs = (tz: string) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).formatToParts(date);

      const year = parseInt(parts.find((p) => p.type === 'year')?.value ?? '0', 10);
      const month = parseInt(parts.find((p) => p.type === 'month')?.value ?? '1', 10) - 1;
      const day = parseInt(parts.find((p) => p.type === 'day')?.value ?? '1', 10);
      const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
      const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
      const second = parseInt(parts.find((p) => p.type === 'second')?.value ?? '0', 10);

      return Date.UTC(year, month, day, hour, minute, second);
    };

    const msA = getUtcMs(tzA);
    const msB = getUtcMs(tzB);
    return (msB - msA) / 60000;
  } catch {
    return 0;
  }
}

export function formatOffsetDiff(diffMin: number): string {
  if (diffMin === 0) return 'Same time';
  const hours = diffMin / 60;
  const prefix = hours > 0 ? '+' : '';
  if (hours % 1 === 0) {
    return `${prefix}${hours}h`;
  }
  return `${prefix}${hours.toFixed(1)}h`;
}

export function getHourInTz(date: Date, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(date);
    return (parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10)) % 24;
  } catch {
    return date.getHours();
  }
}

export function getHourStyle(hour: number, isSelected: boolean) {
  if (hour >= 9 && hour < 17) {
    return {
      bg: isSelected
        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-emerald-600 scale-105'
        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-500',
      border: 'border-emerald-500/30',
      label: 'Work Hours',
      indicator: '🟢',
    };
  } else if (hour >= 22 || hour < 6) {
    return {
      bg: isSelected
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border-indigo-700 scale-105'
        : 'bg-indigo-950/20 hover:bg-indigo-950/30 text-indigo-400 dark:text-indigo-300 border-indigo-500/15',
      text: 'text-indigo-400',
      border: 'border-indigo-500/15',
      label: 'Sleep Hours',
      indicator: '🌙',
    };
  } else {
    return {
      bg: isSelected
        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 border-amber-600 scale-105'
        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
      text: 'text-amber-500',
      border: 'border-amber-500/25',
      label: 'Personal Time',
      indicator: '🏠',
    };
  }
}

export function getHourBadgeStyle(hour: number): string {
  if (hour >= 9 && hour < 17) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  } else if (hour >= 22 || hour < 6) {
    return 'bg-indigo-950/30 text-indigo-400 dark:text-indigo-300 border-indigo-500/15';
  } else {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }
}
