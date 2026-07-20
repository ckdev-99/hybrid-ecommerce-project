import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests using a simpler approach
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      // Get auth storage from localStorage
      const authStorage = localStorage.getItem('auth-storage');

      if (authStorage) {
        const parsed = JSON.parse(authStorage);

        // Zustand persist stores data as: { state: { token, user }, version: 0 }
        let token = null;

        if (parsed?.state?.token) {
          token = parsed.state.token;
        } else if (parsed?.token) {
          token = parsed.token;
        }

        if (token && typeof token === 'string' && token.length > 0) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error adding auth token:', error);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error - please log in again');
      // Optional: redirect to login or clear invalid token
      if (typeof window !== 'undefined') {
        // You could redirect to login here if needed
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
