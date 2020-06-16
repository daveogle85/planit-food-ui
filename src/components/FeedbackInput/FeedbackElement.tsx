import classNames from 'classnames';
import React from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { FeedbackElementProps } from './FeedbackElementTypes';
import { styledFeedbackInput } from './StyledFeedbackInput';

function FeedbackElement(props: React.PropsWithChildren<FeedbackElementProps>) {
  const { children, className, state } = props;
  const hidden = state.status === FeedbackStatus.HIDDEN;
  return (
    <div
      className={classNames(className, {
        'feedback-hidden': hidden,
      })}
      css={styledFeedbackInput(state.status, state.message)}
    >
      {children}
      {!hidden && <div className="feedback-icon">i</div>}
    </div>
  );
}

export default (FeedbackElement as unknown) as React.FC<FeedbackElementProps>;
