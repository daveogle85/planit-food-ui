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
    size: {
      small: '12px',
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
    white: '#fff',
    background: {
      modalTeal: '#377d73',
      backgroundGrey: '#2b2d2f',
      backgroundWhite: '#fffff7',
      loginButton: '#4db6ac',
      loginButtonHover: '#46627f',
      whitesmoke: '#f5f5f5',
    },
    text: { pink: 'hotpink' },
  },
  zIndex: {
    one: 1,
    two: 2,
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
