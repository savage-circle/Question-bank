import { Hono } from "@hono/hono";
import { logger } from "@hono/logger";

export const createApp = () => {
  const app = new Hono();

  app.use(logger());
  app.get("/", (c) => c.text("Hey, I am alive!"));

  return app;
};
