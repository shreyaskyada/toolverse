export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  dayOfWeek: string;
  nextBirthday: {
    months: number;
    days: number;
    remainingDays: number;
    dayOfWeek: string;
  };
  zodiac: string;
  chineseZodiac: string;
  milestones: {
    heartbeats: number;
    breaths: number;
    sleepHours: number;
  };
}
