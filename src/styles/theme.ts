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

const getMediaQueries = (): { [k in keyof typeof breakpoints]: string } => {
  const mq: { [key in keyof typeof breakpoints]: string } = {} as {
    [k in keyof typeof breakpoints]: string;
  };
  Object.keys(breakpoints).forEach((key: string) => {
    const typedKey = key as keyof typeof breakpoints;
    mq[typedKey] = `@media (min-width: ${breakpoints[typedKey]}px)`;
  });
  return mq;
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
      medium: '15px',
      large: '20px',
    },
  },
  border: {
    radius: {
      medium: '0.3em',
      full: '2em',
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
  mediaQueries: getMediaQueries(),
};

export const globals = css`
  html,
  #root,
  body {
    height: 100%;
    ${fullScreen}
  }

  input[type='text'] {
    border-radius: ${theme.border.radius.medium};
  }
`;

export type Theme = typeof theme;

export default styled as CreateStyled<Theme>;
