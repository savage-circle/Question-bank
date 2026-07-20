export type Category = {
  id: number;
  name: string;
};

export type Question = {
  id: number;
  description: string;
  topicName: string;
  levelName: string;
  extensions: string | null;
};
