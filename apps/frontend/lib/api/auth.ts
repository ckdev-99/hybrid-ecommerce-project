import { api } from './client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles?: Array<{ id: number; name: string; slug: string; level: number }>;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

interface MeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  /**
   * Login user (matches Laravel login())
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { user, token } = response.data.data;

    // Update Zustand store (if store is available)
    if (typeof window !== 'undefined') {
      const { useAuthStore } = await import('../store');
      useAuthStore.getState().setAuth(user, token);
    }

    return { user, token };
  },

  /**
   * Register new user (matches Laravel register())
   * POST /api/auth/register
   */
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    const { user, token } = response.data.data;

    // Update Zustand store (if store is available)
    if (typeof window !== 'undefined') {
      const { useAuthStore } = await import('../store');
      useAuthStore.getState().setAuth(user, token);
    }

    return { user, token };
  },

  /**
   * Logout user (matches Laravel logout())
   * POST /api/auth/logout
   */
  logout: async () => {
    try {
      await api.post<LogoutResponse>('/auth/logout');
    } finally {
      // Update Zustand store (if store is available)
      if (typeof window !== 'undefined') {
        const { useAuthStore } = await import('../store');
        useAuthStore.getState().logout();
      }
    }
  },

  /**
   * Get authenticated user (matches Laravel me())
   * GET /api/auth/me
   */
  me: async () => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data.data.user;
  },
};
