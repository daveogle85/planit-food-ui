import React from 'react';
import { BorderInfoState } from '../../styles/border';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { styledFeedbackInput } from './StyledFeedbackInput';

type FeedbackInputProps = {
  borderState: BorderInfoState;
  message?: string;
  hideBorder?: boolean;
};

function FeedbackInput(
  props: FeedbackInputProps &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
) {
  const { borderState, message, hideBorder, ...rest } = props;
  return (
    <div
      css={styledFeedbackInput(
        props.borderState,
        Boolean(hideBorder),
        props.message
      )}
    >
      <input {...rest} />
      {!props.hideBorder && <div className="feedback-icon">i</div>}
    </div>
  );
}

export default (FeedbackInput as unknown) as React.FC<
  FeedbackInputProps &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
>;
