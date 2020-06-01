import css from '@emotion/css/macro';
import styled, { CreateStyled } from '@emotion/styled/macro';
import { fullScreen } from './common';
import { colours } from './colours';

export const breakpoints = {
  smallMobile: 576,
  largeMobile: 768,
  tablet: 992,
  desktop: 1200,
};

export const theme = {
  font: {
    weight: {
      light: 300,
      normal: 400,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
      black: 900,
    },
    size: {
      small: '12px',
    },
  },
  border: {
    radius: {
      medium: '0.3em',
    },
    thin: `1px solid ${colours.background.backgroundGrey}`,
  },
  spacing: {
    small: '8px',
    medium: '20px',
    large: '30px',
    xLarge: '40px',
  },
  colours,
  zIndex: {
    one: 1,
    two: 2,
  },
  mediaQueries: Object.values(breakpoints).map(
    bp => `@media (min-width: ${bp}px)`
  ),
};

export const globals = css`
  html,
  #root,
  body {
    height: 100%;
    ${fullScreen}
  }
`;

export type Theme = typeof theme;

export default styled as CreateStyled<Theme>;
