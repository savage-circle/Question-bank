import { get } from './apiService';
import { Question } from '../types/question';

export function getQuestionsByCategory(categoryId: number) {
  return get<Question[]>(`/questions?categoryId=${categoryId}`);
}