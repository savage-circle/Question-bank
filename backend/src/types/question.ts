export type Question = {
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

export type CreateQuestionDTO = {
  description: string;
  topicId: number;
  levelId: number;
  extensions: string[] | null;
}