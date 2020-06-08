import { EmotionProps } from '../../styles/types';
import { Meal } from '../../api/types/MealTypes';

type DayCardProps = EmotionProps & {
  date: Date;
  meal: Meal;
};

export default DayCardProps;
