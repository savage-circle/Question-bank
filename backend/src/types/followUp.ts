export type FollowUp = {
  id: number;
  questionId: number;
  levelId: number;
  description: string;
  questionString: string;
  question: {
    id: number;
    description: string;
    topicId: number;
    levelId: number;
  };
};

export type FollowUpSummary = {
  id: number;
  levelId: number;
  description: string;
  questionString: string;
};

export type CreateFollowUpDTO = {
  questionId: number;
  levelId: number;
  description: string;
  questionString: string;
};
