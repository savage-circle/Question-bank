import { createApp } from "./src/app.ts";
import { CategoriesHandler } from "./src/handlers/CategoriesHandler.ts";
import { LevelsHandler } from "./src/handlers/LevelsHandler.ts";
import prisma from "./src/lib/prisma.ts";
import { CategoriesService } from "./src/services/categories.service.ts";
import { Handlers } from "./src/types/handler.ts";

export const getHandlers = (): Handlers => {
  const levelsHandler = new LevelsHandler();

  const categoriesService = new CategoriesService(prisma);
  const categoriesHandler = new CategoriesHandler(categoriesService);

  return {
    levelsHandler,
    categoriesHandler,
  };
};

const main = () => {
  const port = parseInt(Deno.env.get("PORT") ?? "8000");
  const app = createApp(getHandlers());

  Deno.serve({ port }, app.fetch);

  console.log(`Server running on http://localhost:${port}`);
};

main();
