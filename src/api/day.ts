import { Day, DayRange } from './types/DayTypes';
import { get } from './helpers/http';

const dayPath = '/days';

const getDaysByRange = (range: DayRange) => (
  token: string
): Promise<Array<Day>> => {
  const requestPath = `${dayPath}?startDate=${range.startDate}&endDate=${range.endDate}`;
  return get<Array<Day>>(requestPath, token);
};

export default getDaysByRange;
