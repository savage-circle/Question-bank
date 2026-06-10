/**
 * Upper-cases the first character and lower-cases the rest,
 * matching the normalization previously provided by lodash's `capitalize`.
 */
export const capitalize = (value: string): string => {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
