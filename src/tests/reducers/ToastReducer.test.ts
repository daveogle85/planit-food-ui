import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import reducer, {
  setToastState,
  toastSelectors,
} from '../../ducks/toast/ToastReducer';
import { RootState } from '../../ducks';

describe('ToastReducer', () => {
  describe('reducer, actions and selectors', () => {
    const initialState = {
      status: FeedbackStatus.HIDDEN,
    };

    it('should return the initial state on first run', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toEqual(initialState);
    });

    it('should set the state correctly', () => {
      const newState = {
        status: FeedbackStatus.WARN,
        message: 'test',
      };

      const result = reducer(initialState, setToastState(newState));
      const rootState = { toast: result };
      expect(
        toastSelectors.selectToastState(rootState as RootState)
      ).toStrictEqual(newState);
    });

    it('should overwrite the old state correctly', () => {
      const newState = {
        status: FeedbackStatus.DISABLED,
      };

      const result = reducer(
        {
          status: FeedbackStatus.ERROR,
          message: 'test',
        },
        setToastState(newState)
      );
      const rootState = { toast: result };
      expect(
        toastSelectors.selectToastState(rootState as RootState)
      ).toStrictEqual({ ...newState, message: undefined });
    });
  });
});
