import { Meal } from './MealTypes';

export type Day = {
  id: string;
  date?: string;
  meal: Meal;
  notes?: string;
};

export type DayRange = {
  startDate: string;
  endDate: string;
};
