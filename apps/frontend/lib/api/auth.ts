import { api } from './client';
import { useAuthStore } from '../store';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  // login: async (credentials: LoginCredentials) => {
  //   const response = await api.post('/auth/login', credentials);
    
  //   // Access the nested data structure
  //   const { user, token } = response.data.data;
    
  //   // Update Zustand store
  //   useAuthStore.getState().setAuth(user, token);
    
  //   return { user, token };
  // },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    const { user, token } = response.data.data;

    // Update Zustand store
    useAuthStore.getState().setAuth(user, token);

    return { user, token };
  },


  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      useAuthStore.getState().logout();
    }
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },
};
