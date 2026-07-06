import { describe, it, expect, vi, afterEach } from 'vitest';
import * as apiService from '../../services/apiService';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/category';

vi.mock('../../services/apiService');

describe('getCategories', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches categories from the /categories endpoint', async () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    vi.mocked(apiService.get).mockResolvedValue(categories);

    const result = await getCategories();

    expect(apiService.get).toHaveBeenCalledWith('/categories');
    expect(result).toEqual(categories);
  });
});
