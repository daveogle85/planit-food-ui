import classNames from 'classnames';
import React from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { FeedbackElementProps } from './FeedbackElementTypes';
import { styledFeedbackInput } from './StyledFeedbackInput';

function FeedbackElement(props: React.PropsWithChildren<FeedbackElementProps>) {
  const { children, className, state, styles } = props;
  const hidden = state.status === FeedbackStatus.HIDDEN;
  const elementStyles = [
    styledFeedbackInput(state.status, state.message),
    styles,
  ];
  return (
    <div
      className={classNames(className, {
        'feedback-hidden': hidden,
      })}
      css={elementStyles}
    >
      {children}
      {!hidden && <div className="feedback-icon">i</div>}
    </div>
  );
}

export default (FeedbackElement as unknown) as React.FC<FeedbackElementProps>;
