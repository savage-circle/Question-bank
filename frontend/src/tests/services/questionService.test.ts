import { describe, it, expect, vi, afterEach } from 'vitest';
import apiClient from '../../services/apiClient';
import { getQuestionsByCategory } from '../../services/questionService';
import { Question } from "../../types";

vi.mock('../../services/apiClient');

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
});
