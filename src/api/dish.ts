import { Dish } from './types/DishTypes';
import { get } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';

const path = '/dishes';

export const searchForDish = (dishSearchText: string) => async (
  token?: string | null
): Promise<Array<Dish>> => {
  const requestPath = `${path}?searchName=${dishSearchText}`;
  if (nullOrEmptyString(token)) {
    return [];
  }
  try {
    return await get<Array<Dish>>(requestPath, token!);
  } catch (e) {
    return [];
  }
};
