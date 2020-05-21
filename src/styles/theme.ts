import css from '@emotion/css/macro';
import styled, { CreateStyled } from '@emotion/styled/macro';

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
  },
  border: {
    radius: {
      medium: '0.3em',
    },
  },
  spacing: {
    large: '30px',
  },
  colours: {
    background: {
      backgroundGrey: '#2b2d2f',
      backgroundWhite: '#fffff7',
    },
    text: { pink: 'hotpink' },
  },
};

export const globals = css`
  html,
  .root body {
    height: 100%;
  }
`;

export type Theme = typeof theme;

export default styled as CreateStyled<Theme>;
