import { ApiDish } from './types/DishTypes';
import { get } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';

const path = '/dishes';

export const searchForDish = (dishSearchText: string) => async (
  token?: string | null
): Promise<Array<ApiDish>> => {
  const requestPath = `${path}?searchName=${dishSearchText}`;
  if (nullOrEmptyString(token)) {
    return [];
  }
  try {
    return await get<Array<ApiDish>>(requestPath, token!);
  } catch (e) {
    return [];
  }
};
