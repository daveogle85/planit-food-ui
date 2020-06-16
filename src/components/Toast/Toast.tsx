import classNames from 'classnames';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { toastSelectors, setToastState } from '../../ducks/toast/ToastReducer';
import { EmotionProps } from '../../styles/types';
import { styledToast } from './StyledToast';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';

function ToastRaw(props: EmotionProps) {
  const [hidden, setHidden] = useState(false);
  const { status, message } = useSelector(toastSelectors.selectToastState);
  const dispatch = useDispatch();

  const hideToast = () => {
    setHidden(true);
    setTimeout(() => {
      dispatch(
        setToastState({
          status: FeedbackStatus.HIDDEN,
        })
      );
      setHidden(false);
    }, 500);
  };

  const hideToastCached = useCallback(hideToast, []);

  useEffect(() => {
    setTimeout(() => {
      hideToastCached();
    }, 5000);
  }, [status, hideToastCached]);

  return (
    <div
      className={classNames(props.className, 'toast', {
        show: status !== FeedbackStatus.HIDDEN,
        hidden,
      })}
      css={styledToast(status)}
    >
      <div className="header">
        <div>{status.toString()}</div>
        <div className="close" onClick={hideToastCached}>
          ✖
        </div>
      </div>
      <div className="message">{message}</div>
    </div>
  );
}

const Toast = ToastRaw as React.ComponentType;

export default Toast;
