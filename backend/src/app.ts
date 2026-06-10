import { Context, Hono } from "@hono/hono";
import { logger } from "@hono/logger";
import { CategoryHandler } from "./handlers/CategoryHandler.ts";
import { Handlers } from "./types/handler.ts";
import { LevelHandler } from "./handlers/LevelHandler.ts";
import { TopicHandler } from "./handlers/TopicHandler.ts";
import { QuestionHandler } from "./handlers/QuestionHandler.ts";

const createLevelRoutes = (levelsHandler: LevelHandler) => {
  const levelsApp = new Hono();

  levelsApp.get("/", levelsHandler.getLevels);

  return levelsApp;
};

const createCategoryRoute = (categoriesHandler: CategoryHandler) => {
  const categoriesApp = new Hono();

  categoriesApp.get("/", categoriesHandler.getCategories);

  return categoriesApp;
};

const createTopicRoute = (topicHandler: TopicHandler) => {
  const topicApp = new Hono();

  topicApp.get("/", topicHandler.getTopics);
  topicApp.post("/", topicHandler.addTopic);

  return topicApp;
};

const createQuestionRoute = (questionHandler: QuestionHandler) => {
  const questionApp = new Hono();

  questionApp.get("/", questionHandler.getQuestions);
  questionApp.put("/:id", questionHandler.updateQuestion);

  return questionApp;
};

const createApiRoutes = (handlers: Handlers) => {
  const apiApp = new Hono();

  apiApp.route("/levels", createLevelRoutes(handlers.levelsHandler));
  apiApp.route("/categories", createCategoryRoute(handlers.categoriesHandler));
  apiApp.route("/topics", createTopicRoute(handlers.topicHandler));
  apiApp.route("/questions", createQuestionRoute(handlers.questionHandler));
  return apiApp;
};

export const createApp = (handlers: Handlers) => {
  const app = new Hono();

  app.use(logger());

  // Catch-all for anything a handler doesn't handle itself.
  app.onError((err, c: Context) => {
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
  });

  // Testing Endpoint
  app.get("/", (c: Context) => c.text("Hey, I am alive!"));

  // Register Routes
  app.route("/api", createApiRoutes(handlers));

  return app;
};
