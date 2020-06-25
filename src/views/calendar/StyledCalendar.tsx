import styled from '../../styles/theme';
import { fullScreen } from '../../styles/common';
import { navBar } from '../../styles/heights';

export const styledCalendar = (Calendar: React.ComponentType) =>
  styled(Calendar)`
    ${fullScreen}
    top: ${navBar};
    padding: ${props => props.theme.spacing.small};
    padding-top: ${props => props.theme.spacing.medium};
    .fc-toolbar {
      flex-direction: column;
    }

    thead {
      position: relative;
      z-index: ${props => props.theme.zIndex.one};
    }

    .fc-event {
      white-space: normal;
    }
  `;
