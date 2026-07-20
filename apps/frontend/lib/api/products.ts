import { api } from './client';
import type { LaravelResponse } from './types';
import type { Category } from './categories';

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
  is_featured?: boolean;
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
    is_primary: boolean;
  }[];
  primaryImage?: {
    id: number;
    url: string;
    alt?: string;
    position: number;
    is_primary: boolean;
  };
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
  is_featured?: boolean;
  category_id?: number;
  brand_id?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ProductsData {
  products: Product[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ProductData {
  product: Product;
}

export const productsApi = {
  /**
   * Get all products (matches Laravel index())
   * GET /api/products
   */
  getAll: async (params?: {
    category_id?: number;
    search?: string;
    is_active?: boolean;
    is_featured?: boolean;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) => {
    const response = await api.get<LaravelResponse<ProductsData>>('/products', { params });
    return response.data.data;
  },

  /**
   * Get all products (alias for getAll, matches Laravel index())
   * GET /api/products
   */
  index: async (params?: {
    category_id?: number;
    search?: string;
    is_active?: boolean;
    is_featured?: boolean;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) => {
    return productsApi.getAll(params);
  },

  /**
   * Get featured products (matches Laravel featured())
   * GET /api/products/featured
   */
  featured: async (params?: { limit?: number }) => {
    const response = await api.get<LaravelResponse<ProductsData>>('/products/featured', { params });
    return response.data.data.products;
  },

  /**
   * Get all categories list for product form
   * GET /api/categories (public endpoint, no auth required)
   */
  getCategoriesList: async () => {
    const response = await api.get<LaravelResponse<{ categories: Category[] }>>('/categories');
    return response.data.data.categories;
  },

  /**
   * Get a single product (matches Laravel show())
   * GET /api/products/{id}
   */
  show: async (id: number) => {
    const response = await api.get<LaravelResponse<ProductData>>(`/products/${id}`);
    return response.data.data.product;
  },

  /**
   * Get a single product (alias for show)
   * GET /api/products/{id}
   */
  getById: async (id: number) => {
    return productsApi.show(id);
  },

  /**
   * Create a new product (matches Laravel store())
   * POST /api/admin/products
   */
  create: async (data: ProductFormData) => {
    const response = await api.post<LaravelResponse<ProductData>>('/admin/products', data);
    return response.data.data.product;
  },

  /**
   * Store a new product (alias for create, matches Laravel store())
   * POST /api/admin/products
   */
  store: async (data: ProductFormData) => {
    return productsApi.create(data);
  },

  /**
   * Update a product (matches Laravel update())
   * PUT /api/admin/products/{id}
   */
  update: async (id: number, data: Partial<ProductFormData>) => {
    const response = await api.put<LaravelResponse<ProductData>>(`/admin/products/${id}`, data);
    return response.data.data.product;
  },

  /**
   * Delete a product (matches Laravel destroy())
   * DELETE /api/admin/products/{id}
   */
  delete: async (id: number) => {
    const response = await api.delete<LaravelResponse<void>>(`/admin/products/${id}`);
    return response.data;
  },

  /**
   * Destroy a product (alias for delete, matches Laravel destroy())
   * DELETE /api/admin/products/{id}
   */
  destroy: async (id: number) => {
    return productsApi.delete(id);
  },

  /**
   * Update product stock (matches Laravel updateStock())
   * PUT /api/admin/products/{id}/stock
   */
  updateStock: async (id: number, quantity: number) => {
    const response = await api.put<LaravelResponse<ProductData>>(`/admin/products/${id}/stock`, { quantity });
    return response.data.data.product;
  },
};
