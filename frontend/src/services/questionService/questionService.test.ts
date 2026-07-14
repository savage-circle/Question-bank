import { describe, it, expect, vi, afterEach } from 'vitest';
import apiClient from '../apiClient/apiClient';
import { getQuestionsByCategory } from './questionService';
import { Question } from "../../types";

vi.mock('../apiClient/apiClient');

describe('getQuestionsByCategory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches questions from the /questions endpoint for the given category', async () => {
    const questions: Question[] = [
      {
        id: 1,
        description: 'Reverse a linked list',
        topicName: 'Linked List',
        levelName: 'EASY',
        extensions: null,
      },
    ];
    vi.mocked(apiClient.get).mockResolvedValue({ data: questions });

    const result = await getQuestionsByCategory(1);

    expect(apiClient.get).toHaveBeenCalledWith('/questions?categoryId=1');
    expect(result).toEqual(questions);
  });

  it('wraps the error with the response status when the request fails', async () => {
    const error = { message: 'Request failed', response: { status: 500 } };
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(getQuestionsByCategory(1)).rejects.toThrow(
      'Failed to fetch questions (status: 500): Request failed',
    );
    await expect(getQuestionsByCategory(1)).rejects.toMatchObject({ status: 500 });
  });

  it('wraps the error as an unknown status when there is no response', async () => {
    const error = { message: 'Network Error' };
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(getQuestionsByCategory(1)).rejects.toThrow(
      'Failed to fetch questions (status: unknown): Network Error',
    );
    await expect(getQuestionsByCategory(1)).rejects.toMatchObject({ status: 'unknown' });
  });
});
