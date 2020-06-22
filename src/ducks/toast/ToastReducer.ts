import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import { ToastState, FeedbackStatus, ErrorState } from './ToastTypes';

const initialState: ToastState = {
  status: FeedbackStatus.HIDDEN,
  popped: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToastState(state, action: PayloadAction<ErrorState>) {
      state.status = action.payload.status;
      state.message = action.payload.message;
    },
    setPopped(state, action) {
      state.popped = action.payload;
    },
  },
});

export const { setPopped } = toastSlice.actions;
export const toastSelectors = {
  selectToastState: (state: RootState) => state.toast,
  selectPopped: (state: RootState) => state.toast.popped,
};

// Thunks
export const popToast = (toastState: ErrorState): AppThunk => dispatch => {
  dispatch(setPopped(true));
  dispatch(toastSlice.actions.setToastState(toastState));
  setTimeout(() => {
    dispatch(setPopped(false));
  }, 5000);
};

export default toastSlice.reducer;
