import apiClient from './apiClient';
import { Question } from "../types";

export async function getQuestionsByCategory(categoryId: number) {
  const response = await apiClient.get<Question[]>(
    `/questions?categoryId=${categoryId}`,
  );
  return response.data;
}
