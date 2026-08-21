import _ from "lodash";

export const normalizeName = (name: string): string => _.capitalize(name.trim());

