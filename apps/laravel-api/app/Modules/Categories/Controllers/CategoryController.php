<?php

namespace App\Modules\Categories\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Modules\Categories\Requests\CreateCategoryRequest;
use App\Modules\Categories\Requests\UpdateCategoryRequest;
use App\Modules\Categories\Resources\CategoryResource;
use App\Modules\Categories\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    /**
     * Display a listing of categories.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $includeChildren = $request->boolean('include_children', true);
        $categories = $this->categoryService->getAllCategories($includeChildren);

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => CategoryResource::collection($categories),
            ],
        ]);
    }

    /**
     * Display parent categories only.
     *
     * @return JsonResponse
     */
    public function parents(): JsonResponse
    {
        $categories = $this->categoryService->getParentCategories();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => CategoryResource::collection($categories),
            ],
        ]);
    }

    /**
     * Display featured categories.
     *
     * @return JsonResponse
     */
    public function featured(): JsonResponse
    {
        $categories = $this->categoryService->getFeaturedCategories();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => CategoryResource::collection($categories),
            ],
        ]);
    }

    /**
     * Display category tree (nested hierarchy).
     *
     * @return JsonResponse
     */
    public function tree(): JsonResponse
    {
        $categories = $this->categoryService->getCategoryTree();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => CategoryResource::collection($categories),
            ],
        ]);
    }

    /**
     * Store a newly created category.
     *
     * @param  CreateCategoryRequest  $request
     * @return JsonResponse
     */
    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => [
                'category' => CategoryResource::make($category->load('parent')),
            ],
        ], 201);
    }

    /**
     * Display the specified category.
     *
     * @param  Category  $category
     * @return JsonResponse
     */
    public function show(Category $category): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($category->id);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => CategoryResource::make($category),
            ],
        ]);
    }

    /**
     * Update the specified category.
     *
     * @param  UpdateCategoryRequest  $request
     * @param  Category  $category
     * @return JsonResponse
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category = $this->categoryService->updateCategory($category, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => [
                'category' => CategoryResource::make($category),
            ],
        ]);
    }

    /**
     * Remove the specified category.
     *
     * @param  Category  $category
     * @return JsonResponse
     */
    public function destroy(Category $category): JsonResponse
    {
        $deleted = $this->categoryService->deleteCategory($category);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with subcategories',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    /**
     * Reorder categories.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|integer|exists:categories,id',
            'categories.*.sort_order' => 'required|integer|min:0',
        ]);

        $this->categoryService->reorderCategories($request->categories);

        return response()->json([
            'success' => true,
            'message' => 'Categories reordered successfully',
        ]);
    }
}
