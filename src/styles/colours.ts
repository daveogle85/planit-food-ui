import { FeedbackStatus } from '../ducks/toast/ToastTypes';

export const colours = {
  white: '#fff',
  black: '#000',
  errorRed: '#cc0000',
  lightErrorRed: '#ffcccc',
  warningAmber: '#ffbf00',
  lightWarningAmber: '#fff3d1',
  infoGreen: '#00703c',
  lightInfoGreen: '#b9decd',
  addGreen: '#53dd49',
  daySelectedBlue: '#ebf8fb',
  background: {
    weekViewPurple: '#7f53ac',
    weekViewBlue: '#647dee',
    modalTeal: '#377d73',
    backgroundGrey: '#2b2d2f',
    darkGrey: '#9b9797',
    backgroundWhite: '#fffff7',
    loginButton: '#4db6ac',
    loginButtonHover: '#46627f',
    hoverGrey: '#f1f1f1',
    whiteSmoke: '#f5f5f5',
    mealCardBlue: '#e6fcff',
  },
  text: { pink: 'hotpink' },
};

export function RGBAToHexA(
  red: number,
  green: number,
  blue: number,
  opacity: number
) {
  let r = red.toString(16);
  let g = green.toString(16);
  let b = blue.toString(16);
  let a = Math.round(opacity * 255).toString(16);

  r = r.length === 1 ? '0' + r : r;
  g = g.length === 1 ? '0' + g : g;
  b = b.length === 1 ? '0' + b : b;
  a = a.length === 1 ? '0' + a : a;

  return '#' + r + g + b + a;
}

export const getColourFromStatus = (status: FeedbackStatus, light = false) => {
  switch (status) {
    case FeedbackStatus.ERROR:
      return light ? colours.lightErrorRed : colours.errorRed;
    case FeedbackStatus.WARN:
      return light ? colours.lightWarningAmber : colours.warningAmber;
    case FeedbackStatus.INFO:
      return light ? colours.lightInfoGreen : colours.infoGreen;
    default:
      return colours.background.darkGrey;
  }
};
