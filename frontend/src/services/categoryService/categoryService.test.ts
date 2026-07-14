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
});
