export type Category = {
  id: number;
  name: string;
};

export type CreateCategoryDTO = {
  name: string;
};

export type CategoryUpdateResponse = {
  id: number;
  name: string;
};