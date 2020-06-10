export const nullOrEmptyString = (s: string | null | undefined): s is string =>
  s == null || s === '';
