import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import reducer, {
  setLoading,
  mealsSelectors,
  setData,
} from '../../ducks/meals/MealsReducer';
import { setData as setDishes } from '../../ducks/dishes/DishesReducer';
import { RootState } from '../../ducks';
import { dispatchWithTimeout, mockSetToastState } from '../helpers';
import { setPopped } from '../../ducks/toast/ToastReducer';

describe('MealReducer', () => {
  describe('reducer, actions and selectors', () => {
    const initialState = {
      loading: false,
      data: null,
    };

    it('should return the initial state on first run', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toEqual(initialState);
    });

    it('should set the loading flag correctly', () => {
      const loading = true;

      const result = reducer(initialState, setLoading(loading));
      const rootState = { meals: result };
      expect(mealsSelectors.selectLoading(rootState as RootState)).toBe(
        loading
      );
    });

    it('should set the data correctly', () => {
      const data = [
        {
          id: 'meal-1',
          localId: 'meal-1',
        },
      ];

      const result = reducer(initialState, setData(data));
      const rootState = { meals: result };
      expect(mealsSelectors.selectData(rootState as RootState)).toStrictEqual(
        data
      );
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    beforeEach(() => jest.resetModules());

    describe('fetchMeals', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the meals with no error', async () => {
        const testMeal = {
          id: 'meal-1',
          localId: 'meal-1',
        };
        const mockPromise = new Promise(res => res([testMeal]));
        jest.mock('../../api/meal', () => ({
          __esModule: true,
          getAllMeals: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const { fetchMeals } = require('../../ducks/meals/MealsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          meals: {
            loading: false,
            data: null,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchMeals());
        const expectedActions = [
          setLoading(true),
          setData([testMeal]),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should fetch the meals with an error', async () => {
        jest.mock('../../api/meal', () => ({
          __esModule: true,
          getAllMeals: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { fetchMeals } = require('../../ducks/meals/MealsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          meals: {
            loading: false,
            data: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchMeals());
        const expectedActions = [
          setLoading(true),
          setData(null),
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

    describe('saveMeal', () => {
      const mockStore = configureMockStore([thunk]);
      it('should save a meal with no error', async () => {
        const testMeal = {
          id: 'meal-1',
          localId: 'meal-1',
          name: 'my meal',
        };
        const mockPromise = new Promise(res => res(testMeal));
        jest.mock('../../api/meal', () => ({
          __esModule: true,
          updateMeal: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const { saveMeal } = require('../../ducks/meals/MealsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          meals: {
            loading: false,
            data: null,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, saveMeal(testMeal));
        const expectedActions = [
          setLoading(true),
          setData(null),
          setDishes(null),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.INFO,
            message: '"my meal" successfully updated',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should save a meal with an error', async () => {
        const testMeal = {
          id: 'meal-1',
          localId: 'meal-1',
          name: 'my meal',
        };
        jest.mock('../../api/meal', () => ({
          __esModule: true,
          updateMeal: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { saveMeal } = require('../../ducks/meals/MealsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          meals: {
            loading: false,
            data: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, saveMeal(testMeal));
        const expectedActions = [
          setLoading(true),
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
  });
});
