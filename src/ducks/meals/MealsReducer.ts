import { Meal } from '../../api/types/MealTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import dispatchApiAction from '../loading';
import { getAllMeals } from '../../api/meal';

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

export default mealsSlice.reducer;
