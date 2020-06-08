import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

const initialState: {
  isAuthenticated: boolean;
  token: string | null;
} = {
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
});

export const { setIsAuthenticated, setToken } = authSlice.actions;
export const authSelectors = {
  selectIsAuthenticated: (state: RootState) => state.auth.isAuthenticated,
  selectedToken: (state: RootState) => state.auth.token,
};

export default authSlice.reducer;
