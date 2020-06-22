import css from '@emotion/css/macro';

import styled from '../../styles/theme';
import { CssProps } from '../../styles/types';
import { tabDim, navBar } from '../../styles/heights';
import { pointer, unselectable, circularButton } from '../../styles/common';

// const

const expand = (props: CssProps) => css`
  .expand {
    margin-right: ${props.theme.spacing.small};
    background-color: ${props.theme.colours.background.darkGrey};
    ${circularButton}
  }

  &.meal-expanded .expand > svg {
    transform: rotate(90deg);
  }
`;

const dishes = (props: CssProps) => css`
  .dishes {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-out;
    ul {
      display: none;
    }

    li {
      list-style: square;
    }
  }

  &.meal-expanded .dishes {
    padding: ${props.theme.spacing.small};
    padding-left: ${props.theme.spacing.xLarge};
    ul {
      display: block;
    }
    max-height: 200px;
  }
`;

const tab = (props: CssProps) => css`
  .tab {
    ${unselectable}
    position: absolute;
    ${pointer}
    display: flex;
    justify-content: center;
    left: -${tabDim.width + 1}px;
    top: 0;
    width: ${tabDim.width}px;
    background-color: ${props.theme.colours.background.weekViewPurple};
    > div {
      position: relative;
      padding: 10px;
      writing-mode: sideways-lr;
    }

    .spinner {
      transform: rotate(90deg);
    }

    :after {
      content: '';
      position: absolute;
      z-index: ${props.theme.zIndex.one};
      background-color: ${props.theme.colours.background.weekViewPurple};
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
      transform: skewY(10deg);
      border-radius: 0 0 0 5px;
      height: 1em;
      width: 100%;
      bottom: -0.5em;
    }
  }
`;

export const styleListComponent = <T>(ListComponent: T) =>
  (styled((ListComponent as unknown) as React.ComponentType)`
    ${unselectable}
    right: 0;
    padding: 0;
    border: ${props => props.theme.border.thin(props.theme.colours.black)};
    border-right: none;
    border-top: none;
    border-bottom-left-radius: ${props => props.theme.border.radius.full};
    background-color: ${props => props.theme.colours.background.weekViewPurple};
    position: absolute;
    top: ${navBar};
    bottom: 0;
    width: 0;
    max-width: calc(100% - ${tabDim.width}px);
    z-index: ${props => props.theme.zIndex.two};
    transition: 0.5s;
    ${tab}

    ul {
      padding: 0;
      list-style: none;
    }

    &:not(.draw-open) .draw-content {
      display: none;
    }

    .draw-content {
      padding: ${props => props.theme.spacing.small};
    }

    &.draw-open {
      width: 400px;
    }
  ` as unknown) as T;

export const styleMealItem = <T>(MealItem: T) =>
  (styled((MealItem as unknown) as React.ComponentType)`
    border: ${props =>
      props.theme.border.thin(props.theme.colours.background.darkGrey)};
    border-radius: ${props => props.theme.border.radius.medium};
    margin: ${props => props.theme.spacing.small};

    &.selected {
      background-color: ${props => props.theme.colours.background.mealCardBlue};
    }

    .meal-item {
      display: flex;
      margin: ${props => props.theme.spacing.small};
      align-items: center;
      justify-content: space-between;

      > div {
        display: flex;
        align-items: center;
      }

      .meal-name {
        padding-right: ${props => props.theme.spacing.small};
      }

      .add {
        margin-right: ${props => props.theme.spacing.small};
        background-color: ${props => props.theme.colours.addGreen};
        ${circularButton}
      }

      .delete {
        margin-right: ${props => props.theme.spacing.small};
        background-color: ${props => props.theme.colours.errorRed};
        ${circularButton}
      }
    }
    ${expand}
    ${dishes}
    ${pointer}
  ` as unknown) as T;
