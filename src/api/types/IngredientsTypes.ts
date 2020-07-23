export type ApiIngredient = {
  id?: string;
  name?: string;
  searchName?: string;
  // quantity
};

export type Ingredient = ApiIngredient & {
  localId: string;
};
