import css from '@emotion/css/macro';

import { centerFlex, fullScreenRelative, pointer } from '../../styles/common';
import {
  navBar,
  NavBarImageSize,
  NavBarImageSizeMobile,
  logo,
} from '../../styles/heights';
import styled from '../../styles/theme';
import { CssProps } from '../../styles/types';

const navBarImageStyle = (props: CssProps) => css`
  width: ${NavBarImageSizeMobile};
  height: ${NavBarImageSizeMobile};
  border-radius: ${props.theme.border.radius.full};
  ${props.theme.mediaQueries.largeMobile} {
    margin-right: ${props.theme.spacing.small};
    width: ${NavBarImageSize};
    height: ${NavBarImageSize};
  }
`;

export const styledNavIcon = (NavIcon: React.ComponentType) =>
  styled(NavIcon)`
    border: ${props =>
      props.theme.border.medium(props.theme.colours.background.darkGrey)};
    ${navBarImageStyle}
    ${centerFlex}
    svg {
      width: 25px;
      height: 25px;
    }
  `;

export const MenuButton = styled.div`
  display: flex;
  align-items: center;
  margin: 0 ${props => props.theme.spacing.small};
  .button-text {
    display: none;
  }
  svg {
    position: relative;
    display: inline-block;
  }
  ${props => props.theme.mediaQueries.largeMobile} {
    .button-text {
      display: block;
    }
  }
`;

export const styledNavBar = (NavBar: React.ComponentType) => styled(NavBar)`
  position: fixed;
  display: flex;
  background-color: ${props => props.theme.colours.white};
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  height: ${navBar};
  box-shadow: 4px 0 12px -6px ${props => props.theme.colours.black},
    -4px 0 12px -6px ${props => props.theme.colours.black};
  list-style-type: none;
  z-index: ${props => props.theme.zIndex.three};
  ul {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    margin: 0;
    padding-left: 16px;

    li {
      ${pointer}
      list-style-type: none;
      height: 100%;
      min-width: 30px;
      ${centerFlex}
    }

    li:hover:not(.app-title) {
      background-color: ${props => props.theme.colours.background.hoverGrey};
    }

    .title-text {
      display: none;
    }

    ${props => props.theme.mediaQueries.xSmallMobile} {
      padding-left: 40px;
      .title-text {
        display: block;
      }
    }

    .logo-img {
      width: ${logo};
      height: ${logo};
    }

    .app-title {
      white-space: nowrap;
    }

    .dd-menu-items {
      ${fullScreenRelative()}
      display: flex;
      justify-content: flex-end;
      li:not(.dd-list-item) {
        margin-right: ${props => props.theme.spacing.small};
      }
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
      font-weight: ${props => props.theme.font.weight.light};
      font-size: ${props => props.theme.font.size.medium};
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
    }
    ${props => props.theme.mediaQueries.largeMobile} {
      .details {
        display: flex;
      }
    }
    img {
      ${navBarImageStyle}
    }
  `;
