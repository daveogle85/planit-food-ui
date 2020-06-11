import React from 'react';
import classNames from 'classnames';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { BorderInfoState } from '../../styles/border';
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
      className={classNames(props.className, { 'feedback-hidden': hideBorder })}
      css={styledFeedbackInput(props.borderState, props.message)}
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
