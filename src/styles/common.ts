import css from '@emotion/css/macro';
import borderTheme from './border';
import { inputHeight } from './heights';
import { colours } from './colours';
export const fullScreen = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const fullScreenRelative = (
  heightOffset = '0px',
  widthOffset = '0px'
) => css`
  position: relative;
  height: calc(100% - ${heightOffset});
  width: calc(100% - ${widthOffset});
`;

export const centerFlex = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const pointer = css`
  cursor: pointer;
`;

export const circularButton = css`
  padding: 2px;
  height: 20px;
  width: 20px;
  border-radius: ${borderTheme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const unselectable = css`
  user-select: none;
`;

export const input = css`
  :not([type='checkbox']) {
    height: ${inputHeight};
    width: 100%;
    max-width: 500px;
    padding-left: 4px;
    border: ${borderTheme.medium(colours.background.darkGrey)};
    border-radius: ${borderTheme.radius.medium};
  }
`;
