import apiClient from './apiClient';

export function get<T>(url: string) {
  return apiClient.get<T>(url).then((response) => response.data);
}
