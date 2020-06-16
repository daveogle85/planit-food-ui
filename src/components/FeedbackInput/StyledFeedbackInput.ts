import css from '@emotion/css/macro';

import { centerFlex, pointer } from '../../styles/common';
import { theme } from '../../styles/theme';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { getColourFromStatus } from '../../styles/colours';

export const styledFeedbackInput = (
  state: FeedbackStatus = FeedbackStatus.INFO,
  message?: string
) => {
  const borderColour = getColourFromStatus(state);
  const iconStyle = css`
    .feedback-icon {
      width: 13px;
      height: 13px;
      position: absolute;
      right: 5px;
      font-size: ${theme.font.size.small};
      font-weight: ${theme.font.weight.bold};
      color: ${borderColour};
      border-radius: ${theme.border.radius.full};
      border: ${theme.border.medium(borderColour)};
      ${centerFlex};
      ${pointer};
    }
  `;

  const messageStyle = css`
    .feedback-icon:after {
      content: '${message}';
      display: none;
      position: absolute;
      white-space: nowrap;
      border: ${theme.border.thin(borderColour)};
      border-radius: ${theme.border.radius.medium};
      padding: 2px;
      bottom: 150%;
      background: white;
      opacity: 0.9;
      font-size: ${theme.font.size.xSmall};
    }
    .feedback-icon:hover:after {
      display: block;
    }
  `;

  return css`
    width: max-content;
    display: flex;
    position: relative;
    align-items: center;
    :not(.feedback-hidden) > *:first-child {
      padding-right: 25px;
      border: ${theme.border.medium(borderColour)};
      border-radius: ${theme.border.radius.medium};
      height: calc(100% - 6px); // account for border
    }
    ${iconStyle}
    ${messageStyle}
  `;
};
