import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import reducer, {
  setLoading,
  dishesSelectors,
  setData,
} from '../../ducks/dishes/DishesReducer';
import { RootState } from '../../ducks';
import { dispatchWithTimeout, mockSetToastState } from '../helpers';
import { setPopped } from '../../ducks/toast/ToastReducer';

describe('DishesReducer', () => {
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
      const rootState = { dishes: result };
      expect(dishesSelectors.selectLoading(rootState as RootState)).toBe(
        loading
      );
    });

    it('should set the data correctly', () => {
      const data = [
        {
          id: 'dish-1',
          localId: 'dish-1',
        },
      ];

      const result = reducer(initialState, setData(data));
      const rootState = { dishes: result };
      expect(dishesSelectors.selectData(rootState as RootState)).toStrictEqual(
        data
      );
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    beforeEach(() => jest.resetModules());

    describe('fetchDishes', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the dishes with no error', async () => {
        const testDish = {
          id: 'dish-1',
          localId: 'dish-1',
        };
        const mockPromise = new Promise(res => res([testDish]));
        jest.mock('../../api/dish', () => ({
          __esModule: true,
          getAllDishes: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const { fetchDishes } = require('../../ducks/dishes/DishesReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          dishes: {
            loading: false,
            data: null,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchDishes());
        const expectedActions = [
          setLoading(true),
          setData([testDish]),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should fetch the dishes with an error', async () => {
        jest.mock('../../api/dish', () => ({
          __esModule: true,
          getAllDishes: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { fetchDishes } = require('../../ducks/dishes/DishesReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          dishes: {
            loading: false,
            data: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchDishes());
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
  });
});
