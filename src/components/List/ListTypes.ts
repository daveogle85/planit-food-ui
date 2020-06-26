import { Meal } from '../../api/types/MealTypes';
import { EmotionProps } from '../../styles/types';

export type MealProps = EmotionProps & {
  meal: Meal;
  handleSelectedMeal: () => void;
  selected: boolean;
};

export type ListProps = EmotionProps & {
  onMealDelete?: () => void;
  onMealSelect?: (meal: Meal) => void;
};
