export const nullOrEmptyString = (
  s: string | null | undefined
): s is "" | null | undefined => s == null || s === "";
