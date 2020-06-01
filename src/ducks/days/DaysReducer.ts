import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import getDaysByRange from '../../api/day';
import { ApiDay } from '../../api/types';

type DaysSlice = {
  loading: boolean;
  data: Array<ApiDay>;
  week: Array<ApiDay>;
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

// Thunks
export const fetchDayDataForCarousel = (): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  try {
    const days = await getDaysByRange();
    dispatch(setData(days));
    dispatch(setWeek(days)); // TODO
    // const repoDetails = await getRepoDetails(org, repo);
    // dispatch(getRepoDetailsSuccess(repoDetails));
  } catch (err) {
    dispatch(setData([]));
    // dispatch(getRepoDetailsFailed(err.toString()));
  } finally {
    dispatch(setLoading(false));
  }
};

export default daysSlice.reducer;
