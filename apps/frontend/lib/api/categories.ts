import { api } from './client';
import type { LaravelResponse } from './types';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  sort_order: number;
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
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
}

export interface CategoriesData {
  categories: Category[];
}

export interface CategoryData {
  category: Category;
}

export const categoriesApi = {
  /**
   * Get all categories (matches Laravel index())
   * GET /api/categories
   */
  index: async (params?: {
    include_children?: boolean;
    search?: string;
    parent_id?: number;
    is_active?: boolean;
  }) => {
    const response = await api.get<LaravelResponse<CategoriesData>>('/categories', { params });
    return response.data.data.categories;
  },

  /**
   * Get parent categories only (matches Laravel parents())
   * GET /api/categories/parents
   */
  parents: async () => {
    const response = await api.get<LaravelResponse<CategoriesData>>('/categories/parents');
    return response.data.data.categories;
  },

  /**
   * Get featured categories (matches Laravel featured())
   * GET /api/categories/featured
   */
  featured: async () => {
    const response = await api.get<LaravelResponse<CategoriesData>>('/categories/featured');
    return response.data.data.categories;
  },

  /**
   * Get category tree (matches Laravel tree())
   * GET /api/categories/tree
   */
  tree: async () => {
    const response = await api.get<LaravelResponse<CategoriesData>>('/categories/tree');
    return response.data.data.categories;
  },

  /**
   * Get a single category (matches Laravel show())
   * GET /api/categories/{id}
   */
  show: async (id: number) => {
    const response = await api.get<LaravelResponse<CategoryData>>(`/categories/${id}`);
    return response.data.data.category;
  },

  /**
   * Create a new category (matches Laravel store())
   * POST /api/admin/store/categories
   */
  create: async (data: CategoryFormData) => {
    const response = await api.post<LaravelResponse<CategoryData>>('/admin/store/categories', data);
    return response.data.data.category;
  },

  /**
   * Store a new category (alias for create, matches Laravel store())
   * POST /api/admin/store/categories
   */
  store: async (data: CategoryFormData) => {
    return categoriesApi.create(data);
  },

  /**
   * Update a category (matches Laravel update())
   * PUT /api/admin/update/categories/{id}
   */
  update: async (id: number, data: Partial<CategoryFormData>) => {
    const response = await api.put<LaravelResponse<CategoryData>>(`/admin/update/categories/${id}`, data);
    return response.data.data.category;
  },

  /**
   * Delete a category (matches Laravel destroy())
   * DELETE /api/admin/delete/categories/{id}
   */
  delete: async (id: number) => {
    const response = await api.delete<LaravelResponse<void>>(`/admin/delete/categories/${id}`);
    return response.data;
  },

  /**
   * Destroy a category (alias for delete, matches Laravel destroy())   
   * DELETE /api/admin/delete/categories/{id}
   */
  destroy: async (id: number) => {
    return categoriesApi.delete(id);
  },

  /**
   * Reorder categories (matches Laravel reorder())
   * POST /api/admin/categories/reorder
   */
  reorder: async (categories: Array<{ id: number; sort_order: number }>) => {
    const response = await api.post<LaravelResponse<void>>('/admin/categories/reorder', { categories });
    return response.data;
  },
};
