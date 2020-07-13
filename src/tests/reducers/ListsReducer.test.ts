import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { List } from '../../api/types/ListTypes';
import { RootState } from '../../ducks';
import reducer, {
  listsSelectors,
  setLists,
  setLoading,
  setSelectedList,
  setSideBarOpen,
  setSelectedMeal,
} from '../../ducks/lists/ListsReducer';
import { setPopped } from '../../ducks/toast/ToastReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { Meal } from '../../api/types/MealTypes';
import {
  dispatchWithTimeout,
  mockSetToastState,
  mockPopToastActions,
} from '../helpers';
import { setData as setMeals } from '../../ducks/meals/MealsReducer';
import { setData as setDishes } from '../../ducks/dishes/DishesReducer';

describe('DaysReducer', () => {
  describe('reducer, actions and selectors', () => {
    const initialState = {
      loading: false,
      selectedList: null,
      lists: [],
      sideBarOpen: false,
      selectedMeal: null,
    };

    it('should return the initial state on first run', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toEqual(initialState);
    });

    it('should set the loading flag correctly', () => {
      const loading = true;

      const result = reducer(initialState, setLoading(loading));
      const rootState = { lists: result };
      expect(listsSelectors.selectLoading(rootState as RootState)).toBe(
        loading
      );
    });

    it('should set the lists correctly', () => {
      const lists: Array<List> = [
        {
          id: '1',
          name: 'default',
          meals: [],
        },
      ];

      const result = reducer(initialState, setLists(lists));
      const rootState = { lists: result };
      expect(listsSelectors.selectLists(rootState as RootState)).toBe(lists);
    });

    it('should set the selected list', () => {
      const selectedList: List = {
        id: '1',
        name: 'default',
        meals: [],
      };

      const result = reducer(initialState, setSelectedList(selectedList));
      const rootState = { lists: result };
      expect(listsSelectors.selectSelectedList(rootState as RootState)).toBe(
        selectedList
      );
    });

    it('should set the sideBar open flag correctly', () => {
      const sideBarOpen = true;

      const result = reducer(initialState, setSideBarOpen(sideBarOpen));
      const rootState = { lists: result };
      expect(listsSelectors.selectSideBarOpen(rootState as RootState)).toBe(
        sideBarOpen
      );
    });

    it('should set the selected meal correctly', () => {
      const selectedMeal: Meal = {
        id: '1',
        localId: '1',
        name: 'default',
        dishes: [],
      };

      const result = reducer(initialState, setSelectedMeal(selectedMeal));
      const rootState = { lists: result };
      expect(listsSelectors.selectedSelectedMeal(rootState as RootState)).toBe(
        selectedMeal
      );
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    const mockDefaultList = {
      id: '1',
      name: 'default',
      meals: [
        {
          id: '1',
          localId: '1',
          name: 'meal-1',
        },
      ],
    };
    const mockListsResponse: Array<List> = [
      mockDefaultList,
      {
        id: '2',
        name: 'test-list-2',
        meals: [],
      },
    ];
    beforeEach(() => jest.resetModules());

    describe('fetchLists', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the available lists with no error', async () => {
        const mockListsPromise = new Promise(res => res(mockListsResponse));
        jest.mock('../../api/list', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => mockListsPromise),
        }));
        const { fetchLists } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: [],
          },
        };
        const store = mockStore(initialState);
        await store.dispatch(fetchLists() as any);
        const expectedActions = [
          setLoading(true),
          setLists(mockListsResponse),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should fetch the available lists with error', async () => {
        jest.mock('../../api/list', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { fetchLists } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchLists());
        const expectedActions = [
          setLoading(true),
          setLists([]),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('fetchDefaultList', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the default list with no error', async () => {
        const mockListPromise = new Promise(res => res(mockDefaultList));
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          getListByName: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const { fetchDefaultList } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await store.dispatch(fetchDefaultList() as any);
        const expectedActions = [
          setLoading(true),
          setSelectedList(mockDefaultList),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockGetListByName).toBeCalledWith('default');
      });

      it('should fetch the first list if no default list with no error', async () => {
        const mockListPromise = new Promise(res => res(mockListsResponse[1]));
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          getListByName: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const { fetchDefaultList } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: mockListsResponse.filter(l => l.name !== 'default'),
          },
        };

        const store = mockStore(initialState);
        await store.dispatch(fetchDefaultList() as any);
        const expectedActions = [
          setLoading(true),
          setSelectedList(mockListsResponse[1]),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockGetListByName).toBeCalledWith('test-list-2');
      });

      it('should fetch the default list with error', async () => {
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          getListByName: mockGetListByName.mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { fetchDefaultList } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchDefaultList());
        const expectedActions = [
          setLoading(true),
          setSelectedList(null),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockGetListByName).toBeCalledWith('default');
      });

      it('should pop toast if no lists available', async () => {
        const mockListPromise = new Promise(res => res(mockDefaultList));
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          getListByName: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const { fetchDefaultList } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchDefaultList());
        const expectedActions = mockPopToastActions({
          status: FeedbackStatus.ERROR,
          message: 'Cannot set default List, no lists are available',
        });
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockGetListByName).not.toHaveBeenCalled();
      });
    });

    describe('addMealToSelectedList', () => {
      const mockStore = configureMockStore([thunk]);
      const mealToAdd: Meal = {
        id: 'new',
        localId: 'new',
        name: 'new',
      };
      it('should add meal to list with no error', async () => {
        const mockListPromise = new Promise(res =>
          res({
            ...mockDefaultList,
            meals: [...mockDefaultList.meals, mealToAdd],
          })
        );
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateMealInList: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const {
          addMealToSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: mockDefaultList,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          addMealToSelectedList(mealToAdd)
        );
        const expectedActions = [
          setLoading(true),
          setSelectedList({
            ...mockDefaultList,
            meals: [...mockDefaultList.meals, mealToAdd],
          }),
          setMeals(null),
          setDishes(null),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.INFO,
            message: '"new" Added to List: default',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should add meal to list with error', async () => {
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateMealInList: mockGetListByName.mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const {
          addMealToSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: mockDefaultList,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          addMealToSelectedList(mealToAdd)
        );
        const expectedActions = [
          setLoading(true),
          setSelectedList({
            ...mockDefaultList,
          }),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should not add meal to list if no selected list', async () => {
        const mockListPromise = new Promise(res =>
          res({
            ...mockDefaultList,
            meals: [...mockDefaultList.meals, mealToAdd],
          })
        );
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateMealInList: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const {
          addMealToSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          addMealToSelectedList(mealToAdd)
        );
        const expectedActions = mockPopToastActions({
          status: FeedbackStatus.ERROR,
          message: 'No list selected',
        });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('deleteMealFromSelectedList', () => {
      const mockStore = configureMockStore([thunk]);
      const mealToDelete: Meal = {
        id: 'new',
        localId: 'new',
        name: 'new',
      };
      it('should delete meal from list with no error', async () => {
        const mockListPromise = new Promise(res =>
          res({
            ...mockDefaultList,
            meals: [],
          })
        );
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateList: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const {
          deleteMealFromSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: mockDefaultList,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteMealFromSelectedList(mealToDelete)
        );
        const expectedActions = [
          setLoading(true),
          setSelectedList({
            ...mockDefaultList,
            meals: [],
          }),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.INFO,
            message: 'Meal "new" deleted',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should delete a meal from the list and remove selected meal if a match', async () => {
        const mockListPromise = new Promise(res =>
          res({
            ...mockDefaultList,
            meals: [],
          })
        );
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateList: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const {
          deleteMealFromSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: mockDefaultList,
            lists: mockListsResponse,
            selectedMeal: mealToDelete,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteMealFromSelectedList(mealToDelete)
        );
        const expectedActions = [
          setLoading(true),
          setSelectedList({
            ...mockDefaultList,
            meals: [],
          }),
          setSelectedMeal(null),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.INFO,
            message: 'Meal "new" deleted',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should delete a meal from the list with error', async () => {
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateList: mockGetListByName.mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const {
          deleteMealFromSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: mockDefaultList,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteMealFromSelectedList(mealToDelete)
        );
        const expectedActions = [
          setLoading(true),
          setSelectedList({
            ...mockDefaultList,
          }),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should not delete a meal from list if no selected list', async () => {
        const mockListPromise = new Promise(res =>
          res({
            ...mockDefaultList,
            meals: [],
          })
        );
        const mockGetListByName = jest.fn();
        jest.mock('../../api/list', () => ({
          __esModule: true,
          updateList: mockGetListByName.mockReturnValueOnce(
            () => mockListPromise
          ),
        }));
        const {
          deleteMealFromSelectedList,
        } = require('../../ducks/lists/ListsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            week: [],
          },
          lists: {
            loading: false,
            selectedList: null,
            lists: mockListsResponse,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteMealFromSelectedList(mealToDelete)
        );
        const expectedActions = mockPopToastActions({
          status: FeedbackStatus.ERROR,
          message: 'Selected list was not found',
        });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
