import { LEVEL_DEFINITIONS } from "../constants/levels.ts";
import type { Level } from "../types/levels.ts";

export const getLevels = (): Level[] => {
  return LEVEL_DEFINITIONS.map((level) => ({
    id: level.id,
    name: level.name,
  }));
};
