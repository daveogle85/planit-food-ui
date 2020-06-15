import { AppThunk, RootState } from '.';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { authSelectors } from './auth/AuthReducer';

/**
 * Generic function to handle setting loading and calling
 * an api action.
 *
 * @param setLoading  the action that sets the loading state
 * @param apiCall the async api call that returns a promise.
 * @param onSuccessDispatch the action to call on success.
 * @param onFailFallback the value to set in case of a fail
 */
export const dispatchApiAction = (
  setLoading: ActionCreatorWithPayload<boolean, string>
) => <ApiReturnType>(
  apiCall: (token: string) => Promise<ApiReturnType>,
  onSuccessDispatch: ActionCreatorWithPayload<ApiReturnType, string>,
  onFailFallback: ApiReturnType
): AppThunk => async (dispatch, getState: () => RootState) => {
  dispatch(setLoading(true));
  try {
    const token = authSelectors.selectedToken(getState());
    const result = token ? await apiCall(token) : onFailFallback;
    dispatch(onSuccessDispatch(result));
  } catch (exception) {
    dispatch(onSuccessDispatch(onFailFallback));
  } finally {
    dispatch(setLoading(false));
  }
};

export default dispatchApiAction;
