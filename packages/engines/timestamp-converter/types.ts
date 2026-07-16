export interface EpochDetails {
  detectedUnit?: 'Seconds' | 'Milliseconds';
  localStr?: string;
  utcStr?: string;
  isoStr?: string;
  utcStringStr?: string;
  relativeStr?: string;
  error?: string;
}

export interface DateToEpochDetails {
  sec?: string;
  ms?: string;
  relative?: string;
  error?: string;
}

export interface TimestampConverterState {
  // Live Unix Clock
  currentUnix: number;
  currentMs: number;
  isClockRunning: boolean;
  copiedClockSec: boolean;
  copiedClockMs: boolean;

  // Epoch to Date
  epochInput: string;
  unitMode: 'auto' | 'seconds' | 'ms';
  copiedField: string | null;

  // Date to Epoch
  dateInput: string;
  dateTz: 'local' | 'utc';
  dateMsOffset: number;
  copiedEpochSec: boolean;
  copiedEpochMs: boolean;
}
