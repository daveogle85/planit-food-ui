import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../';
import { getAllIngredients } from '../../api/ingredient';
import { Ingredient } from '../../api/types/IngredientsTypes';
import dispatchApiAction from '../loading';

type IngredientsSlice = {
  loading: boolean;
  data: Array<Ingredient> | null;
};

const initialState: IngredientsSlice = {
  loading: false,
  data: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setData(state, action: PayloadAction<IngredientsSlice['data']>) {
      state.data = action.payload;
    },
  },
});

export const { setLoading, setData } = ingredientsSlice.actions;
export const ingredientsSelectors = {
  selectLoading: (state: RootState) => state.ingredients.loading,
  selectData: (state: RootState) => state.ingredients.data,
};

// Thunks
export const fetchIngredients = (): AppThunk => async dispatch => {
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request: getAllIngredients(),
      onSuccessAction: setData,
      onFailFallback: null,
    })
  );
};

export default ingredientsSlice.reducer;
