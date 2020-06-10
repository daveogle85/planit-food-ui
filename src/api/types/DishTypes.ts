import { Ingredient } from './IngredientsTypes';

export enum DishType {
  MAIN,
  SIDE,
  DESSERT,
}

export type Dish = {
  id: string;
  name?: string;
  searchName?: string;
  dishType: DishType;
  notes?: string;
  cookingTime?: number;
  ingredients?: Array<Ingredient>;
};
