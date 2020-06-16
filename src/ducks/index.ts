import { combineReducers, Action, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './auth/AuthReducer';
import daysReducer from './days/DaysReducer';
import listsReducer from './lists/ListsReducer';
import toastReducer from './toast/ToastReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  days: daysReducer,
  toast: toastReducer,
  lists: listsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default rootReducer;
