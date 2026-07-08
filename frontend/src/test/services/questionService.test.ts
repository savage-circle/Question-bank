import { describe, it, expect, vi, afterEach } from 'vitest';
import * as apiService from '../../services/apiService';
import { getQuestionsByCategory } from '../../services/questionService';
import { Question } from '../../types/question';

vi.mock('../../services/apiService');

describe('getQuestionsByCategory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches questions from the /questions endpoint for the given category', async () => {
    const questions: Question[] = [
      { id: 1, description: 'Reverse a linked list', topicName: 'Linked List', levelName: 'Easy', extensions: null },
    ];
    vi.mocked(apiService.get).mockResolvedValue(questions);

    const result = await getQuestionsByCategory(1);

    expect(apiService.get).toHaveBeenCalledWith('/questions?categoryId=1');
    expect(result).toEqual(questions);
  });
});
