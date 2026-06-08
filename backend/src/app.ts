import { Hono, Context } from "@hono/hono";
import { logger } from "@hono/logger";
import { LevelsHandler } from "./handlers/levelsHandler.ts";
import { Handlers } from "./types/handlers.ts";
import { getCategories } from "./services/categories.service.ts";

const createLevelRoutes = (levelsHandler : LevelsHandler) => {
  const levelsApp = new Hono();
  
  levelsApp.get("/", levelsHandler.getLevels);

  return levelsApp;
}

const createQuestionRoutes = () => {
  const questionApp = new Hono();

  questionApp.get("/", (c:Context) => c.text("Question route"));
  questionApp.post("/", (c:Context) => c.text("Create a new question"));
  questionApp.put("/:id", (c:Context) => c.text(`Update question with ID ${c.req.param("id")}`));
  questionApp.delete("/:id", (c:Context) => c.text(`Delete question with ID ${c.req.param("id")}`));  

  return questionApp;
}


const createTopicRoutes = () => {
  const topicApp = new Hono();

  topicApp.get("/", (c:Context) => c.text("Topic route"));
  topicApp.post("/", (c:Context) => c.text("Create a new topic"));
  topicApp.delete("/:id", (c:Context) => c.text(`Delete topic with ID ${c.req.param("id")}`));

  return topicApp;
}

const createCategoryRoute =()=>{
  const categoriesApp = new Hono();
  categoriesApp.get("/", async (context: Context) => {
  const categories = await getCategories();
  return context.json(categories, 200);
});
  return categoriesApp;
}

const createApiRoutes = (handlers: Handlers) => {
  const apiApp = new Hono();

  apiApp.route("/levels", createLevelRoutes(handlers.levelsHandler));
  apiApp.route("/questions", createQuestionRoutes());
  apiApp.route("/topics", createTopicRoutes());
  apiApp.route("/categories", createCategoryRoute());

  return apiApp;
}

export const createApp = (handlers : Handlers) => {
  const app = new Hono();

  app.use(logger());

  // Testing Endpoint
  app.get("/", (c:Context) => c.text("Hey, I am alive!"));

  // Register Routes
  app.route("/api", createApiRoutes(handlers));

  return app;
};
