import { Meal } from './MealTypes';

export type List = {
  id?: string;
  name?: string;
  meals: Array<Meal>;
};
