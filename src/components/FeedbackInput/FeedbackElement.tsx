import classNames from 'classnames';
import React from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { FeedbackElementProps } from './FeedbackElementTypes';
import { styledFeedbackInput } from './StyledFeedbackInput';
import { BorderInfoState } from '../../styles/border';

function FeedbackElement(props: React.PropsWithChildren<FeedbackElementProps>) {
  const { children, className, state } = props;
  const hidden = state.borderState === BorderInfoState.HIDDEN;
  return (
    <div
      className={classNames(className, {
        'feedback-hidden': hidden,
      })}
      css={styledFeedbackInput(state.borderState, state.message)}
    >
      {children}
      {!hidden && <div className="feedback-icon">i</div>}
    </div>
  );
}

export default (FeedbackElement as unknown) as React.FC<FeedbackElementProps>;
