import styled from '../../styles/theme';
import { navBar } from '../../styles/heights';
import { centerFlex } from '../../styles/common';

const profilePicSize = '50px';

export const styledNavBar = (NavBar: React.ComponentType) => styled(NavBar)`
  position: relative;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  height: ${navBar};
  box-shadow: 4px 0 12px -6px gray, -4px 0 12px -6px gray;
  list-style-type: none;

  ul {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    margin: 0;
    padding-left: 40px;
    li {
      list-style-type: none;
      height: 100%;
      min-width: 30px;
      ${centerFlex}
    }
    li:hover:not(.app-title) {
      background-color: ${props => props.theme.colours.background.hoverGrey};
    }
    .dd-profile {
      position: absolute;
      right: 40px;
    }
  }
`;

export const styledProfile = (Profile: React.ComponentType) =>
  styled(Profile)`
    cursor: pointer;
    display: flex;
    padding: 0 ${props => props.theme.spacing.small};
    div {
      display: flex;
      align-items: center;
    }
    .details {
      display: none;
      align-items: flex-start;
      flex-direction: column;
    }
    ${props => props.theme.mediaQueries[0]} {
      .details {
        display: flex;
      }
    }
    img {
      padding-right: ${props => props.theme.spacing.small};
      width: ${profilePicSize};
      height: ${profilePicSize};
      border-radius: 50%;
    }
  `;
