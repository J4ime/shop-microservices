import axios from 'axios';

const api = axios.create({ baseURL: 'https://localhost:5001/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    axios.post('https://localhost:6001/api/auth/login', { email, password }),
  register: (data: object) =>
    axios.post('https://localhost:6001/api/auth/register', data),
};

export const productsApi = {
  getAll: (params?: object) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (categoryId: string) =>
    api.get('/products', { params: { categoryId, pageSize: 100 } }),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
};

export const customersApi = {
  create: (data: object) => api.post('/customers', data),
};

export const ordersApi = {
  create: (data: object) => api.post('/orders', data),
  getByCustomer: (customerId: string) =>
    api.get(`/orders/customer/${customerId}`),
};

export default api;
