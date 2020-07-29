import css from '@emotion/css/macro';
import styled, { CreateStyled } from '@emotion/styled/macro';

import border from './border';
import { colours } from './colours';
import { fullScreen } from './common';
import { navBar } from './heights';

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
      xSmall: '8px',
      small: '12px',
      medium: '15px',
      large: '20px',
    },
  },
  border,
  spacing: {
    xxSmall: '2px',
    xSmall: '4px',
    small: '8px',
    medium: '20px',
    large: '30px',
    xLarge: '40px',
  },
  colours,
  zIndex: {
    one: 1,
    two: 2,
    three: 3,
  },
  mediaQueries: getMediaQueries(),
};

export const globals = css`
  html,
  #root,
  body {
    margin: 0;
    ${fullScreen}
  }

  html,
  body {
    height: 100%;
  }

  #root {
    margin-top: ${navBar};
  }

  input[type='text'] {
    border-radius: ${theme.border.radius.medium};
    padding-left: ${theme.spacing.xSmall};
  }

  button {
    border: ${theme.border.thin(theme.colours.background.backgroundGrey)};
    border-radius: ${theme.border.radius.medium};
  }
`;

export type Theme = typeof theme;

export default styled as CreateStyled<Theme>;
