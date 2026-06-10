import { createApp } from "./src/app.ts";
import { CategoryHandler } from "./src/handlers/CategoryHandler.ts";
import { LevelHandler } from "./src/handlers/LevelHandler.ts";
import { TopicHandler } from "./src/handlers/TopicHandler.ts";
import { QuestionHandler } from "./src/handlers/QuestionHandler.ts";
import prisma from "./src/lib/prisma.ts";
import { CategoryService } from "./src/services/category.service.ts";
import { TopicService } from "./src/services/topic.service.ts";
import { QuestionService } from "./src/services/question.service.ts";
import { Handlers } from "./src/types/handler.ts";

export const getHandlers = (): Handlers => {
  const levelsHandler = new LevelHandler();

  const categoriesService = new CategoryService(prisma);
  const categoriesHandler = new CategoryHandler(categoriesService);

  const topicService = new TopicService(prisma);
  const topicHandler = new TopicHandler(topicService, categoriesService);

  const questionService = new QuestionService(prisma);
  const questionHandler = new QuestionHandler(questionService, topicService);

  return {
    levelsHandler,
    categoriesHandler,
    topicHandler,
    questionHandler,
  };
};

const main = () => {
  const port = parseInt(Deno.env.get("PORT") ?? "8000");
  const app = createApp(getHandlers());

  Deno.serve({ port }, app.fetch);

  console.log(`Server running on http://localhost:${port}`);
};

main();

