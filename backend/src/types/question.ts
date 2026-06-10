import type { QuestionGetPayload } from "../generated/prisma/models/Question.ts";

export type QuestionFilters = {
  categoryId?: number;
  topicId?: number;
  levelId?: number;
};

/** A question row joined with its parent topic, derived from the Prisma schema. */
export type QuestionWithTopic = QuestionGetPayload<{
  include: { topic: true };
}>;

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
