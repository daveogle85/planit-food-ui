import { ApiDish, Dish } from './DishTypes';

export type ApiMeal = {
  id?: string;
  name?: string;
  searchName?: string;
  notes?: string;
  dishes?: Array<ApiDish>;
};

export type Meal = Omit<ApiMeal, 'dishes'> & {
  localId: string;
  dishes?: Array<Dish>;
};
