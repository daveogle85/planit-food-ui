import { httpRequest } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';
import { ApiMeal, Meal } from './types/MealTypes';
import { RestVerb } from './helpers/types';
import { convertFromMealApi, convertToApiMeal } from './helpers/convert';

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

export const getMealById = (mealId: string) => async (
  token?: string | null
): Promise<Meal | null> => {
  const requestPath = `${path}/${mealId}`;
  if (nullOrEmptyString(token)) {
    return null;
  }
  try {
    const meal = await httpRequest<ApiMeal, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
    return convertFromMealApi(meal);
  } catch (e) {
    return null;
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

export const updateMeal = (meal: Meal) => async (
  token?: string | null
): Promise<Meal | null> => {
  const requestPath = `${path}`;
  if (nullOrEmptyString(token)) {
    return null;
  }

  try {
    const updatedMeal = await httpRequest<ApiMeal, ApiMeal>(
      requestPath,
      token!,
      RestVerb.PUT,
      convertToApiMeal(meal)
    );
    return convertFromMealApi(updatedMeal);
  } catch (e) {
    return null;
  }
};
