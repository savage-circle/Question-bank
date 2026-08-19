import { Context, Hono } from "@hono/hono";
import { logger } from "@hono/logger";
import { CategoryHandler } from "./handlers/CategoryHandler.ts";
import { LevelHandler } from "./handlers/LevelHandler.ts";
import { TopicHandler } from "./handlers/TopicHandler.ts";
import { QuestionHandler } from "./handlers/QuestionHandler.ts";
import { FollowUpHandler } from "./handlers/FollowUpHandler.ts";
import { Handlers } from "./types/handler.ts";

const createLevelRoutes = (levelsHandler: LevelHandler) => {
  const levelsApp = new Hono();

  levelsApp.get("/", levelsHandler.getLevels);

  return levelsApp;
};

const createCategoryRoute = (categoriesHandler: CategoryHandler) => {
  const categoriesApp = new Hono();

  categoriesApp.get("/", categoriesHandler.getCategories);
  categoriesApp.post("/", categoriesHandler.createCategory);
  categoriesApp.put("/:id", categoriesHandler.updateCategory);

  return categoriesApp;
};

const createTopicRoute = (topicHandler: TopicHandler) => {
  const topicApp = new Hono();

  topicApp.get("/", topicHandler.getTopics);
  topicApp.post("/", topicHandler.addTopic);
  topicApp.delete("/:id", topicHandler.deleteTopic);

  return topicApp;
};

const createQuestionRoute = (questionHandler: QuestionHandler) => {
  const questionApp = new Hono();

  questionApp.get("/", questionHandler.getQuestions);
  questionApp.post("/", questionHandler.addQuestion);
  questionApp.put("/:id", questionHandler.updateQuestion);

  return questionApp;
};

const createFollowUpRoute = (followUpHandler: FollowUpHandler) => {
  const followUpApp = new Hono();

  followUpApp.get("/", followUpHandler.getFollowUps);
  followUpApp.post("/", followUpHandler.addFollowUp);
  followUpApp.put("/:id", followUpHandler.updateFollowUp);
  followUpApp.delete("/:id", followUpHandler.deleteFollowUp);

  return followUpApp;
};

const createApiRoutes = (handlers: Handlers) => {
  const apiApp = new Hono();

  apiApp.route("/levels", createLevelRoutes(handlers.levelsHandler));
  apiApp.route("/categories", createCategoryRoute(handlers.categoriesHandler));
  apiApp.route("/topics", createTopicRoute(handlers.topicHandler));
  apiApp.route("/questions", createQuestionRoute(handlers.questionHandler));
  apiApp.route("/follow-ups", createFollowUpRoute(handlers.followUpHandler));
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
