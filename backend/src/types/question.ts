export type QuestionFilters = {
  categoryId?: number;
  topicId?: number;
  levelId?: number;
};

export type QuestionWithTopic = {
  id: number;
  description: string;
  topicId: number;
  levelId: number;
  extensions: string | null;
  topic: {
    id: number;
    name: string;
    categoryId: number;
  };
};

export type QuestionResponse = {
  id: number;
  description: string;
  topicName: string;
  levelName: string;
  extensions: string[];
};

export type QuestionRequest = {
  description: string;
  topicId: number;
  levelId: number;
  extensions: string[] | null;
};

export type UpdateQuestionResponse = {
  id: number;
  description: string;
  topicId: number;
  levelId: number;
  extensions: string | null;
};
