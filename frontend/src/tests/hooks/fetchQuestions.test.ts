import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchQuestions from '../../hooks/fetchQuestions';
import { getQuestionsByCategory } from '../../services/questionService';
import { Question } from "../../types";

vi.mock('../../services/questionService');

describe('fetchQuestions', () => {
  beforeEach(() => {
    vi.mocked(getQuestionsByCategory).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('starts with an empty list of questions', () => {
    const { result } = renderHook(() => useFetchQuestions(1));

    expect(result.current).toEqual([]);
  });

  it('does not fetch when categoryId is undefined', () => {
    renderHook(() => useFetchQuestions(undefined));

    expect(getQuestionsByCategory).not.toHaveBeenCalled();
  });

  it('fetches questions for the given category and updates state once resolved', async () => {
    const questions: Question[] = [
      {
        id: 1,
        description: 'Reverse a linked list',
        topicName: 'Linked List',
        levelName: 'EASY',
        extensions: null,
      },
    ];
    vi.mocked(getQuestionsByCategory).mockResolvedValue(questions);

    const { result } = renderHook(() => useFetchQuestions(1));

    expect(getQuestionsByCategory).toHaveBeenCalledWith(1);
    await waitFor(() => expect(result.current).toEqual(questions));
  });

  it('re-fetches when categoryId changes', async () => {
    const questionsForCategoryTwo: Question[] = [
      {
        id: 2,
        description: 'Balance a binary tree',
        topicName: 'Trees',
        levelName: 'MEDIUM',
        extensions: null,
      },
    ];
    vi.mocked(getQuestionsByCategory).mockResolvedValue([]);

    const { result, rerender } = renderHook(
      ({ categoryId }) => useFetchQuestions(categoryId),
      {
        initialProps: { categoryId: 1 },
      },
    );

    vi.mocked(getQuestionsByCategory).mockResolvedValue(
      questionsForCategoryTwo,
    );
    rerender({ categoryId: 2 });

    expect(getQuestionsByCategory).toHaveBeenCalledWith(2);
    await waitFor(() =>
      expect(result.current).toEqual(questionsForCategoryTwo),
    );
  });

  it('ignores a stale response that resolves after categoryId has changed', async () => {
    const questionsForCategoryOne: Question[] = [
      {
        id: 1,
        description: 'Reverse a linked list',
        topicName: 'Linked List',
        levelName: 'EASY',
        extensions: null,
      },
    ];
    const questionsForCategoryTwo: Question[] = [
      {
        id: 2,
        description: 'Balance a binary tree',
        topicName: 'Trees',
        levelName: 'MEDIUM',
        extensions: null,
      },
    ];

    let resolveCategoryOne: (questions: Question[]) => void;
    vi.mocked(getQuestionsByCategory).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCategoryOne = resolve;
        }),
    );

    const { result, rerender } = renderHook(
      ({ categoryId }) => useFetchQuestions(categoryId),
      {
        initialProps: { categoryId: 1 },
      },
    );

    vi.mocked(getQuestionsByCategory).mockResolvedValue(
      questionsForCategoryTwo,
    );
    rerender({ categoryId: 2 });

    await waitFor(() =>
      expect(result.current).toEqual(questionsForCategoryTwo),
    );

    resolveCategoryOne!(questionsForCategoryOne);

    await expect(
      waitFor(() => expect(result.current).toEqual(questionsForCategoryOne)),
    ).rejects.toThrow();
    expect(result.current).toEqual(questionsForCategoryTwo);
  });

  it('logs an error and keeps questions empty when the fetch fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('network error');
    vi.mocked(getQuestionsByCategory).mockRejectedValue(error);

    const { result } = renderHook(() => useFetchQuestions(1));

    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch questions',
        error,
      ),
    );
    expect(result.current).toEqual([]);
  });
});
