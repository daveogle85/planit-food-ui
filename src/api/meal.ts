import { httpRequest } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';
import { ApiMeal } from './types/MealTypes';
import { RestVerb } from './helpers/types';

const path = '/meals';

export const searchForMeal = (mealSearchText: string) => async (
  token?: string | null
): Promise<Array<ApiMeal>> => {
  const requestPath = `${path}?searchName=${mealSearchText}`;
  if (nullOrEmptyString(token)) {
    return [];
  }
  try {
    return await httpRequest<Array<ApiMeal>, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
  } catch (e) {
    return [];
  }
};
