<?php

namespace App\Modules\Products\Services;

use App\Models\Product;
use Illuminate\Support\Str;

class ProductService
{
    /**
     * Get all products with optional filters.
     *
     * @param  array  $filters
     * @param  int  $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllProducts(array $filters = [], int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Product::with(['category', 'images', 'primaryImage']);

        // Apply filters
        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['is_featured'])) {
            $query->where('is_featured', $filters['is_featured']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['in_stock'])) {
            if ($filters['in_stock']) {
                $query->where(function ($q) {
                    $q->where('track_stock', false)
                        ->orWhere('stock_qty', '>', 0)
                        ->orWhere('allow_backorders', true);
                });
            } else {
                $query->where('track_stock', true)
                    ->where('stock_qty', '<=', 0)
                    ->where('allow_backorders', false);
            }
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    /**
     * Get product by ID.
     *
     * @param  int  $id
     * @return Product
     */
    public function getProductById(int $id): Product
    {
        return Product::with(['category', 'images', 'primaryImage'])->findOrFail($id);
    }

    /**
     * Get featured products.
     *
     * @param  int  $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedProducts(int $limit = 12): \Illuminate\Database\Eloquent\Collection
    {
        return Product::with(['category', 'primaryImage'])
            ->where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();
    }

    /**
     * Create a new product.
     *
     * @param  array  $data
     * @return Product
     */
    public function createProduct(array $data): Product
    {
        // Auto-generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return Product::create($data);
    }

    /**
     * Update product.
     *
     * @param  Product  $product
     * @param  array  $data
     * @return Product
     */
    public function updateProduct(Product $product, array $data): Product
    {
        // Auto-generate slug if name changed and slug not provided
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $product->update($data);
        return $product->fresh(['category', 'images', 'primaryImage']);
    }

    /**
     * Delete product (soft delete).
     *
     * @param  Product  $product
     * @return bool
     */
    public function deleteProduct(Product $product): bool
    {
        return $product->delete();
    }

    /**
     * Update product stock.
     *
     * @param  Product  $product
     * @param  int  $quantity
     * @return Product
     */
    public function updateStock(Product $product, int $quantity): Product
    {
        $product->update(['stock_qty' => $quantity]);
        return $product->fresh();
    }

    /**
     * Adjust product stock (add/subtract).
     *
     * @param  Product  $product
     * @param  int  $adjustment
     * @return Product
     */
    public function adjustStock(Product $product, int $adjustment): Product
    {
        $product->increment('stock_qty', $adjustment);
        return $product->fresh();
    }
}
