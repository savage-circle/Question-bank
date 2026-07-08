import apiClient from './apiClient';
import { Question } from '../types/question';

export function getQuestionsByCategory(categoryId: number) {
  return apiClient.get<Question[]>(`/questions?categoryId=${categoryId}`).then((response) => response.data);
}