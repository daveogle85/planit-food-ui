import classNames from 'classnames';
import React from 'react';

import css from '@emotion/css/macro';

import { centerFlex, fullScreen } from '../../styles/common';
import { spinnerBoxHeight, spinnerBubbleHeight } from '../../styles/heights';
import { ellipsis1, ellipsis2, ellipsis3 } from '../../styles/keyframes';
import styled from '../../styles/theme';
import { EmotionProps } from '../../styles/types';

const Spinner: React.FC<EmotionProps> = props => (
  <div className={classNames(props.className, 'spinner')}>
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

const ellipsisAnimation = (keyframe: typeof ellipsis1) =>
  css`
    animation: ${keyframe} 0.6s infinite;
  `;

const StyledSpinner = styled(Spinner)`
  ${fullScreen}
  ${centerFlex}
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: ${spinnerBoxHeight};
    height: ${spinnerBoxHeight};
    div {
      position: absolute;
      top: 33px;
      width: ${spinnerBubbleHeight};
      height: ${spinnerBubbleHeight};
      border-radius: ${props => props.theme.border.radius.full};
      background: ${props => props.theme.colours.background.backgroundGrey};
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    div:nth-of-type(1) {
      left: 8px;
      ${ellipsisAnimation(ellipsis1)}
    }
    div:nth-of-type(2) {
      left: 8px;
      ${ellipsisAnimation(ellipsis2)}
    }
    div:nth-of-type(3) {
      left: 32px;
      ${ellipsisAnimation(ellipsis2)}
    }
    div:nth-of-type(4) {
      left: 56px;
      ${ellipsisAnimation(ellipsis3)}
    }
  }
`;

export default StyledSpinner;
