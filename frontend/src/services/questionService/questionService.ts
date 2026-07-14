import apiClient from '../apiClient/apiClient';
import { Question } from '../../types';

export async function getQuestionsByCategory(categoryId: number) {
  try {
    const response = await apiClient.get<Question[]>(
      `/questions?categoryId=${categoryId}`,
    );
    return response.data;
  } catch (error) {
    const { response, message } = error as {
      response?: { status?: number };
      message?: string;
    };
    const status = response?.status ?? 'unknown';
    const wrappedError = new Error(
      `Failed to fetch questions (status: ${status}): ${message}`,
    ) as Error & { status: number | string };
    wrappedError.status = status;
    throw wrappedError;
  }
}
