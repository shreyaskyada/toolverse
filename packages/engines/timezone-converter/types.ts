export interface MeetingSlotTime {
  tzName: string;
  formatted: string;
  isSleep: boolean;
  label: string;
}

export interface MeetingSlot {
  label: string;
  score: number;
  quality: 'Optimal' | 'Fair' | 'Poor';
  times: MeetingSlotTime[];
  dateObj: Date;
}

export interface TimezoneConverterState {
  baseDate: Date;
  isLive: boolean;
  copiedTz: string | null;
  searchQuery: string;
  activeTzs: string[];
}
