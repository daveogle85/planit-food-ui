import styled from '../../styles/theme';
import {
  navBar,
  NavBarImageSize,
  NavBarImageSizeMobile,
} from '../../styles/heights';
import { centerFlex, fullScreenRelative, pointer } from '../../styles/common';
import css from '@emotion/css/macro';
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

const PLUS_EDGE = '5px';

export const Add = styled.div`
  display: flex;
  align-items: center;
  margin: 0 ${props => props.theme.spacing.small};
  .add-text {
    display: none;
  }
  span {
    position: relative;
    display: inline-block;
    border: 2px solid ${props => props.theme.colours.background.darkGrey};
    ${navBarImageStyle}
    &:before {
      content: '';
      left: ${PLUS_EDGE};
      right: ${PLUS_EDGE};
      position: absolute;
      background-color: ${props => props.theme.colours.background.darkGrey};
      top: 50%;
      height: 2px;
    }
    &:after {
      content: '';
      top: ${PLUS_EDGE};
      bottom: ${PLUS_EDGE};
      position: absolute;
      background-color: ${props => props.theme.colours.background.darkGrey};
      left: 50%;
      width: 2px;
    }
  }
  ${props => props.theme.mediaQueries.largeMobile} {
    .add-text {
      display: block;
    }
  }
`;

export const styledNavBar = (NavBar: React.ComponentType) => styled(NavBar)`
  position: relative;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  height: ${navBar};
  box-shadow: 4px 0 12px -6px ${props => props.theme.colours.black},
    -4px 0 12px -6px ${props => props.theme.colours.black};
  list-style-type: none;
  z-index: ${props => props.theme.zIndex.one};
  ul {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    margin: 0;
    padding-left: 40px;
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
