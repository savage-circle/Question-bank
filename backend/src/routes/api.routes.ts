import { Hono } from "@hono/hono";
import type { Context } from "@hono/hono";
import { getLevels } from "../services/common.service.ts";

export const apiRoutes = new Hono();

apiRoutes.get("/levels", (context: Context) => {
  return context.json(getLevels(), 200);
});