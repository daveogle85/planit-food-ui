import { ApiDish, Dish } from './types/DishTypes';
import { httpRequest } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';
import { RestVerb } from './helpers/types';
import { convertFromDishApi } from './helpers/convert';

const path = '/dishes';

export const searchForDish = (dishSearchText: string) => async (
  token?: string | null
): Promise<Array<ApiDish>> => {
  const requestPath = `${path}?searchName=${dishSearchText}`;
  if (nullOrEmptyString(token)) {
    return [];
  }
  try {
    return await httpRequest<Array<ApiDish>, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
  } catch (e) {
    return [];
  }
};

export const getDishById = (dishId: string) => async (
  token?: string | null
): Promise<Dish | null> => {
  const requestPath = `${path}/${dishId}`;
  if (nullOrEmptyString(token)) {
    return null;
  }
  try {
    const dish = await httpRequest<ApiDish, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
    return convertFromDishApi(dish);
  } catch (e) {
    return null;
  }
};
