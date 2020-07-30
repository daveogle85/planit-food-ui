import styled, { theme } from '../../styles/theme';
import { pointer } from '../../styles/common';

import css from '@emotion/css/macro';

export const feedbackStyles = css`
  max-width: 100%;
  :not(.feedback-hidden) > *:first-child {
    padding: ${theme.spacing.xSmall};
  }

  .feedback-icon {
    top: 5px;
    left: 5px;

    &:after:hover {
      bottom: -1px;
      left: 20px;
    }
  }
`;

export const styledCalendar = (Calendar: React.ComponentType) =>
  styled(Calendar)`
    padding: ${props => props.theme.spacing.small};
    padding-top: ${props => props.theme.spacing.medium};

    &.isEditMode {
      padding: calc(${props => props.theme.spacing.small} - 2px);
      padding-top: calc(${props => props.theme.spacing.medium} - 2px);
    }

    .fc {
      padding: ${props => props.theme.spacing.xSmall};
    }

    .fc-header-toolbar {
      display: flex;
      flex-direction: column;
    }

    thead {
      position: relative;
      z-index: ${props => props.theme.zIndex.one};
    }

    .fc-event {
      white-space: normal;
    }

    .fc-meal {
      width: 100%;
    }

    .fc-daygrid-day {
      ${pointer}
    }

    .delete-meal {
      float: right;
      margin-top: ${props => props.theme.spacing.xxSmall};
      margin-right: ${props => props.theme.spacing.xxSmall};
      padding: 0;
      color: ${props => props.theme.colours.background.hoverGrey};
      width: 12px;
      line-height: 12px;
      ${pointer}
    }
  `;
