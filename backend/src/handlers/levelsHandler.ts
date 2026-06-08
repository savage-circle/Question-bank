import { Context, TypedResponse } from "jsr:@hono/hono";
import LevelType from "../enums/levelType.ts";
import { Level } from "../types/level.ts";

export class LevelsHandler {
  constructor() {
    // bind methods
    this.getLevels = this.getLevels.bind(this);
  }

  getLevels(c : Context): TypedResponse<Level[]> {
    const levelArray: Level[] = Object.keys(LevelType)
      .filter((key) => isNaN(Number(key)))
      .map(
        (key): Level => ({
          id: LevelType[key as keyof typeof LevelType],
          name: key,
        }),
      );

    return c.json(levelArray);
  }
}
