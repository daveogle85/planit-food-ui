import {
  getDayOfWeek,
  parseDateAsFormattedString,
  dateToISOString,
} from '../helpers/date';

describe('date', () => {
  test('getDayOfWeek', () => {
    const testDate = new Date(2020, 1, 1);
    expect(getDayOfWeek(testDate.getDay())).toBe('Saturday');

    testDate.setDate(testDate.getDate() + 1);
    expect(getDayOfWeek(testDate.getDay())).toBe('Sunday');
  });
});

describe('parseDateAsFormattedString', () => {
  test('should parse a date object', () => {
    const test = new Date(2020, 1, 1);
    expect(parseDateAsFormattedString(test)).toBe('February 1, 2020');
  });

  test('should parse a string', () => {
    const test = new Date(2020, 1, 1);
    expect(parseDateAsFormattedString(test)).toBe('February 1, 2020');
  });
});

describe('dateToISOString', () => {
  test('should convert a date to an iso string with no time', () => {
    const date = new Date('2020-12-30');
    const dateAsString = dateToISOString(date);
    expect(typeof dateAsString).toBe('string');
    expect(dateAsString).toEqual('2020-12-30');
  });
});
