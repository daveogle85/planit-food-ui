import { httpRequest } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';
import { ApiMeal, Meal } from './types/MealTypes';
import { RestVerb } from './helpers/types';
import { convertFromMealApi } from './helpers/convert';

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

export const getAllMeals = () => async (
  token?: string | null
): Promise<Array<Meal>> => {
  const requestPath = `${path}`;
  if (nullOrEmptyString(token)) {
    return [];
  }

  try {
    const meals = await httpRequest<Array<ApiMeal>, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
    return meals.map(convertFromMealApi);
  } catch (e) {
    return [];
  }
};
