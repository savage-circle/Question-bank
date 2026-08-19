import { CategoryHandler } from "../handlers/CategoryHandler.ts";
import { LevelHandler } from "../handlers/LevelHandler.ts";
import { TopicHandler } from "../handlers/TopicHandler.ts";
import { QuestionHandler } from "../handlers/QuestionHandler.ts";
import { FollowUpHandler } from "../handlers/FollowUpHandler.ts";

export type Handlers = {
  levelsHandler: LevelHandler;
  categoriesHandler: CategoryHandler;
  topicHandler: TopicHandler;
  questionHandler: QuestionHandler;
  followUpHandler: FollowUpHandler;
};
