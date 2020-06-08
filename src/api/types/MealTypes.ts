import { Dish } from './DishTypes';

export type Meal = {
  id: string;
  name?: string;
  searchName?: string;
  notes?: string;
  dishes?: Array<Dish>;
};
