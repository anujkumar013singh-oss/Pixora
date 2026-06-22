import api from './axios';

export const convertImage = (data) => api.post('/conversion/convert', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const removeBg = (data) => api.post('/conversion/remove-bg', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
