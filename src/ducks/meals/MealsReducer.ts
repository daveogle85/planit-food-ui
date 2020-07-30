import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../';
import { getAllMeals, updateMeal } from '../../api/meal';
import { Meal } from '../../api/types/MealTypes';
import { setData as setDishes } from '../dishes/DishesReducer';
import dispatchApiAction from '../loading';

type MealsSlice = {
  loading: boolean;
  data: Array<Meal> | null;
};

const initialState: MealsSlice = {
  loading: false,
  data: null,
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setData(state, action: PayloadAction<MealsSlice['data']>) {
      state.data = action.payload;
    },
  },
});

export const { setLoading, setData } = mealsSlice.actions;
export const mealsSelectors = {
  selectLoading: (state: RootState) => state.meals.loading,
  selectData: (state: RootState) => state.meals.data,
};

// Thunks
export const fetchMeals = (): AppThunk => async dispatch => {
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request: getAllMeals(),
      onSuccessAction: setData,
      onFailFallback: null,
    })
  );
};

export const saveMeal = (meal: Meal): AppThunk => async dispatch => {
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request: updateMeal(meal),
      onSuccessAction: null,
      onFailFallback: null,
      onSuccessMessage: `"${meal.name}" successfully updated`,
      additionalSuccessActions: [setData(null), setDishes(null)],
    })
  );
};

export default mealsSlice.reducer;
