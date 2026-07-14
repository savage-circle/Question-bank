import apiClient from '../apiClient/apiClient';
import { Category } from '../../types';

export async function getCategories() {
  try {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  } catch (error) {
    const { response, message } = error as {
      response?: { status?: number };
      message?: string;
    };
    const status = response?.status ?? 'unknown';
    const wrappedError = new Error(
      `Failed to fetch categories (status: ${status}): ${message}`,
    ) as Error & { status: number | string };
    wrappedError.status = status;
    throw wrappedError;
  }
}
