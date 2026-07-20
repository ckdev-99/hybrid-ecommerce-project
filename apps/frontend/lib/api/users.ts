import { api } from './client';
import type { LaravelResponse } from './types';

export interface Role {
  id: number;
  name: string;
  slug: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  status?: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  profile?: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  is_active?: boolean;
  roles?: number[]; // role IDs
  status?: string;
}

export interface UsersData {
  users: User[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface UserData {
  user: User;
}

export const usersApi = {
  /**
   * Get all users (matches Laravel index())
   * GET /api/admin/users
   */
  getAll: async (params?: {
    search?: string;
    role?: string;
    is_active?: boolean;
    per_page?: number;
  }) => {
    const response = await api.get<LaravelResponse<UsersData>>('/admin/users', { params });
    return response.data.data;
  },

  /**
   * Get all users (alias for getAll, matches Laravel index())
   * GET /api/admin/users
   */
  index: async (params?: {
    search?: string;
    role?: string;
    is_active?: boolean;
    per_page?: number;
  }) => {
    return usersApi.getAll(params);
  },

  /**
   * Get a single user (matches Laravel show())
   * GET /api/admin/users/{id}
   */
  show: async (id: number) => {
    const response = await api.get<LaravelResponse<UserData>>(`/admin/users/${id}`);
    return response.data.data.user;
  },

  /**
   * Get a single user (alias for show)
   * GET /api/admin/users/{id}
   */
  getById: async (id: number) => {
    return usersApi.show(id);
  },

  /**
   * Update user status (matches Laravel updateStatus())
   * PUT /api/admin/users/{id}/status
   */
  updateStatus: async (id: number, status: 'active' | 'inactive' | 'banned') => {
    const response = await api.put<LaravelResponse<UserData>>(`/admin/users/${id}/status`, { status });
    return response.data.data.user;
  },

  /**
   * Toggle user active status (convenience method)
   * PUT /api/admin/users/{id}/status
   */
  toggleActive: async (id: number, isActive: boolean) => {
    return usersApi.updateStatus(id, isActive ? 'active' : 'inactive');
  },

  /**
   * Create a new user (matches Laravel store())
   * POST /api/admin/users
   */
  create: async (data: UserFormData) => {
    const response = await api.post<LaravelResponse<UserData>>('/admin/users', data);
    return response.data.data.user;
  },

  /**
   * Store a new user (alias for create, matches Laravel store())
   * POST /api/admin/users
   */
  store: async (data: UserFormData) => {
    return usersApi.create(data);
  },

  /**
   * Update a user (matches Laravel update())
   * PUT /api/admin/users/{id}
   */
  update: async (id: number, data: Partial<UserFormData>) => {
    const response = await api.put<LaravelResponse<UserData>>(`/admin/users/${id}`, data);
    return response.data.data.user;
  },

  /**
   * Delete a user (matches Laravel destroy())
   * DELETE /api/admin/users/{id}
   */
  delete: async (id: number) => {
    const response = await api.delete<LaravelResponse<void>>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Destroy a user (alias for delete, matches Laravel destroy())
   * DELETE /api/admin/users/{id}
   */
  destroy: async (id: number) => {
    return usersApi.delete(id);
  },

  /**
   * Update user roles (matches Laravel updateRoles())
   * PUT /api/admin/users/{id}/roles
   */
  updateRoles: async (id: number, roleIds: number[]) => {
    const response = await api.put<LaravelResponse<UserData>>(`/admin/users/${id}/roles`, { roles: roleIds });
    return response.data.data.user;
  },
};
