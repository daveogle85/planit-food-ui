export type DishType = {
  id: number;
  name: string;
  main: boolean;
};

export type DishProps = {
  dish: DishType;
  handleDeleteClick: (id: number) => void;
  handleMainChecked: (id: number, checked: boolean) => void;
};
