import { Meal, ApiMeal } from './MealTypes';

export type ApiDay = {
  id?: string;
  date: string;
  meal: ApiMeal;
  notes?: string;
};

export type Day = Pick<ApiDay, 'id' | 'notes'> & {
  date?: string;
  meal: Meal;
};

export type DayRange = {
  startDate: string;
  endDate: string;
};
