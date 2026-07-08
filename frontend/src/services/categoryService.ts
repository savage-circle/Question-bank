import apiClient from './apiClient';
import { Category } from '../types/category';

export function getCategories() {
  return apiClient.get<Category[]>('/categories').then((response) => response.data);
}
