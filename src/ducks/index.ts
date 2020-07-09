import { combineReducers, Action, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './auth/AuthReducer';
import daysReducer from './days/DaysReducer';
import listsReducer from './lists/ListsReducer';
import mealsReducer from './meals/MealsReducer';
import toastReducer from './toast/ToastReducer';
import calendarReducer from './calendar/CalendarReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  calendar: calendarReducer,
  days: daysReducer,
  lists: listsReducer,
  meals: mealsReducer,
  toast: toastReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default rootReducer;
