import { Hono } from "@hono/hono";
import type { Context } from "@hono/hono";
import { getLevels } from "../services/common.service.ts";
import { getCategories } from "../services/categories.service.ts";

export const apiRoutes = new Hono();

apiRoutes.get("/levels", (context: Context) => {
  return context.json(getLevels(), 200);
});

apiRoutes.get("/categories", async (context: Context) => {
  const categories = await getCategories();
  return context.json(categories, 200);
});
  