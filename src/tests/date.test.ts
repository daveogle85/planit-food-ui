import {
  getDayOfWeek,
  parseDateAsFormattedString,
  dateToISOString,
  getOverlappingRange,
  isDayWithinRange,
  datesAreOnSameDay,
} from "../helpers/date";

describe("date", () => {
  test("getDayOfWeek", () => {
    const testDate = new Date(2020, 1, 1);
    expect(getDayOfWeek(testDate.getDay())).toBe("Saturday");

    testDate.setDate(testDate.getDate() + 1);
    expect(getDayOfWeek(testDate.getDay())).toBe("Sunday");
  });
});

describe("parseDateAsFormattedString", () => {
  test("should parse a date object", () => {
    const test = new Date(2020, 1, 1);
    expect(parseDateAsFormattedString(test)).toBe("February 1, 2020");
  });

  test("should parse a string", () => {
    const test = new Date(2020, 1, 1);
    expect(parseDateAsFormattedString(test)).toBe("February 1, 2020");
  });
});

describe("dateToISOString", () => {
  test("should convert a date to an iso string with no time", () => {
    const date = new Date("2020-12-30");
    const dateAsString = dateToISOString(date);
    expect(typeof dateAsString).toBe("string");
    expect(dateAsString).toEqual("2020-12-30");
  });
});

describe("getOverlappingRange", () => {
  it("should throw an error if there is an invalid date", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "test",
    };

    const rangeToTest = {
      startDate: "01/01/98",
      endDate: "01/02/98",
    };

    expect(() => getOverlappingRange(givenRange, rangeToTest)).toThrow(
      `invalid Date:\n
      ${JSON.stringify(givenRange)}\n,
      ${JSON.stringify(rangeToTest)}`
    );
  });

  it("should return null if start and end date are within the given range", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "02/01/98",
    };

    const rangeToTest = {
      startDate: "01/01/98",
      endDate: "01/10/98",
    };

    const result = getOverlappingRange(givenRange, rangeToTest);
    expect(result).toBe(null);
  });

  it("should return a sub range if only the start date is out of range", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "02/01/98",
    };

    const rangeToTest = {
      startDate: "12/15/97",
      endDate: "01/10/98",
    };

    const result = getOverlappingRange(givenRange, rangeToTest);
    expect(result).toStrictEqual({
      endDate: "01/01/98",
      startDate: "12/15/97",
    });
  });

  it("should return a sub range if only the end date is out of range", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "02/01/98",
    };

    const rangeToTest = {
      startDate: "01/01/98",
      endDate: "02/10/98",
    };

    const result = getOverlappingRange(givenRange, rangeToTest);
    expect(result).toStrictEqual({
      endDate: "02/10/98",
      startDate: "02/01/98",
    });
  });

  it("should return the entire test range if entirely outside range", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "02/01/98",
    };

    const rangeToTest = {
      startDate: "01/01/97",
      endDate: "02/01/97",
    };

    const result = getOverlappingRange(givenRange, rangeToTest);
    expect(result).toStrictEqual(rangeToTest);
  });

  it("should return the entire test range if outside range on both sides", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "02/01/98",
    };

    const rangeToTest = {
      startDate: "12/30/97",
      endDate: "02/02/98",
    };

    const result = getOverlappingRange(givenRange, rangeToTest);
    expect(result).toStrictEqual(rangeToTest);
  });
});

describe("isDayWithinRange", () => {
  it("should return false if an invalid date", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "test",
    };
    const day = "01/01/98";
    let result = isDayWithinRange(givenRange, day);
    result =
      result ||
      isDayWithinRange(
        {
          startDate: "01/01/98",
          endDate: "02/01/98",
        },
        "test"
      );
    expect(result).toBe(false);
  });

  it("should return false if the date is not within range", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "01/20/98",
    };
    const day = "01/21/98";
    const result = isDayWithinRange(givenRange, day);
    expect(result).toBe(false);
  });

  it("should return true the date is within range", () => {
    const givenRange = {
      startDate: "01/01/98",
      endDate: "01/20/98",
    };
    const day = "01/15/98";
    const result = isDayWithinRange(givenRange, day);
    expect(result).toBe(true);
  });
});

describe("datesAreOnSameDay", () => {
  it("should return true if both dates are on the same day", () => {
    const day1 = new Date("01/01/98 00:00");
    const day2 = new Date("01/01/98 23:59");
    expect(datesAreOnSameDay(day1, day2)).toBe(true);
  });

  it("should return false if both dates are on different days", () => {
    const day1 = new Date("01/01/98");
    const day2 = new Date("02/01/98");
    expect(datesAreOnSameDay(day1, day2)).toBe(false);
  });

  it("should return false if not a date", () => {
    const day1 = new Date("test");
    const day2 = new Date("02/01/98");
    let result = datesAreOnSameDay(day1, day2);
    result = result || datesAreOnSameDay(day2, null as any);

    expect(result).toBe(false);
  });
});

describe("rangeNoGreaterThan24hours", () => {
  it("should return true if range less than 24 hours", () => {
    const start = new Date("01/01/98 00:00:00");
    const end = new Date("01/01/98 23:59:59");
    expect(datesAreOnSameDay(start, end)).toBe(true);
  });

  it("should return false if dates are greater than 24 hours apart", () => {
    const start = new Date("01/01/98 00:00:00");
    const end = new Date("01/01/98 24:00:01");
    expect(datesAreOnSameDay(start, end)).toBe(false);
  });
});
