import { Meal, ApiMeal } from './MealTypes';

export type List = {
  id?: string;
  name?: string;
  meals: Array<Meal>;
};

export type ApiList = Omit<List, 'meals'> & {
  meals: Array<ApiMeal>;
};
