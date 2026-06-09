import { CategoriesHandler } from "../handlers/CategoriesHandler.ts";
import { LevelsHandler } from "../handlers/LevelsHandler.ts";
import QuestionsHandler from "../handlers/QuestionsHandler.ts";

export type Handlers = {
  questionsHandler: QuestionsHandler,
  levelsHandler: LevelsHandler,
  categoriesHandler: CategoriesHandler,
}