import { Hono, Context } from "@hono/hono";
import { logger } from "@hono/logger";
import { CategoriesHandler } from "./handlers/CategoriesHandler.ts";
import { Handlers } from "./types/handler.ts";
import { LevelsHandler } from "./handlers/LevelsHandler.ts";
import QuestionsHandler from "./handlers/QuestionsHandler.ts";

const createQuestionsRoutes = (questionsHandler: QuestionsHandler) => {
  const questionsApp = new Hono();
  
  questionsApp.get("/delete", questionsHandler.deleteQuestion);
  return questionsApp;
}

const createLevelRoutes = (levelsHandler: LevelsHandler) => {
  const levelsApp = new Hono();

  levelsApp.get("/", levelsHandler.getLevels);

  return levelsApp;
};

const createCategoryRoute = (categoriesHandler: CategoriesHandler) => {
  const categoriesApp = new Hono();

  categoriesApp.get("/", categoriesHandler.getCategories);

  return categoriesApp;
};

const createApiRoutes = (handlers: Handlers) => {
  const apiApp = new Hono();

  apiApp.route("/levels", createLevelRoutes(handlers.levelsHandler));
  apiApp.route("/categories", createCategoryRoute(handlers.categoriesHandler));
  apiApp.route("/questions", createQuestionsRoutes(handlers.questionsHandler));

  return apiApp;
};

export const createApp = (handlers: Handlers) => {
  const app = new Hono();

  app.use(logger());

  // Testing Endpoint
  app.get("/", (c: Context) => c.text("Hey, I am alive!"));

  // Register Routes
  app.route("/api", createApiRoutes(handlers));

  return app;
};
