import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Axios instance with default config
// Ready for backend integration in Phase 2
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (auth tokens will be added here in Phase 2)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling will be added in Phase 2
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
