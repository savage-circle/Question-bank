import { describe, it, expect, vi, afterEach } from 'vitest';
import apiClient from '../../services/apiClient';
import { get } from '../../services/apiService';

vi.mock('../../services/apiClient');

describe('get', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves with the data from the API response for any GET call', async () => {
    const data = { foo: 'bar' };
    vi.mocked(apiClient.get).mockResolvedValue({ data });

    const result = await get<typeof data>('/some-endpoint');

    expect(apiClient.get).toHaveBeenCalledWith('/some-endpoint');
    expect(result).toEqual(data);
  });

  it('propagates errors from the API client', async () => {
    const error = new Error('network error');
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(get('/some-endpoint')).rejects.toThrow('network error');
  });
});
