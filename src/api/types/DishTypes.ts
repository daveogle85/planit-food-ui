import { Ingredient, ApiIngredient } from './IngredientsTypes';

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
  ingredients?: Array<ApiIngredient>;
};

export type Dish = Omit<ApiDish, 'ingredients'> & {
  localId: string;
  ingredients?: Array<Ingredient>;
};
