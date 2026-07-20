<?php

namespace App\Modules\Products\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Modules\Products\Requests\CreateProductRequest;
use App\Modules\Products\Requests\UpdateProductRequest;
use App\Modules\Products\Resources\ProductResource;
use App\Modules\Products\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * Display a listing of products.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'category_id' => $request->input('category_id'),
            'is_active' => $request->input('is_active'),
            'is_featured' => $request->input('is_featured'),
            'search' => $request->input('search'),
            'min_price' => $request->input('min_price'),
            'max_price' => $request->input('max_price'),
            'in_stock' => $request->input('in_stock'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $perPage = $request->input('per_page', 15);
        $products = $this->productService->getAllProducts($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'products' => ProductResource::collection($products),
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Display featured products.
     *
     * @return JsonResponse
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 12);
        $products = $this->productService->getFeaturedProducts($limit);

        return response()->json([
            'success' => true,
            'data' => [
                'products' => ProductResource::collection($products),
            ],
        ]);
    }

    /**
     * Store a newly created product.
     *
     * @param  CreateProductRequest  $request
     * @return JsonResponse
     */
    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => [
                'product' => ProductResource::make($product->load(['category', 'images', 'primaryImage'])),
            ],
        ], 201);
    }

    /**
     * Display the specified product.
     *
     * @param  Product  $product
     * @return JsonResponse
     */
    public function show(Product $product): JsonResponse
    {
        $product = $this->productService->getProductById($product->id);

        return response()->json([
            'success' => true,
            'data' => [
                'product' => ProductResource::make($product),
            ],
        ]);
    }

    /**
     * Update the specified product.
     *
     * @param  UpdateProductRequest  $request
     * @param  Product  $product
     * @return JsonResponse
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product = $this->productService->updateProduct($product, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => [
                'product' => ProductResource::make($product),
            ],
        ]);
    }

    /**
     * Remove the specified product.
     *
     * @param  Product  $product
     * @return JsonResponse
     */
    public function destroy(Product $product): JsonResponse
    {
        $this->productService->deleteProduct($product);

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Update product stock.
     *
     * @param  Request  $request
     * @param  Product  $product
     * @return JsonResponse
     */
    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $product = $this->productService->updateStock($product, $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Stock updated successfully',
            'data' => [
                'product' => ProductResource::make($product),
            ],
        ]);
    }

    public function getCategoriesList()
    {
        $all_categories = $this->productService->getAllCategories();

        return response()->json([
            'success' => true,
            'message' => 'Categories list fetched successfully.',
            'data' => $all_categories
        ]);
    }
}
