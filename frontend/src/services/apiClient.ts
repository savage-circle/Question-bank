import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.API_BASE_URL ?? '/api',
});

export default apiClient;
