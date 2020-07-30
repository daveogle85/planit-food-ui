import { Dish } from '../../api/types/DishTypes';

export type DishesProps = {
  dishes: Array<Dish>;
  dishErrors: Map<string, string>;
  setDishErrors: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  onDishUpdate: (newDishes: Array<Dish>) => void;
  disabled: boolean;
};

export type DishComponentProps = {
  dish: Dish;
};
