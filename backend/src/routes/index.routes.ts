import type { Hono } from "@hono/hono";
import { apiRoutes } from "./api.routes.ts";

export const registerRoutes = (app: Hono) => {
  app.route("/api", apiRoutes);
};