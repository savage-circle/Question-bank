import { Hono } from "@hono/hono";
import { logger } from "@hono/logger";
import { registerRoutes } from "./routes/index.routes.ts";

export const createApp = () => {
  const app = new Hono();

  app.use(logger());
  app.get("/", (c) => c.text("Hey, I am alive!"));
  registerRoutes(app);

  return app;
};
