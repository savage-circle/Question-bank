import { FollowUpSummary } from "./followUp.ts";

export type Question = {
  id: number;
  description: string;
  topicId: number;
  levelId: number;
  topic: {
    id: number;
    name: string;
    categoryId: number;
  };
  followUps: FollowUpSummary[];
};

export type QuestionResponse = {
  id: number;
  description: string;
  topicName: string;
  levelName: string;
  followUps: FollowUpSummary[];
};

export type CreateQuestionDTO = {
  description: string;
  topicId: number;
  levelId: number;
}