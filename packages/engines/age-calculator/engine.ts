import { AgeResult } from './types';
import { ZODIAC_SIGNS, CHINESE_ZODIAC, DAYS_OF_WEEK } from './constants';

export function calculateAge(birthDate: Date, targetDate: Date): AgeResult {
  let years = targetDate.getUTCFullYear() - birthDate.getUTCFullYear();
  let months = targetDate.getUTCMonth() - birthDate.getUTCMonth();
  let days = targetDate.getUTCDate() - birthDate.getUTCDate();

  if (days < 0) {
    months--;
    // Get last day of previous month of targetDate in UTC
    const prevMonthVal = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), 0)).getUTCDate();
    days += prevMonthVal;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = Math.max(0, targetDate.getTime() - birthDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Day of birth in UTC
  const dayOfWeek = DAYS_OF_WEEK[birthDate.getUTCDay()] || '';

  // Zodiac Sign based on UTC Date
  const m = birthDate.getUTCMonth() + 1;
  const d = birthDate.getUTCDate();
  let zodiac = 'Capricorn';
  for (const sign of ZODIAC_SIGNS) {
    if (m === sign.month && d <= sign.day) {
      zodiac = sign.name;
      break;
    } else if (m < sign.month) {
      zodiac = sign.name;
      break;
    }
  }

  // Chinese Zodiac
  const birthYear = birthDate.getUTCFullYear();
  const chineseIndex = (birthYear - 1900) % 12;
  const chineseZodiac = CHINESE_ZODIAC[chineseIndex >= 0 ? chineseIndex : chineseIndex + 12] || '';

  // Next Birthday Calculation in UTC
  const currentYear = targetDate.getUTCFullYear();
  let nextBirthdayDate = new Date(Date.UTC(currentYear, birthDate.getUTCMonth(), birthDate.getUTCDate()));

  if (nextBirthdayDate.getTime() < targetDate.getTime()) {
    nextBirthdayDate = new Date(Date.UTC(currentYear + 1, birthDate.getUTCMonth(), birthDate.getUTCDate()));
  }

  let nextBdayMonths = nextBirthdayDate.getUTCMonth() - targetDate.getUTCMonth();
  let nextBdayDays = nextBirthdayDate.getUTCDate() - targetDate.getUTCDate();

  if (nextBdayDays < 0) {
    nextBdayMonths--;
    const prevMonthVal = new Date(Date.UTC(nextBirthdayDate.getUTCFullYear(), nextBirthdayDate.getUTCMonth(), 0)).getUTCDate();
    nextBdayDays += prevMonthVal;
  }
  if (nextBdayMonths < 0) {
    nextBdayMonths += 12;
  }

  const remainingDays = Math.ceil((nextBirthdayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
  const nextBirthdayDayOfWeek = DAYS_OF_WEEK[nextBirthdayDate.getUTCDay()] || '';

  // Milestones estimate
  const heartbeats = totalMinutes * 75; // average 75 bpm
  const breaths = totalMinutes * 16; // average 16 breaths/min
  const sleepHours = totalDays * 8; // average 8 hours/day

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    dayOfWeek,
    zodiac,
    chineseZodiac,
    nextBirthday: {
      months: nextBdayMonths,
      days: nextBdayDays,
      remainingDays: Math.max(0, remainingDays),
      dayOfWeek: nextBirthdayDayOfWeek,
    },
    milestones: {
      heartbeats,
      breaths,
      sleepHours,
    },
  };
}
