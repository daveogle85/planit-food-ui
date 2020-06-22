import { get, put } from './helpers/http';
import { List, ApiList } from './types/ListTypes';
import { Meal } from './types/MealTypes';
import { convertFromMealApi, convertToListApiRequest } from './helpers/convert';

const listPath = '/lists';

const getLists = () => (token: string): Promise<Array<List>> => {
  const requestPath = `${listPath}`;
  return get<Array<List>>(requestPath, token);
};

export const getListByName = (name: string) => async (
  token: string
): Promise<List> => {
  const requestPath = `${listPath}/name/${name}`;
  const list = await get<List>(requestPath, token);
  return { ...list, meals: list.meals.map(convertFromMealApi) };
};

export const updateList = (list: List) => async (
  token: string
): Promise<List> => {
  const requestPath = `${listPath}`;
  const updatedList = await put<ApiList, ApiList>(
    requestPath,
    token,
    convertToListApiRequest(list)
  );
  return { ...updatedList, meals: updatedList.meals.map(convertFromMealApi) };
};

export const updateMealInList = (list: List, meal: Meal) => (
  token: string
): Promise<List> => {
  const meals = list.meals.filter(m => m.id !== meal.id);
  meals.push(meal);
  return updateList({ ...list, meals })(token);
};

export default getLists;
