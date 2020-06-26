import { ApiDish } from './types/DishTypes';
import { httpRequest } from './helpers/http';
import { nullOrEmptyString } from '../helpers/string';
import { RestVerb } from './helpers/types';

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
