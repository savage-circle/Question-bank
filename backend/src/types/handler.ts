import { CategoriesHandler } from "../handlers/CategoriesHandler.ts";
import { LevelsHandler } from "../handlers/LevelsHandler.ts";

export type Handlers = {
  levelsHandler: LevelsHandler,
  categoriesHandler: CategoriesHandler,
}