import { Day, DayRange, ApiDay } from './types/DayTypes';
import { httpRequest } from './helpers/http';
import { removeEmpty } from '../helpers/object';
import { RestVerb } from './helpers/types';
import { convertFromDayApi, convertToLightApiDay } from './helpers/convert';

const dayPath = '/days';

const getDaysByRange = (range: DayRange, includeDishes?: boolean) => async (
  token: string
): Promise<Array<Day>> => {
  const requestPath = `${dayPath}?startDate=${range.startDate}&endDate=${
    range.endDate
  }${Boolean(includeDishes) ? '&includeDishes=true' : ''}`;
  const days = await httpRequest<Array<Day>, undefined>(
    requestPath,
    token,
    RestVerb.GET
  );
  return days.map(removeEmpty) as Array<Day>;
};

export const addDay = (day: Day) => async (
  token: string
): Promise<Array<Day>> => {
  const dayResponse = await httpRequest<ApiDay, ApiDay>(
    dayPath,
    token,
    RestVerb.POST,
    convertToLightApiDay(day)
  );
  const nonApiDay = convertFromDayApi(dayResponse);
  return [removeEmpty(nonApiDay) as Day];
};

export const deleteDay = (day: Day) => async (token: string): Promise<Day> => {
  const requestPath = `${dayPath}/${day.date}`;
  const response = await httpRequest(requestPath, token, RestVerb.DELETE);
  return response as Day;
};

export default getDaysByRange;
