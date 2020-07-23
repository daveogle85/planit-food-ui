import { ApiIngredient, Ingredient } from './types/IngredientsTypes';
import { nullOrEmptyString } from '../helpers/string';
import { httpRequest } from './helpers/http';
import { RestVerb } from './helpers/types';
import { convertFromIngredientApi } from './helpers/convert';

const path = '/ingredients';

export const searchForIngredient = (ingredientSearchText: string) => async (
  token?: string | null
): Promise<Array<ApiIngredient>> => {
  const requestPath = `${path}?searchName=${ingredientSearchText}`;
  if (nullOrEmptyString(token)) {
    return [];
  }
  try {
    return await httpRequest<Array<ApiIngredient>, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
  } catch (e) {
    return [];
  }
};

export const getIngredientById = (ingredientId: string) => async (
  token?: string | null
): Promise<Ingredient | null> => {
  const requestPath = `${path}/${ingredientId}`;
  if (nullOrEmptyString(token)) {
    return null;
  }
  try {
    const dish = await httpRequest<ApiIngredient, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
    return convertFromIngredientApi(dish);
  } catch (e) {
    return null;
  }
};

export const getAllIngredients = () => async (
  token?: string | null
): Promise<Array<Ingredient>> => {
  const requestPath = `${path}`;
  if (nullOrEmptyString(token)) {
    return [];
  }

  try {
    const ingredients = await httpRequest<Array<ApiIngredient>, undefined>(
      requestPath,
      token!,
      RestVerb.GET
    );
    return ingredients.map(convertFromIngredientApi);
  } catch (e) {
    return [];
  }
};
