import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../';
import getLists, { getListByName, updateMealInList } from '../../api/list';
import { List } from '../../api/types/ListTypes';
import { Meal } from '../../api/types/MealTypes';
import dispatchApiAction from '../loading';
import { setToastState } from '../toast/ToastReducer';
import { FeedbackStatus } from '../toast/ToastTypes';

type ListsSlice = {
  loading: boolean;
  selectedList: List | null;
  lists: Array<List>;
};

type AddMealsToListPayload = {
  name: string;
  meals: Array<Meal>;
};

const initialState: ListsSlice = {
  loading: false,
  selectedList: null,
  lists: [],
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLists(state, action) {
      state.lists = action.payload;
    },
    setSelectedList(state, action: PayloadAction<List | null>) {
      state.selectedList = action.payload;
    },
  },
});

export const { setLoading, setLists, setSelectedList } = listsSlice.actions;
export const listsSelectors = {
  selectLoading: (state: RootState) => state.lists.loading,
  selectLists: (state: RootState) => state.lists.lists,
  selectSelectedList: (state: RootState) => state.lists.selectedList,
};

// Thunks
export const fetchLists = (): AppThunk => async dispatch => {
  const apiCall = dispatchApiAction(setLoading);
  const fetchLists = getLists();
  await dispatch(
    apiCall({
      request: fetchLists,
      onSuccessAction: setLists,
      onFailFallback: [],
    })
  );
};

export const fetchDefaultList = (): AppThunk => async (
  dispatch,
  getState: () => RootState
) => {
  const lists = getState().lists.lists;
  const defaultList =
    lists.find(r => r?.name?.toLowerCase() === 'default') ?? lists[0];

  if (defaultList?.name) {
    const apiCall = dispatchApiAction(setLoading);
    const fetchDefaultList = getListByName(defaultList.name);
    await dispatch(
      apiCall({
        request: fetchDefaultList,
        onSuccessAction: setSelectedList,
        onFailFallback: null,
      })
    );
  } else {
    dispatch(
      setToastState({
        status: FeedbackStatus.ERROR,
        message: 'Cannot set default List, no lists are available',
      })
    );
  }
};

export const addMealToSelectedList = (meal: Meal): AppThunk => async (
  dispatch,
  getState: () => RootState
) => {
  const selectedList = listsSelectors.selectSelectedList(getState());
  if (selectedList?.id) {
    const apiCall = dispatchApiAction(setLoading);
    const updateList = updateMealInList(selectedList.id, meal);
    return await dispatch(
      apiCall({
        request: updateList,
        onSuccessAction: setSelectedList,
        onFailFallback: selectedList,
        onSuccessMessage: `"${meal.name}" Added to List: ${selectedList.name}`,
      })
    );
  } else {
    dispatch(
      setToastState({
        status: FeedbackStatus.ERROR,
        message: 'No list selected',
      })
    );
  }
};

export default listsSlice.reducer;
