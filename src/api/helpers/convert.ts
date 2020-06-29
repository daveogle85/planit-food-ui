import { v4 as uuid } from 'uuid';

import { ApiDish, Dish } from '../types/DishTypes';
import { ApiMeal, Meal } from '../types/MealTypes';
import { List, ApiList } from '../types/ListTypes';
import { ApiDay, Day } from '../types/DayTypes';

export const convertFromDishApi = (dish: ApiDish): Dish => ({
  ...dish,
  localId: uuid(),
});

export const convertFromMealApi = (meal: ApiMeal): Meal => {
  const dishes = meal.dishes?.map(d => {
    const dish = convertFromDishApi(d);
    return dish;
  });
  return { ...meal, localId: uuid(), dishes };
};

export const convertFromDayApi = (day: ApiDay): Day => {
  const meal = convertFromMealApi(day.meal);
  return { ...day, meal };
};

export const convertToApiDish = (dish: Dish): ApiDish => {
  const { localId, ...apiDish } = dish;
  return apiDish;
};

export const convertToLightApiDish = (dish: Dish): ApiDish => {
  const { id, name, notes, dishType } = dish;
  return {
    id,
    name,
    notes,
    dishType,
  };
};

export const convertToApiMeal = (meal: Meal): ApiMeal => {
  const { localId, ...apiMeal } = meal;
  return {
    ...apiMeal,
    dishes: (meal.dishes ? meal.dishes.map(convertToApiDish) : []) as ApiDish[],
  };
};

export const convertToLightApiMeal = (meal: Meal): ApiMeal => {
  const { id, name, dishes, notes } = meal;
  const updatedDishes = dishes?.map(convertToLightApiDish);
  return {
    id,
    name,
    dishes: updatedDishes,
    notes,
  };
};

export const convertToListApiRequest = (list: List): ApiList => {
  const updatedMeals = list.meals.map(convertToLightApiMeal);
  return {
    ...list,
    meals: updatedMeals,
  };
};

export const convertToLightApiDay = (day: Day): ApiDay => {
  const meal = convertToLightApiMeal(day.meal);
  return { ...day, date: day.date!, meal };
};

export const convertToApiDay = (day: Day): ApiDay => {
  const meal = convertToApiMeal(day.meal);
  return { ...day, date: day.date!, meal };
};
