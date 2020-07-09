import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../';
import getLists, {
  getListByName,
  updateMealInList,
  updateList,
} from '../../api/list';
import { List } from '../../api/types/ListTypes';
import { Meal } from '../../api/types/MealTypes';
import dispatchApiAction from '../loading';
import { popToast } from '../toast/ToastReducer';
import { FeedbackStatus } from '../toast/ToastTypes';

type ListsSlice = {
  loading: boolean;
  selectedList: List | null;
  lists: Array<List>;
  sideBarOpen: boolean;
  selectedMeal: Meal | null;
};

const initialState: ListsSlice = {
  loading: false,
  selectedList: null,
  lists: [],
  sideBarOpen: false,
  selectedMeal: null,
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
    setSideBarOpen(state, action) {
      state.sideBarOpen = action.payload;
    },
    setSelectedMeal(state, action) {
      state.selectedMeal = action.payload;
    },
  },
});

export const {
  setLoading,
  setLists,
  setSelectedList,
  setSideBarOpen,
  setSelectedMeal,
} = listsSlice.actions;
export const listsSelectors = {
  selectLoading: (state: RootState) => state.lists.loading,
  selectLists: (state: RootState) => state.lists.lists,
  selectSelectedList: (state: RootState) => state.lists.selectedList,
  selectSideBarOpen: (state: RootState) => state.lists.sideBarOpen,
  selectedSelectedMeal: (state: RootState) => state.lists.selectedMeal,
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
      popToast({
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
    const updateList = updateMealInList(selectedList, meal);
    await dispatch(
      apiCall({
        request: updateList,
        onSuccessAction: setSelectedList,
        onFailFallback: selectedList,
        onSuccessMessage: `"${meal.name}" Added to List: ${selectedList.name}`,
      })
    );
  } else {
    dispatch(
      popToast({
        status: FeedbackStatus.ERROR,
        message: 'No list selected',
      })
    );
  }
};

export const deleteMealFromSelectedList = (meal: Meal): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const selectedList = listsSelectors.selectSelectedList(state);

  if (!selectedList) {
    dispatch(
      popToast({
        status: FeedbackStatus.ERROR,
        message: `Selected list was not found`,
      })
    );
  } else {
    const updatedList = {
      ...selectedList,
      meals: selectedList.meals.filter(m => meal.id !== m.id),
    };
    const apiCall = dispatchApiAction(setLoading);
    const updateListRequest = updateList(updatedList);
    const additionalSuccessActions =
      state.lists.selectedMeal?.id === meal.id ? [setSelectedMeal(null)] : [];
    await dispatch(
      apiCall({
        request: updateListRequest,
        onFailFallback: selectedList,
        onSuccessAction: setSelectedList,
        onSuccessMessage: `Meal "${meal.name}" deleted`,
        additionalSuccessActions,
      })
    );
  }
};

export default listsSlice.reducer;
