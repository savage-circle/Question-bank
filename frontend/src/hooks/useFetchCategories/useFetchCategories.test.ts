import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchCategories from './useFetchCategories';
import { getCategories } from '../../services/categoryService/categoryService';
import { Category } from '../../types';

vi.mock('../../services/categoryService/categoryService');

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
      expect(consoleErrorSpy).toHaveBeenCalledWith(error.message, undefined),
    );
    expect(result.current).toEqual([]);
  });

  it('ignores a resolved fetch once the component has unmounted', async () => {
    const categories: Category[] = [{ id: 1, name: 'Algorithms' }];
    let resolveFetch: (categories: Category[]) => void;
    vi.mocked(getCategories).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const { result, unmount } = renderHook(() => useFetchCategories());
    unmount();
    resolveFetch!(categories);

    await expect(
      waitFor(() => expect(result.current).toEqual(categories)),
    ).rejects.toThrow();
  });

  it('ignores a rejected fetch once the component has unmounted', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    let rejectFetch: (error: Error) => void;
    vi.mocked(getCategories).mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectFetch = reject;
        }),
    );

    const { unmount } = renderHook(() => useFetchCategories());
    unmount();
    rejectFetch!(new Error('network error'));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
