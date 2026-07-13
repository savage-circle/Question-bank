import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchCategories from '../../hooks/fetchCategories';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/category';

vi.mock('../../services/categoryService');

describe('fetchCategories', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with an empty list of categories', () => {
    vi.mocked(getCategories).mockResolvedValue([]);

    const { result } = renderHook(() => useFetchCategories());

    expect(result.current).toEqual([]);
  });

  it('updates state with categories once the fetch resolves', async () => {
    const categories: Category[] = [{ id: 1, name: 'Algorithms' }];
    vi.mocked(getCategories).mockResolvedValue(categories);

    const { result } = renderHook(() => useFetchCategories());

    await waitFor(() => expect(result.current).toEqual(categories));
  });

  it('logs an error and keeps categories empty when the fetch fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('network error');
    vi.mocked(getCategories).mockRejectedValue(error);

    const { result } = renderHook(() => useFetchCategories());

    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch categories',
        error,
      ),
    );
    expect(result.current).toEqual([]);
  });
});
