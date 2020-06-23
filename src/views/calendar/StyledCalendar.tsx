import styled from '../../styles/theme';
import { fullScreen } from '../../styles/common';
import { navBar } from '../../styles/heights';
// import { CssProps } from '../../styles/types';
// import css from '@emotion/css/macro';

export const styledCalendar = (Calendar: React.ComponentType) =>
  styled(Calendar)`
    ${fullScreen}
    top: ${navBar};
    padding: ${props => props.theme.spacing.small};
    padding-top: ${props => props.theme.spacing.medium};
    .fc-toolbar {
      flex-direction: column;
    }
  `;
