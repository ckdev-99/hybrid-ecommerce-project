import { api } from './client';

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
}

export interface UserListResponse {
  data: User[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const usersApi = {
  /**
   * Get all users (Admin only)
   */
  getAll: async (params?: {
    search?: string;
    role?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get<UserListResponse>('/users', { params });
    return response.data;
  },

  /**
   * Get a single user by ID (Admin only)
   */
  getById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user (SuperAdmin only)
   */
  create: async (data: UserFormData) => {
    const response = await api.post<User>('/admin/users', data);
    return response.data;
  },

  /**
   * Update a user (Admin only)
   */
  update: async (id: number, data: Partial<UserFormData>) => {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user (SuperAdmin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update user roles (SuperAdmin only)
   */
  updateRoles: async (id: number, roleIds: number[]) => {
    const response = await api.put<User>(`/admin/users/${id}/roles`, { roles: roleIds });
    return response.data;
  },

  /**
   * Toggle user active status (Admin only)
   */
  toggleActive: async (id: number, isActive: boolean) => {
    const response = await api.put<User>(`/admin/users/${id}/status`, { is_active: isActive });
    return response.data;
  },

  /**
   * Get user count for dashboard stats
   */
  getCount: async () => {
    const response = await api.get<{ count: number }>('/users/stats');
    return response.data.count;
  },
};
