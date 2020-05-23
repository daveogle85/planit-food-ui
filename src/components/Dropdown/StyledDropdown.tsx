import styled, { Theme } from '../../styles/theme';
import css from '@emotion/css/macro';
import { pointer } from '../../styles/common';
import { listItem } from '../../styles/heights';

const dropdownList = (theme: Theme) => css`
  .dd-list {
    z-index: 1;
    background-color: ${theme.colours.white};
    position: absolute;
    padding: 0;
    align-items: flex-start;
    display: none;
    flex-direction: column;
    width: max-content;
    min-width: 100%;
    border: ${theme.border.thin};
    border-radius: ${theme.border.radius.medium};
    &.dd-open {
      display: flex;
    }
    li {
      ${pointer}
      border-radius: ${theme.border.radius.medium};
      padding: 0 ${theme.spacing.small};
      width: fill-available;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: ${listItem};
      line-height: ${listItem};
    }
  }
`;

export const styleDropdown = (Dropdown: React.ComponentType) =>
  styled(Dropdown)`
    height: 100%;
    position: relative;
    .dd-header {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .dd-header-title {
      ${pointer};
      padding: 0 ${props => props.theme.spacing.small};
    }
    li:hover {
      background-color: ${props =>
        props.theme.colours.background.loginButtonHover};
    }
    ${props => dropdownList(props.theme)}
  `;
