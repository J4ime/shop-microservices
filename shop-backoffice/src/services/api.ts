import axios from 'axios';

const authAxios = axios.create({ baseURL: 'https://localhost:6001/api' });
const api = axios.create({ baseURL: 'https://localhost:5001/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (email: string, password: string) => authAxios.post('/auth/login', { email, password }),
  validate: (token: string) => authAxios.get('/auth/validate', { headers: { Authorization: `Bearer ${token}` } }),
};

export const productsApi = {
  getAll: (params?: object) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: object) => api.post('/products', data),
  update: (id: string, data: object) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  getLowStock: (threshold?: number) => api.get('/products/low-stock', { params: { threshold } }),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: object) => api.post('/categories', data),
  update: (id: string, data: object) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const customersApi = {
  getAll: (params?: object) => api.get('/customers', { params }),
};

export const ordersApi = {
  getAll: (params?: object) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: object) => api.patch(`/orders/${id}/status`, data),
  cancel: (id: string) => api.post(`/orders/${id}/cancel`),
};

export default api;
