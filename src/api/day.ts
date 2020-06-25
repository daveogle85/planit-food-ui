import { Day, DayRange } from './types/DayTypes';
import { get } from './helpers/http';
import { removeEmpty } from '../helpers/object';

const dayPath = '/days';

const getDaysByRange = (range: DayRange, includeDishes?: boolean) => async (
  token: string
): Promise<Array<Day>> => {
  const requestPath = `${dayPath}?startDate=${range.startDate}&endDate=${
    range.endDate
  }${Boolean(includeDishes) ? '&includeDishes=true' : ''}`;
  const days = await get<Array<Day>>(requestPath, token);
  return days.map(removeEmpty) as Array<Day>;
};

export default getDaysByRange;
