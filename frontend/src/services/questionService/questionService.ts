import apiClient from '../apiClient/apiClient';
import { Question } from "../../types";

export async function getQuestionsByCategory(categoryId: number) {
  try {
    const response = await apiClient.get<Question[]>(
      `/questions?categoryId=${categoryId}`,
    );
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const wrappedError: any = new Error(`Failed to fetch questions (status: ${status ?? 'unknown'}): ${error?.message}`);
    wrappedError.status = status ?? 'unknown';
    throw wrappedError;
  }
}
