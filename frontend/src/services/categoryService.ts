import apiClient from './apiClient';
import { Category } from '../types/category';

export async function getCategories() {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}
