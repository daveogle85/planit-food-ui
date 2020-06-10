import { get } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';
import { Meal } from './types/MealTypes';

const path = '/meals';

export const searchForMeal = (mealSearchText: string) => async (
  token?: string | null
): Promise<Array<Meal>> => {
  const requestPath = `${path}?searchName=${mealSearchText}`;
  if (nullOrEmptyString(token)) {
    return [];
  }
  try {
    return await get<Array<Meal>>(requestPath, token!);
  } catch (e) {
    return [];
  }
};
