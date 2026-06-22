import api from './axios';

export const getHistory = (page = 1, limit = 10) =>
  api.get(`/history?page=${page}&limit=${limit}`);
