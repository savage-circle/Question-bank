export type FollowUpSummary = {
  id: number;
  levelId: number;
  description: string;
  questionString: string;
};

export type CreateFollowUpDTO = {
  levelId: number;
  description: string;
  questionString: string;
};
