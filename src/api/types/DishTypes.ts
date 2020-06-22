import { Ingredient } from './IngredientsTypes';

export enum DishType {
  MAIN = 'MAIN',
  SIDE = 'SIDE',
  DESSERT = 'DESSERT',
}

export type ApiDish = {
  id?: string;
  name?: string;
  searchName?: string;
  dishType?: DishType;
  notes?: string;
  cookingTime?: number;
  ingredients?: Array<Ingredient>;
};

export type Dish = ApiDish & {
  localId: string;
};
