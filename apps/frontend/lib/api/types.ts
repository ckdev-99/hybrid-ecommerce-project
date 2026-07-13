/**
 * Shared API Types
 * Common types used across all API modules
 */

/**
 * Standard Laravel API response wrapper
 * Used for consistent API responses from Laravel backend
 */
export interface LaravelResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
