import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight
} from 'lucide-react';

export default function CartPage() {
  // TODO: Implement cart functionality with Zustand store and backend API
  // For now, this is a placeholder showing the cart UI

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {/* Empty Cart State */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to get started!
        </p>
        <Button asChild>
          <Link href="/products">
            Browse Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Cart Items (when implemented) */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-muted-foreground">${item.product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div> */}
    </div>
  );
}
