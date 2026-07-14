import apiClient from '../apiClient/apiClient';
import { Category } from "../../types";

export async function getCategories() {
  try {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const wrappedError: any = new Error(`Failed to fetch categories (status: ${status ?? 'unknown'}): ${error?.message}`);
    wrappedError.status = status ?? 'unknown';
    throw wrappedError;
  }
}
