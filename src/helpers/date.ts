const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

var parseOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const getDayOfWeek = (day: number) => days[day];

export const parseDateAsFormattedString = (date: string | Date) => {
  const newDate = typeof date === 'string' ? new Date(date) : date;
  return newDate.toLocaleString('en-US', parseOptions);
};
