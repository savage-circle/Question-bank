import { Hono } from "@hono/hono";
import { logger } from "@hono/logger";
import { LevelsHandler } from "./handlers/levelsHandler.ts";
import { Handlers } from "./types/handlers.ts";

const createLevelRoutes = (levelsHandler : LevelsHandler) => {
  const levelsApp = new Hono();
  
  levelsApp.get("/", levelsHandler.getLevels);

  return levelsApp;
}

const createQuestionRoutes = () => {
  const questionApp = new Hono();

  questionApp.get("/", (c) => c.text("Question route"));
  questionApp.post("/", (c) => c.text("Create a new question"));
  questionApp.put("/:id", (c) => c.text(`Update question with ID ${c.req.param("id")}`));
  questionApp.delete("/:id", (c) => c.text(`Delete question with ID ${c.req.param("id")}`));  

  return questionApp;
}


const createTopicRoutes = () => {
  const topicApp = new Hono();

  topicApp.get("/", (c) => c.text("Topic route"));
  topicApp.post("/", (c) => c.text("Create a new topic"));
  topicApp.delete("/:id", (c) => c.text(`Delete topic with ID ${c.req.param("id")}`));

  return topicApp;
}

export const createApp = (handlers : Handlers) => {
  const app = new Hono();

  app.use(logger());

  // Testing Endpoint
  app.get("/", (c) => c.text("Hey, I am alive!"));

  // Register Routes
  app.route("/api/levels", createLevelRoutes(handlers.levelsHandler));
  app.route("/api/questions", createQuestionRoutes());
  app.route("/api/topics", createTopicRoutes());

  return app;
};
