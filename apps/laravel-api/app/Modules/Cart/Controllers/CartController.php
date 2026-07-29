<?php

namespace App\Modules\Cart\Controllers;

use App\Http\Controllers\Controller;
use App\Models\{CartItem, Product};
use App\Modules\Cart\Requests\{AddItemRequest, UpdateItemRequest};
use App\Modules\Cart\Resources\{CartItemResource, CartResource};

use App\Modules\Cart\Services\CartService;
use Illuminate\Http\{JsonResponse, Request};

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Authorize cart access (user or guest session).
     *
     * @param  Request  $request
     * @param  mixed  $cart
     * @return void
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    protected function authorizeCartAccess(Request $request, $cart): void
    {
        $user = $request->user();
        $sessionId = $request->cookie('cart_session_id');

        // If user is authenticated, check if cart belongs to user
        if ($user) {
            if ($cart->user_id !== $user->id) {
                abort(403, 'You do not have access to this cart.');
            }
        } else {
            // For guest, check session ID
            if ($cart->session_id !== $sessionId) {
                abort(403, 'You do not have access to this cart.');
            }
        }
    }

    /**
     * Get current user's cart.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart($request->user());

        return response()->json([
            'success' => true,
            'data' => [
                'cart' => CartResource::make($cart),
            ],
        ]);
    }

    /**
     * Add item to cart.
     *
     * @return JsonResponse
     */
    public function addItem(AddItemRequest $request): JsonResponse
    {
        $user = $request->user(); // Authenticated user
        $cart = $this->cartService->getOrCreateCart($user);

        $product = Product::findOrFail($request->product_id);
        $item = $this->cartService->addItem($cart, $product, $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
            'data' => [
                'cart' => CartResource::make($cart->fresh('items.product')),
                'item' => CartItemResource::make($item),
            ],
        ]);  
    }

    /**
     * Update cart item quantity.
     *
     * @return JsonResponse
     */
    public function updateItem(UpdateItemRequest $request, CartItem $item): JsonResponse
    {
        $this->authorizeCartAccess($request, $item->cart);

        $updatedItem = $this->cartService->updateItemQuantity($item, $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Item quantity updated successfully',
            'data' => [
                'cart' => CartResource::make($item->cart->fresh('items.product')),
                'item' => CartItemResource::make($updatedItem),
            ],
        ]);
    }

    /**
     * Remove item from cart.
     *
     * @return JsonResponse
     */
    public function removeItem(Request $request, CartItem $item): JsonResponse
    {
        $this->authorizeCartAccess($request, $item->cart);

        $this->cartService->removeItem($item);

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully',
            'data' => [
                'cart' => CartResource::make($item->cart->fresh('items.product')),
            ],
        ]);
    }

    /**
     * Clear cart.
     *
     * @return JsonResponse
     */
    public function clearCart(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart($request->user());

        $this->cartService->clearCart($cart);

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully',
            'data' => [
                'cart' => CartResource::make($cart->fresh('items.product')),
            ],
        ]);
    }
}
