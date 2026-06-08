import { CategoryHandler } from "../handlers/CategoryHandler.ts";
import { LevelHandler } from "../handlers/LevelHandler.ts";
import { TopicHandler } from "../handlers/TopicHandler.ts";

export type Handlers = {
  levelsHandler: LevelHandler;
  categoriesHandler: CategoryHandler;
  topicHandler: TopicHandler;
};
