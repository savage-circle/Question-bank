import { describe, it, expect, vi, afterEach } from 'vitest';
import apiClient from '../apiClient/apiClient';
import { getCategories } from './categoryService';
import { Category } from "../../types";

vi.mock('../apiClient/apiClient');

describe('getCategories', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches categories from the /categories endpoint', async () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    vi.mocked(apiClient.get).mockResolvedValue({ data: categories });

    const result = await getCategories();

    expect(apiClient.get).toHaveBeenCalledWith('/categories');
    expect(result).toEqual(categories);
  });

  it('wraps the error with the response status when the request fails', async () => {
    const error = { message: 'Request failed', response: { status: 500 } };
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(getCategories()).rejects.toThrow(
      'Failed to fetch categories (status: 500): Request failed',
    );
    await expect(getCategories()).rejects.toMatchObject({ status: 500 });
  });

  it('wraps the error as an unknown status when there is no response', async () => {
    const error = { message: 'Network Error' };
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(getCategories()).rejects.toThrow(
      'Failed to fetch categories (status: unknown): Network Error',
    );
    await expect(getCategories()).rejects.toMatchObject({ status: 'unknown' });
  });
});
