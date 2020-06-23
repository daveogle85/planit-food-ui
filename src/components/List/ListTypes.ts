import { Meal } from '../../api/types/MealTypes';
import { EmotionProps } from '../../styles/types';

export type MealProps = EmotionProps & {
  meal: Meal;
  setSelectedMeal: () => void;
  selected: boolean;
};
