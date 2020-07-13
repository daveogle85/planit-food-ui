import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../';
import { getAllDishes } from '../../api/dish';
import { Dish } from '../../api/types/DishTypes';
import dispatchApiAction from '../loading';

type DishesSlice = {
  loading: boolean;
  data: Array<Dish> | null;
};

const initialState: DishesSlice = {
  loading: false,
  data: null,
};

const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setData(state, action: PayloadAction<DishesSlice['data']>) {
      state.data = action.payload;
    },
  },
});

export const { setLoading, setData } = dishesSlice.actions;
export const dishesSelectors = {
  selectLoading: (state: RootState) => state.dishes.loading,
  selectData: (state: RootState) => state.dishes.data,
};

// Thunks
export const fetchDishes = (): AppThunk => async dispatch => {
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request: getAllDishes(),
      onSuccessAction: setData,
      onFailFallback: null,
    })
  );
};

export default dishesSlice.reducer;
