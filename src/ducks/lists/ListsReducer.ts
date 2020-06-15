import { List } from '../../api/types/ListTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Meal } from '../../api/types/MealTypes';
import { RootState, AppThunk } from '..';
import { authSelectors } from '../auth/AuthReducer';
import getLists, { getListByName, updateMealInList } from '../../api/list';
import dispatchApiAction from '../loading';

type ListsSlice = {
  loading: boolean;
  updatingSelectedList: boolean;
  selectedList: List | null;
  lists: Array<List>;
};

type AddMealsToListPayload = {
  name: string;
  meals: Array<Meal>;
};

const initialState: ListsSlice = {
  loading: false,
  updatingSelectedList: false,
  selectedList: null,
  lists: [],
};

const updateMealsInList = (list: List, meals: Array<Meal>): List => list;

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUpdatingSelectedList(state, action) {
      state.updatingSelectedList = action.payload;
    },
    setLists(state, action) {
      state.lists = action.payload;
    },
    setSelectedList(state, action) {
      state.selectedList = action.payload;
    },
    addMealsToList(state, action: PayloadAction<AddMealsToListPayload>) {
      state.lists = state.lists.map(list =>
        list.name === action.payload.name
          ? updateMealsInList(list, action.payload.meals)
          : list
      );
    },
  },
});

export const {
  setLoading,
  setUpdatingSelectedList,
  setLists,
  addMealsToList,
  setSelectedList,
} = listsSlice.actions;
export const listsSelectors = {
  selectLoading: (state: RootState) => state.lists.loading,
  selectUpdatingSelectedList: (state: RootState) =>
    state.lists.updatingSelectedList,
  selectLists: (state: RootState) => state.lists.lists,
  selectSelectedList: (state: RootState) => state.lists.selectedList,
};

// Thunks
export const fetchLists = (): AppThunk => async (
  dispatch,
  getState: () => RootState
) => {
  dispatch(setLoading(true));
  try {
    let selectedList = null;
    const token = authSelectors.selectedToken(getState());
    const results: Array<List> = token ? await getLists()(token) : [];
    const defaultList =
      results.find(r => r?.name?.toLowerCase() === 'default') ?? results[0];

    if (defaultList?.name != null) {
      selectedList = token
        ? await getListByName(defaultList.name)(token)
        : null;
      dispatch(setSelectedList(selectedList));
    }

    dispatch(setLists(results));
  } catch (err) {
    dispatch(setLists([]));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addMealToSelectedList = (meal: Meal): AppThunk => async (
  dispatch,
  getState: () => RootState
) => {
  const selectedList = listsSelectors.selectSelectedList(getState());
  if (selectedList?.id) {
    const apiCall = dispatchApiAction(setUpdatingSelectedList);
    const updateList = updateMealInList(selectedList.id, meal);
    return await dispatch(apiCall(updateList, setSelectedList, null));
  }
};

export default listsSlice.reducer;
