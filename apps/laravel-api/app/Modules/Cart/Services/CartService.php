<?php

namespace App\Modules\Cart\Services;

use App\Models\{Cart, CartItem, Product, User};

class CartService
{
    /**
     * Get or create cart for user or session.
     */
    public function getOrCreateCart(?User $user, ?string $sessionId): Cart
    {
        $cart = null;

        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } elseif ($sessionId) {
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user?->id,
                'session_id' => $sessionId,
            ]);
        }

        return $cart->load('items.product');
    }

    /**
     * Get cart by ID.
     */
    public function getCartById(int $id): Cart
    {
        return Cart::with('items.product')->findOrFail($id);
    }

    /**
     * Get user's cart.
     */
    public function getUserCart(User $user): ?Cart
    {
        return Cart::with('items.product')
            ->where('user_id', $user->id)
            ->first();
    }

    /**
     * Add item to cart.
     */
    public function addItem(Cart $cart, Product $product, int $quantity): CartItem
    {
        // Check if item already exists in cart
        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            // Update quantity
            return $this->updateItemQuantity($existingItem, $existingItem->quantity + $quantity);
        }

        // Create new cart item
        $item = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => $product->price,
            'total' => $product->price * $quantity,
        ]);

        // Recalculate cart totals
        $this->calculateTotals($cart);

        return $item->load('product');
    }

    /**
     * Update cart item quantity.
     */
    public function updateItemQuantity(CartItem $item, int $quantity): CartItem
    {
        $item->update([
            'quantity' => $quantity,
            'total' => $item->unit_price * $quantity,
        ]);

        // Recalculate cart totals
        $this->calculateTotals($item->cart);

        return $item->fresh('product');
    }

    /**
     * Remove item from cart.
     */
    public function removeItem(CartItem $item): bool
    {
        $cart = $item->cart;
        $result = $item->delete();

        // Recalculate cart totals
        $this->calculateTotals($cart);

        return $result;
    }

    /**
     * Clear all items from cart.
     */
    public function clearCart(Cart $cart): bool
    {
        $cart->items()->delete();
        $this->calculateTotals($cart);
        return true;
    }

    /**
     * Merge guest cart into user cart.
     */
    public function mergeGuestCart(Cart $guestCart, User $user): Cart
    {
        // Get or create user cart
        $userCart = $this->getOrCreateCart($user, null);

        foreach ($guestCart->items as $guestItem) {
            $existingItem = $userCart->items()
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existingItem) {
                // Update quantity
                $this->updateItemQuantity($existingItem, $existingItem->quantity + $guestItem->quantity);
            } else {
                // Add new item to user cart
                $userCart->items()->create([
                    'product_id' => $guestItem->product_id,
                    'quantity' => $guestItem->quantity,
                    'unit_price' => $guestItem->unit_price,
                    'total' => $guestItem->total,
                ]);
            }
        }

        // Delete guest cart
        $guestCart->delete();

        // Recalculate user cart totals
        $this->calculateTotals($userCart);

        return $userCart->fresh('items.product');
    }

    /**
     * Calculate and update cart totals.
     */
    public function calculateTotals(Cart $cart): Cart
    {
        $items = $cart->items()->get();

        $subtotal = $items->sum('total');
        $itemsCount = $items->sum('quantity');

        // Calculate tax (10% for example - adjust as needed)
        $tax = $subtotal * 0.10;
        $total = $subtotal + $tax;

        $cart->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'items_count' => $itemsCount,
        ]);

        return $cart->fresh();
    }

    /**
     * Delete cart.
     */
    public function deleteCart(Cart $cart): bool
    {
        return $cart->delete();
    }
}
