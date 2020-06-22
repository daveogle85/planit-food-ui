import styled from '../../styles/theme';
import { fullScreenRelative } from '../../styles/common';
import { navBar } from '../../styles/heights';

export const styledWeekView = (WeekView: React.ComponentType) => styled(
  WeekView
)`
         ${fullScreenRelative(navBar)}
         background-color: ${props =>
           props.theme.colours.background.weekViewPurple};
         background-image: linear-gradient(315deg, ${props =>
           props.theme.colours.background.weekViewPurple} 0%, ${props =>
  props.theme.colours.background.weekViewBlue} 74%);
       `;
