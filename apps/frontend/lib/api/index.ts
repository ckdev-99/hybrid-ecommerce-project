/**
 * API Module Index
 *
 * Central export point for all API modules
 * All APIs now match Laravel backend naming conventions
 */

export { api } from './client';
export { authApi } from './auth';
export { productsApi } from './products';
export { categoriesApi } from './categories';
export { usersApi } from './users';

// Type exports
export type { Product, ProductFormData, ProductsData, ProductData } from './products';
export type { Category, CategoryFormData, CategoriesData, CategoryData } from './categories';
export type { User, UserFormData, UsersData, UserData } from './users';
// Shared type - exported once from common types
export type { LaravelResponse } from './types';
