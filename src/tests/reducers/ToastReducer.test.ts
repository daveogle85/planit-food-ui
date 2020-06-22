import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import reducer, {
  toastSelectors,
  setPopped,
  popToast,
} from '../../ducks/toast/ToastReducer';
import { RootState } from '../../ducks';
import {
  mockPopToastPayload,
  dispatchWithTimeout,
  mockPopToastActions,
} from '../helpers';

describe('ToastReducer', () => {
  describe('reducer, actions and selectors', () => {
    const initialState = {
      status: FeedbackStatus.HIDDEN,
      popped: false,
    };

    it('should return the initial state on first run', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toEqual(initialState);
    });

    it('should set the popped state correctly', () => {
      const popped = true;

      const result = reducer(initialState, setPopped(popped));
      const rootState = { toast: result };
      expect(toastSelectors.selectPopped(rootState as RootState)).toBe(popped);
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    beforeEach(() => jest.resetModules());

    describe('popToast', () => {
      const mockStore = configureMockStore([thunk]);
      it('should pop toast correctly', async () => {
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
          toast: {
            status: FeedbackStatus.HIDDEN,
            popped: false,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          popToast(mockPopToastPayload)
        );
        const expectedActions = mockPopToastActions({
          message: 'test',
          status: FeedbackStatus.WARN,
        });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
