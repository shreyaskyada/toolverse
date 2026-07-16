export const AVAILABLE_TIMEZONES = [
  { value: 'UTC', label: 'Coordinated Universal Time (UTC/GMT)' },
  { value: 'America/New_York', label: 'New York (EST/EDT - UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT - UTC-8/-7)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT - UTC-6/-5)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT - UTC-7/-6)' },
  { value: 'America/Phoenix', label: 'Phoenix (MST - UTC-7)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT - UTC-5/-4)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT - UTC-3)' },
  { value: 'Europe/London', label: 'London (GMT/BST - UTC+0/+1)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST - UTC+1/+2)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST - UTC+1/+2)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK - UTC+3)' },
  { value: 'Asia/Kolkata', label: 'India (IST - UTC+5:30)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST - UTC+9)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT - UTC+8)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT - UTC+8)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST - UTC+9)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST - UTC+4)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST - UTC+8)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT - UTC+10/+11)' },
  { value: 'Australia/Perth', label: 'Perth (AWST - UTC+8)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT - UTC+12/+13)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST - UTC+2)' },
  { value: 'Africa/Cairo', label: 'Cairo (EET - UTC+2)' },
];

export const TOOL_METADATA = {
  title: 'Time Zone Converter',
  description: 'Convert dates and times across multiple world time zones, calculate timezone offsets, and plan meetings with overlap detection.',
  slug: 'timezone-converter',
  category: 'developer-tools',
  fullWidth: true,
};

export const TOOL_ABOUT = [
  'Managing teams and schedules across multiple global locations is complex. The Time Zone Converter simplifies this by visualizing multiple zones side-by-side.',
  'Easily scrub a master time slider or click individual hour cells to synchronize and compare times across regions.',
  'Use the Smart Meeting Planner to instantly calculate overlap windows, scoring slots based on common working hours while avoiding sleep offsets.',
];

export const TOOL_FAQS = [
  {
    question: 'How are daylight saving adjustments handled?',
    answer: 'Standard browser runtime environment Intl APIs dynamically calculate correct offsets (including DST rules like EDT vs EST) for each location relative to your specified date.',
  },
  {
    question: 'What do the work/sleep color codings represent?',
    answer: 'Optimal working hours are highlighted in green (9 AM to 5 PM), personal hours in amber, and night/sleeping hours (10 PM to 6 AM) in indigo.',
  },
];
