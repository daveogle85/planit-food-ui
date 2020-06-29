import { ErrorState } from '../../ducks/toast/ToastTypes';
import { SerializedStyles } from '@emotion/core';

export type FeedbackElementProps = {
  state: ErrorState;
  className?: string;
  styles?: SerializedStyles;
};
