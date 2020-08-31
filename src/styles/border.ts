const borderTheme = {
  radius: {
    medium: "0.3em",
    full: "2em",
  },
  thin: (colour: string) => `1px solid ${colour}`,
  medium: (colour: string) => `2px solid ${colour}`,
};

export default borderTheme;
