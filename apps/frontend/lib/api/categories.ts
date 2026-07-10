import { api } from './client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  position: number;
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category;
  products_count?: number;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  position?: number;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
}

export interface CategoryTreeResponse {
  data: Category[];
}

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (params?: {
    search?: string;
    parent_id?: number;
    is_active?: boolean;
  }) => {
    const response = await api.get<{ data: Category[] }>('/categories', { params });
    return response.data;
  },

  /**
   * Get parent categories only
   */
  getParents: async () => {
    const response = await api.get<{ data: Category[] }>('/categories/parents');
    return response.data;
  },

  /**
   * Get featured categories
   */
  getFeatured: async () => {
    const response = await api.get<{ data: Category[] }>('/categories/featured');
    return response.data;
  },

  /**
   * Get category tree structure
   */
  getTree: async () => {
    const response = await api.get<CategoryTreeResponse>('/categories/tree');
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: number) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category (Admin only)
   */
  create: async (data: CategoryFormData) => {
    const response = await api.post<Category>('/admin/store/categories', data);
    return response.data;
  },

  /**
   * Update a category (Admin only)
   */
  update: async (id: number, data: Partial<CategoryFormData>) => {
    const response = await api.put<Category>(`/admin/update/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category (Admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/admin/delete/categories/${id}`);
    return response.data;
  },

  /**
   * Reorder categories (Admin only)
   */
  reorder: async (categories: Array<{ id: number; position: number }>) => {
    const response = await api.post('/admin/categories/reorder', { categories });
    return response.data;
  },

  /**
   * Get category count for dashboard stats
   */
  getCount: async () => {
    const response = await api.get<{ count: number }>('/categories/stats');
    return response.data.count;
  },
};
