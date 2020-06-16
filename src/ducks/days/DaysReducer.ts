import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '..';
import getDaysByRange from '../../api/day';
import { Day, DayRange } from '../../api/types/DayTypes';
import { dateToISOString } from '../../helpers/date';
import dispatchApiAction from '../loading';

type DaysSlice = {
  loading: boolean;
  data: Array<Day>;
  week: Array<Day>;
};

const initialState: DaysSlice = {
  loading: false,
  data: [],
  week: [],
};

const daysSlice = createSlice({
  name: 'days',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setData(state, action) {
      state.data = action.payload;
    },
    setWeek(state, action) {
      state.week = action.payload;
    },
  },
});

export const { setLoading, setData, setWeek } = daysSlice.actions;
export const daysSelectors = {
  selectLoading: (state: RootState) => state.days.loading,
  // TODO should just have data and not store duplicate values in week
  selectData: (state: RootState) => state.days.data,
  selectWeek: (state: RootState) => state.days.week,
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
  const range = getDayCardRange();
  const fetchDays = getDaysByRange(range);
  const apiCall = dispatchApiAction(setLoading);
  return await dispatch(
    apiCall({
      request: fetchDays,
      onSuccessAction: setData,
      onFailFallback: [],
    })
  );
};

export default daysSlice.reducer;
