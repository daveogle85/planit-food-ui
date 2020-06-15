import { BorderInfoState } from '../../styles/border';

export type FeedbackElementState = {
  borderState: BorderInfoState;
  message?: string;
};

export type FeedbackElementProps = {
  state: FeedbackElementState;
  className?: string;
};
