import styled from '../styles/theme';
import { fullScreenRelative } from '../styles/common';
import { navBar } from '../styles/heights';

export const styledWeekView = (WeekView: React.ComponentType) => styled(
  WeekView
)`
  ${fullScreenRelative(navBar)}
`;
