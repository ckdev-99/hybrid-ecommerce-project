import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';
import { cartApi } from '@/lib/api/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.getCart();
          set({ cart: response.data.data.cart, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch cart',
            isLoading: false
          });
        }
      },

      addItem: async (productId, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.addItem(productId, quantity);
          set({ cart: response.data.data.cart, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to add item to cart',
            isLoading: false
          });
          throw error;
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.updateItem(itemId, quantity);
          set({ cart: response.data.data.cart, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to update quantity',
            isLoading: false
          });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.removeItem(itemId);
          set({ cart: response.data.data.cart, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to remove item',
            isLoading: false
          });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.clearCart();
          set({ cart: response.data.data.cart, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to clear cart',
            isLoading: false
          });
        }
      },

      setError: (error) => set({ error }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart
    }
  )
);
