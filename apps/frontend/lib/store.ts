import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface Role {
  id: number;
  name: string;
  slug: string;
  level: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (roleName: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
        // Also set a simple cookie for proxy to check
        Cookies.set('auth-token', token || '', {
          expires: 7,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        // Store user info for middleware role checks
        Cookies.set('user-info', JSON.stringify(user), {
          expires: 7,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      },
      logout: () => {
        set({ user: null, token: null });
        // Remove the cookies
        Cookies.remove('auth-token', { path: '/' });
        Cookies.remove('user-info', { path: '/' });
      },
      isAuthenticated: () => !!get().token,
      hasRole: (roleName) => {
        const user = get().user;
        return user?.roles?.some(role => role.name === roleName) ?? false;
      },
    }),
    {
      name: 'auth-storage',
      // Use default localStorage
    }
  )
);

