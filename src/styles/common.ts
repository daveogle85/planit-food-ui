import css from '@emotion/css/macro';
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
