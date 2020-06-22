import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { AppThunk, RootState } from './';
import { authSelectors } from './auth/AuthReducer';
import { popToast } from './toast/ToastReducer';
import { FeedbackStatus } from './toast/ToastTypes';
import { nullOrEmptyString } from '../helpers/string';

type DispatchApiActionOptions<ApiReturnType> = {
  request: (token: string) => Promise<ApiReturnType>;
  onSuccessAction: ActionCreatorWithPayload<ApiReturnType, string>;
  onFailFallback: ApiReturnType;
  onSuccessMessage?: string;
};

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
  options: DispatchApiActionOptions<ApiReturnType>
): AppThunk => async (dispatch, getState: () => RootState) => {
  const {
    request,
    onFailFallback,
    onSuccessAction,
    onSuccessMessage,
  } = options;
  dispatch(setLoading(true));
  try {
    const token = authSelectors.selectedToken(getState());
    const result = token ? await request(token) : onFailFallback;
    dispatch(onSuccessAction(result));

    if (!nullOrEmptyString(onSuccessMessage)) {
      dispatch(
        popToast({
          status: FeedbackStatus.INFO,
          message: onSuccessMessage,
        })
      );
    }
  } catch (exception) {
    dispatch(onSuccessAction(onFailFallback));
    dispatch(
      popToast({
        status: FeedbackStatus.ERROR,
        message: exception.message,
      })
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export default dispatchApiAction;
