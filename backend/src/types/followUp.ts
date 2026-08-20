export type FollowUpSummary = {
  id: number;
  levelId: number;
  description: string;
  question: string;
};

export type CreateFollowUpDTO = {
  levelId: number;
  description: string;
  question: string;
};
