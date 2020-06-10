import { Dish } from '../api/types/DishTypes';

export type DishComponentProps = {
  dish: Dish;
  token: string | null;
  handleDeleteClick: (id: string) => void;
  handleMainChecked: (id: string, checked: boolean) => void;
  handleDishSelected: (newDish: Dish) => void;
};
