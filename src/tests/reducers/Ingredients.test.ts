import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import reducer, {
  setLoading,
  ingredientsSelectors,
  setData,
} from '../../ducks/ingredients/IngredientsReducer';
import { RootState } from '../../ducks';
import { dispatchWithTimeout, mockSetToastState } from '../helpers';
import { setPopped } from '../../ducks/toast/ToastReducer';

describe('IngredientsReducer', () => {
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
      const rootState = { ingredients: result };
      expect(ingredientsSelectors.selectLoading(rootState as RootState)).toBe(
        loading
      );
    });

    it('should set the data correctly', () => {
      const data = [
        {
          id: 'ing-1',
          localId: 'ing-1',
        },
      ];

      const result = reducer(initialState, setData(data));
      const rootState = { ingredients: result };
      expect(
        ingredientsSelectors.selectData(rootState as RootState)
      ).toStrictEqual(data);
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    beforeEach(() => jest.resetModules());

    describe('fetchIngredients', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the ingredients with no error', async () => {
        const testIngredient = {
          id: 'ing-1',
          localId: 'ing-1',
        };
        const mockPromise = new Promise(res => res([testIngredient]));
        jest.mock('../../api/ingredient', () => ({
          __esModule: true,
          getAllIngredients: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const {
          fetchIngredients,
        } = require('../../ducks/ingredients/IngredientsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          ingredients: {
            loading: false,
            data: null,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchIngredients());
        const expectedActions = [
          setLoading(true),
          setData([testIngredient]),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should fetch the ingredients with an error', async () => {
        jest.mock('../../api/ingredient', () => ({
          __esModule: true,
          getAllIngredients: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const {
          fetchIngredients,
        } = require('../../ducks/ingredients/IngredientsReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          ingredients: {
            loading: false,
            data: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchIngredients());
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
