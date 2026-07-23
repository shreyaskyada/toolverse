export const ZODIAC_SIGNS = [
  { name: 'Capricorn', month: 1, day: 19 },
  { name: 'Aquarius', month: 2, day: 18 },
  { name: 'Pisces', month: 3, day: 20 },
  { name: 'Aries', month: 4, day: 19 },
  { name: 'Taurus', month: 5, day: 20 },
  { name: 'Gemini', month: 6, day: 20 },
  { name: 'Cancer', month: 7, day: 22 },
  { name: 'Leo', month: 8, day: 22 },
  { name: 'Virgo', month: 9, day: 22 },
  { name: 'Libra', month: 10, day: 22 },
  { name: 'Scorpio', month: 11, day: 21 },
  { name: 'Sagittarius', month: 12, day: 21 },
  { name: 'Capricorn', month: 12, day: 31 },
];

export const CHINESE_ZODIAC = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const TOOL_METADATA = {
  title: 'Age Calculator',
  description:
    'Calculate your exact age in years, months, weeks, days, hours, and seconds. View your next birthday countdown, zodiac details, and life milestones.',
  slug: 'age-calculator',
  category: 'math-calc',
};

export const TOOL_FAQS = [
  {
    question: 'How is my exact age calculated?',
    answer:
      'The calculator determines your exact age by finding the precise difference between your date of birth and the target date. It counts full completed years first, then completed months, and finally the remaining days, taking into account varying month lengths and leap years.',
  },
  {
    question: 'Does this age calculator account for leap years?',
    answer:
      'Yes. The calculator fully accounts for leap years by dynamically checking the number of days in February for each year in the calculated range. This ensures your total days lived and exact age breakdown are completely accurate.',
  },
  {
    question: 'Can I calculate my age at a specific date in the past or future?',
    answer:
      'Absolutely. By default, the calculator computes your age relative to today, but you can change the target date input to any date in history or the future to see how old you were or will be at that specific time.',
  },
  {
    question: 'Is my birth date data secure and private?',
    answer:
      'Yes, privacy is guaranteed. All calculations are performed locally in your browser using JavaScript. None of your personal date parameters are sent to our servers or stored anywhere.',
  },
  {
    question: 'How are the heartbeat and breath counts estimated?',
    answer:
      'The milestone statistics are fun estimates based on typical human averages. We calculate heartbeats using an average resting heart rate of 75 beats per minute (bpm), breaths based on an average rate of 16 breaths per minute, and sleep hours assuming an average of 8 hours of sleep per day.',
  },
];

export const TOOL_ABOUT = [
  'The Age Calculator is a highly accurate utility designed to help you determine your exact age between any two dates. By default, it calculates your age relative to the current day, but you can customize the target date to calculate your age at a specific milestone in the future or look back at a date in history.',
  'Calculated completely client-side inside your web browser, our tool ensures your sensitive birth date details never travel over the network or land on external databases, providing complete privacy and data security.',
  'Beyond just years, months, and days, this utility calculates detailed breakdowns including total weeks, hours, minutes, and seconds lived. It also evaluates astrological alignments like your Sun Sign and Chinese Zodiac animal, and features a live countdown timer until your next birthday.',
];
