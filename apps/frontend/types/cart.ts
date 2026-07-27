export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    sku: string;
    description?: string;
    image?: string;
  };
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  items_count: number;
}
