import { Ingredient } from '../../api/types/IngredientsTypes';

export type IngredientsProps = {
  ingredients: Array<Ingredient>;
  ingredientErrors: Map<string, string>;
  setIngredientErrors: React.Dispatch<
    React.SetStateAction<Map<string, string>>
  >;
  onIngredientUpdate: (newIngredients: Array<Ingredient>) => void;
};

export type IngredientComponentProps = {
  ingredient: Ingredient;
};
