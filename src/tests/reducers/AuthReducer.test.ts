import reducer, {
  setIsAuthenticated,
  authSelectors,
  setToken,
} from '../../ducks/auth/AuthReducer';
import { RootState } from '../../ducks';

describe('AuthReducer', () => {
  describe('reducer, actions and selectors', () => {
    const initialState = {
      isAuthenticated: false,
      token: null,
    };

    it('should return the initial state on first run', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toEqual(initialState);
    });

    it('should set isAuthenticated correctly', () => {
      const isAuthenticated = true;

      const result = reducer(initialState, setIsAuthenticated(isAuthenticated));
      const rootState = { auth: result };
      expect(authSelectors.selectIsAuthenticated(rootState as RootState)).toBe(
        isAuthenticated
      );
    });

    it('should set the token correctly', () => {
      const token = '123abc';

      const result = reducer(initialState, setToken(token));
      const rootState = { auth: result };
      expect(authSelectors.selectedToken(rootState as RootState)).toBe(token);
    });
  });
});
