import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ToastState, FeedbackStatus } from './ToastTypes';

const initialState: ToastState = {
  status: FeedbackStatus.HIDDEN,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToastState(state, action: PayloadAction<ToastState>) {
      state.status = action.payload.status;
      state.message = action.payload.message;
    },
  },
});

export const { setToastState } = toastSlice.actions;
export const toastSelectors = {
  selectToastState: (state: RootState) => state.toast,
};

export default toastSlice.reducer;
