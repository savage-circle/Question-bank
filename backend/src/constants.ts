export const Messages = {
  InvalidQuestionId: "Invalid question id.",
  InvalidFollowUpId: "Invalid follow-up id.",
  InvalidTopicId: "Invalid topic id.",

  QuestionNotFound: "Question does not exist.",
  TopicNotFound: "Topic does not exist.",
  FollowUpNotFound: "Follow-up does not exist.",
  CategoryNotFound: "Category does not exist.",

  CategoryAlreadyExists: "Category name already exists.",
  TopicAlreadyExists: "Topic already exists",

  QuestionUpdated: "Question updated successfully.",
  FollowUpUpdated: "Follow-up updated successfully.",
  FollowUpDeleted: "Follow-up deleted successfully.",
  TopicDeleted: "Topic deleted successfully.",

  FetchQuestionsFailed: "Failed to fetch questions",
  AddQuestionFailed: "Failed to add question",
  UpdateQuestionFailed: "Failed to update question",
  FetchFollowUpsFailed: "Failed to fetch follow-ups",
  AddFollowUpFailed: "Failed to add follow-up",
  UpdateFollowUpFailed: "Failed to update follow-up",
  DeleteFollowUpFailed: "Failed to delete follow-up",
  FetchTopicsFailed: "Failed to fetch topics",
  AddTopicFailed: "Failed to add topic",
  DeleteTopicFailed: "Failed to delete topic",
  CreateCategoryFailed: "Failed to create category",
  UpdateCategoryFailed: "Failed to update category",
} as const;
