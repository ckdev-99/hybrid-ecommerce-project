/**
 * API Module Index
 *
 * Central export point for all API modules
 */

export { api } from './client';
export { authApi } from './auth';
export { productsApi } from './products';
export { categoriesApi } from './categories';
export { usersApi } from './users';

// Type exports
export type { Product, ProductFormData, ProductListResponse } from './products';
export type { Category, CategoryFormData, CategoryTreeResponse } from './categories';
export type { User, UserFormData, UserListResponse, Role } from './users';
