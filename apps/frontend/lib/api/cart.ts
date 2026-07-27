import api from './client';
import { Cart, CartItem } from '@/types/cart';

export const cartApi = {
  /**
   * Get current user's cart
   */
  getCart: () =>
    api.get<{ success: boolean; data: { cart: Cart } }>('/cart'),

  /**
   * Add item to cart
   */
  addItem: (productId: number, quantity: number = 1) =>
    api.post<{ success: boolean; data: { cart: Cart; item: CartItem } }>('/cart/items', {
      product_id: productId,
      quantity,
    }),

  /**
   * Update cart item quantity
   */
  updateItem: (itemId: number, quantity: number) =>
    api.put<{ success: boolean; data: { cart: Cart; item: CartItem } }>(
      `/cart/items/${itemId}`,
      { quantity }
    ),

  /**
   * Remove item from cart
   */
  removeItem: (itemId: number) =>
    api.delete<{ success: boolean; data: { cart: Cart } }>(`/cart/items/${itemId}`),

  /**
   * Clear entire cart
   */
  clearCart: () =>
    api.delete<{ success: boolean; data: { cart: Cart } }>('/cart'),
};

// Re-export types
export type { Cart, CartItem } from '@/types/cart';
