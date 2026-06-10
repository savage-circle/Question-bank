/**
 * Shared id validation used by every handler.
 * `undefined` is treated as valid so optional query params pass through;
 * any concrete value must be a positive number.
 */
export const isValidId = (value: number | string | undefined): boolean => {
  if (value === undefined) {
    return true;
  }

  return Number(value) > 0;
};
