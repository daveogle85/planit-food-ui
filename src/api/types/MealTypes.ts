import { Dish } from './DishTypes';

export type ApiMeal = {
  id?: string;
  name?: string;
  searchName?: string;
  notes?: string;
  dishes?: Array<Dish>;
};

export type Meal = ApiMeal & {
  localId: string;
};
