import axios, { type AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

// Track if we're already redirecting to prevent loops
let isRedirecting = false;

/**
 * Clear auth state (used when token expires)
 */
export const clearAuthState = () => {
  if (typeof window !== 'undefined' && !isRedirecting) {
    isRedirecting = true;
    // Clear localStorage
    localStorage.removeItem('auth-storage');
    // Clear cookies
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('user-info', { path: '/' });
    // Redirect to login
    window.location.href = '/login';
  }
};

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for guest cart sessions
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
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.error('[API] Token expired or invalid - clearing session');
      clearAuthState();
    }
    return Promise.reject(error);
  }
);

// Helper for multipart/form-data uploads
export const uploadApi = (url: string, data: FormData, config: AxiosRequestConfig = {}) => {
  return api.post(url, data, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers,
    },
  });
};

// Helper for PUT multipart requests - uses POST with _method spoofing for PHP compatibility
export const uploadApiPut = (url: string, data: FormData, config: AxiosRequestConfig = {}) => {
  // Add _method field for method spoofing (PHP doesn't handle PUT with file uploads well)
  data.append('_method', 'PUT');

  return api.post(url, data, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers,
    },
  });
};

export default api;
