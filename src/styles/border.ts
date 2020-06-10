const borderTheme = {
  radius: {
    medium: '0.3em',
    full: '2em',
  },
  thin: (colour: string) => `1px solid ${colour}`,
};

export enum BorderInfoState {
  ERROR,
  WARN,
  INFO,
}

export default borderTheme;
