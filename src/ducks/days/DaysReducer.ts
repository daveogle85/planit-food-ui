import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../';
import getDaysByRange, { addDay, deleteDay } from '../../api/day';
import { Day, DayRange } from '../../api/types/DayTypes';
import {
  datesAreOnSameDay,
  dateToISOString,
  getOverlappingRange,
  isDayWithinRange,
} from '../../helpers/date';
import { updateObject } from '../../helpers/object';
import { setSelectedMeal } from '../lists/ListsReducer';
import dispatchApiAction from '../loading';
import { setSelectedDay } from '../calendar/CalendarReducer';

type DaysSlice = {
  loading: boolean;
  data: Array<Day>;
  requestedRange?: DayRange;
};

const initialState: DaysSlice = {
  loading: false,
  data: [],
};

const daysSlice = createSlice({
  name: 'days',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setData(state, action: PayloadAction<Array<Day>>) {
      const updatedDays = [...state.data];
      action.payload.forEach(day => {
        const foundIndex = updatedDays.findIndex(
          d => d.date === day.date && d.id === day.id
        );
        if (foundIndex === -1) {
          updatedDays.push(day);
        } else {
          updatedDays[foundIndex] = updateObject(updatedDays[foundIndex], day);
        }
      });
      state.data = updatedDays;
    },
    updateRequestedRange(state, action: PayloadAction<DayRange>) {
      if (state.requestedRange == null) {
        state.requestedRange = action.payload;
      } else {
        state.requestedRange = {
          startDate:
            Date.parse(action.payload.startDate) <
            Date.parse(state.requestedRange.startDate)
              ? action.payload.startDate
              : state.requestedRange.startDate,
          endDate:
            Date.parse(action.payload.endDate) <
            Date.parse(state.requestedRange.endDate)
              ? state.requestedRange.endDate
              : action.payload.endDate,
        };
      }
    },
    removeDay(state, action: PayloadAction<Day | null>) {
      state.data = state.data.filter(day => day.date !== action.payload?.date);
    },
  },
});

const selectData = (state: RootState) => state.days.data;
const selectDataForCarousel = createSelector(selectData, data => {
  const dayRange = getDayCardRange();
  return data.filter(day => isDayWithinRange(dayRange, day.date));
});

const selectMealsAsEvents = createSelector(selectData, data =>
  data.map(day => ({ title: day?.meal?.name, date: day?.date }))
);

export const {
  setLoading,
  setData,
  updateRequestedRange,
  removeDay,
} = daysSlice.actions;
export const daysSelectors = {
  selectLoading: (state: RootState) => state.days.loading,
  selectData,
  selectRequestedRange: (state: RootState) => state.days.requestedRange,
  selectDataForCarousel,
  selectMealsAsEvents,
};

export const getDayCardRange = (): DayRange => {
  const today = new Date();
  const day = today.getDay();
  let prevMonday = new Date();

  // Today or the last Monday
  prevMonday =
    day === 1
      ? prevMonday
      : new Date(new Date().setDate(today.getDate() - ((day + 6) % 7)));

  const nextSunday = new Date(new Date().setDate(prevMonday.getDate() + 6));
  return {
    startDate: dateToISOString(prevMonday),
    endDate: dateToISOString(nextSunday),
  };
};

// Thunks
export const fetchDayDataForCarousel = (): AppThunk => async dispatch => {
  const dayCardRange = getDayCardRange();
  const fetchDays = getDaysByRange(dayCardRange, true);
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request: fetchDays,
      onSuccessAction: setData,
      onFailFallback: [],
    })
  );
};

export const fetchMealsForRange = (dayRange: DayRange): AppThunk => async (
  dispatch,
  getState
) => {
  const requestedRange = daysSelectors.selectRequestedRange(getState());
  const range = requestedRange
    ? getOverlappingRange(requestedRange, dayRange)
    : dayRange;
  if (range) {
    const request = getDaysByRange(range);
    const apiCall = dispatchApiAction(setLoading);
    return await dispatch(
      apiCall({
        request,
        onSuccessAction: setData,
        additionalSuccessActions: [updateRequestedRange(range)],
        onFailFallback: [],
      })
    );
  }
};

export const addDayToCalendar = (day: Day): AppThunk => async dispatch => {
  const request = addDay(day);
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request,
      onSuccessAction: setData,
      onSuccessMessage: `${day.meal.name} added to ${day.date}`,
      additionalSuccessActions: [setSelectedMeal(null), setSelectedDay(null)],
      onFailFallback: [],
    })
  );
};

export const deleteDayFromCalendar = (date: Date): AppThunk => async (
  dispatch,
  getState
) => {
  const day = selectData(getState()).find((day: Day) =>
    datesAreOnSameDay(new Date(day.date ?? ''), date)
  );
  if (day != null) {
    const request = deleteDay(day);
    const apiCall = dispatchApiAction(setLoading);
    return await dispatch(
      apiCall({
        request,
        onSuccessAction: removeDay,
        onSuccessMessage: `${day.meal.name} removed`,
        onFailFallback: null,
      })
    );
  }
};

export default daysSlice.reducer;
