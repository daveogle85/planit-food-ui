import { DayRange } from '../api/types/DayTypes';

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

export const dateToISOString = (date: Date): string =>
  date.toISOString().substring(0, 10);

export const isDayWithinRange = (
  givenRange: DayRange,
  day?: string
): boolean => {
  const givenStartDate = new Date(givenRange.startDate);
  const givenEndDate = new Date(givenRange.endDate);
  const dayDate = new Date(day ?? '');
  if (
    isNaN(givenStartDate.getTime()) ||
    isNaN(givenEndDate.getTime()) ||
    isNaN(dayDate.getTime())
  ) {
    return false;
  }

  return dayDate >= givenStartDate && dayDate <= givenEndDate;
};

/**
 * Return the range that is outside of the given range.
 * Return null if the range is a complete sub-range of the given range.
 * Return the entire range if the given range is a subset of the range.
 * @param givenRange
 * @param rangeToTest
 */
export const getOverlappingRange = (
  givenRange: DayRange,
  rangeToTest: DayRange
): DayRange | null => {
  const givenStartDate = new Date(givenRange.startDate);
  const givenEndDate = new Date(givenRange.endDate);
  const testStartDate = new Date(rangeToTest.startDate);
  const testEndDate = new Date(rangeToTest.endDate);

  if (
    isNaN(givenStartDate.getTime()) ||
    isNaN(givenEndDate.getTime()) ||
    isNaN(testStartDate.getTime()) ||
    isNaN(testEndDate.getTime())
  ) {
    throw new Error(
      `invalid Date:\n
      ${JSON.stringify(givenRange)}\n,
      ${JSON.stringify(rangeToTest)}`
    );
  }

  const startDateWithinRange = testStartDate >= givenStartDate;
  const endDateWithinRange = testEndDate <= givenEndDate;
  const testRangeBeforeGivenRange = testEndDate < givenStartDate;
  const testRangeAfterGivenRange = testStartDate > givenEndDate;

  // if entirely within the range
  if (startDateWithinRange && endDateWithinRange) {
    return null;
  }

  // if entirely outside range
  if (testRangeBeforeGivenRange || testRangeAfterGivenRange) {
    return rangeToTest;
  }

  // if outside range on one side
  if (!startDateWithinRange && endDateWithinRange) {
    const startDate = rangeToTest.startDate;
    const endDate = givenRange.startDate;
    return {
      startDate,
      endDate,
    };
  }

  if (startDateWithinRange && !endDateWithinRange) {
    const startDate = givenRange.endDate;
    const endDate = rangeToTest.endDate;
    return {
      startDate,
      endDate,
    };
  }

  // if outside range on both sides or
  return rangeToTest;
};

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first != null &&
  second != null &&
  !isNaN(first.getTime()) &&
  !isNaN(second.getTime()) &&
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const rangeNoGreaterThan24hours = (start: Date, end: Date) =>
  end.getTime() / 1000 - start.getTime() / 1000 <= 86400;
