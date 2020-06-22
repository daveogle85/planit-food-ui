import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { toastSelectors, setPopped } from '../../ducks/toast/ToastReducer';
import { EmotionProps } from '../../styles/types';
import { styledToast } from './StyledToast';

function ToastRaw(props: EmotionProps) {
  const { status, message, popped } = useSelector(
    toastSelectors.selectToastState
  );
  const [poppedClassName, setPoppedClassName] = useState('hidden');
  const dispatch = useDispatch();
  const handleCloseToast = () => dispatch(setPopped(false));

  useEffect(() => {
    if (popped) {
      setPoppedClassName('pop');
    } else {
      setTimeout(() => setPoppedClassName('hidden'), 500);
    }
  }, [popped]);

  return (
    <div
      className={classNames(
        props.className,
        'toast',
        {
          show: popped,
          close: !popped,
        },
        poppedClassName
      )}
      css={styledToast(status)}
    >
      <div className="header">
        <div>{status.toString()}</div>
        <div className="close" onClick={handleCloseToast}>
          ✖
        </div>
      </div>
      <div className="message">{message}</div>
    </div>
  );
}

const Toast = ToastRaw as React.ComponentType;

export default Toast;
