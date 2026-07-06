import { get } from './apiService';
import { Category } from '../types/category';

export function getCategories() {
  return get<Category[]>('/categories');
}
