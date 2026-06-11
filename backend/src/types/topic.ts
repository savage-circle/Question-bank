export type Topic = {
  id: number;
  name: string;
  categoryId: number;
}

export type CreateTopicDTO = {
  name: string;
  categoryId: number;
}