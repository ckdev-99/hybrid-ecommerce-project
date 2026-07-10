import { api } from './client';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku: string;
  barcode?: string;
  track_quantity: boolean;
  quantity: number;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  is_virtual: boolean;
  is_active: boolean;
  category_id?: number;
  brand_id?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
    slug: string;
  };
  images?: {
    id: number;
    url: string;
    alt?: string;
    position: number;
  }[];
}

export interface ProductFormData {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku: string;
  barcode?: string;
  track_quantity?: boolean;
  quantity?: number;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  is_virtual?: boolean;
  is_active?: boolean;
  category_id?: number;
  brand_id?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ProductListResponse {
  data: Product[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const productsApi = {
  /**
   * Get all products with optional filtering
   */
  getAll: async (params?: {
    category_id?: number;
    search?: string;
    sort?: string;
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get<ProductListResponse>('/products', { params });
    return response.data;
  },

  /**
   * Get featured products
   */
  getFeatured: async () => {
    const response = await api.get<Product[]>('/products/featured');
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product (Admin only)
   */
  create: async (data: ProductFormData) => {
    const response = await api.post<Product>('/admin/products', data);
    return response.data;
  },

  /**
   * Update a product (Admin only)
   */
  update: async (id: number, data: Partial<ProductFormData>) => {
    const response = await api.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product (Admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  /**
   * Update product stock (Admin only)
   */
  updateStock: async (id: number, quantity: number) => {
    const response = await api.put<Product>(`/admin/products/${id}/stock`, { quantity });
    return response.data;
  },

  /**
   * Get product count for dashboard stats
   */
  getCount: async () => {
    const response = await api.get<{ count: number }>('/products/stats');
    return response.data.count;
  },
};
