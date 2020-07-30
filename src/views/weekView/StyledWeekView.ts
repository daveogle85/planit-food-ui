import styled from '../../styles/theme';

export const styledWeekView = (WeekView: React.ComponentType) => styled(
  WeekView
)`
  height: 100%;
  background-color: ${props => props.theme.colours.background.weekViewPurple};
  background-image: linear-gradient(
    315deg,
    ${props => props.theme.colours.background.weekViewPurple} 0%,
    ${props => props.theme.colours.background.weekViewBlue} 74%
  );
`;
