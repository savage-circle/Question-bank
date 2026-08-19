import { createApp } from "./src/app.ts";
import { CategoryHandler } from "./src/handlers/CategoryHandler.ts";
import { LevelHandler } from "./src/handlers/LevelHandler.ts";
import { TopicHandler } from "./src/handlers/TopicHandler.ts";
import { QuestionHandler } from "./src/handlers/QuestionHandler.ts";
import { FollowUpHandler } from "./src/handlers/FollowUpHandler.ts";
import prisma from "./src/lib/prisma.ts";
import { CategoryService } from "./src/services/CategoryService.ts";
import { TopicService } from "./src/services/TopicService.ts";
import { QuestionService } from "./src/services/QuestionService.ts";
import { FollowUpService } from "./src/services/FollowUpService.ts";
import { Handlers } from "./src/types/handler.ts";
import { ValidationService } from "./src/services/ValidationService.ts";

export const getHandlers = (): Handlers => {
  const levelsHandler = new LevelHandler();
  const validationService = new ValidationService();

  const categoriesService = new CategoryService(prisma);
  const categoriesHandler = new CategoryHandler(
    categoriesService,
    validationService,
  );

  const topicService = new TopicService(prisma);
  const topicHandler = new TopicHandler(
    topicService,
    categoriesService,
    validationService,
  );

  const questionService = new QuestionService(prisma);
  const questionHandler = new QuestionHandler(
    questionService,
    topicService,
    validationService,
  );

  const followUpService = new FollowUpService(prisma);
  const followUpHandler = new FollowUpHandler(
    followUpService,
    questionService,
    validationService,
  );

  return {
    levelsHandler,
    categoriesHandler,
    topicHandler,
    questionHandler,
    followUpHandler,
  };
};

const main = () => {
  const port = parseInt(Deno.env.get("PORT") ?? "8000");
  const app = createApp(getHandlers());

  Deno.serve({ port }, app.fetch);

  console.log(`Server running on http://localhost:${port}`);
};

main();
