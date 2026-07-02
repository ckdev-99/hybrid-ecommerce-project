<?php

namespace App\Modules\Categories\Services;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    /**
     * Get all categories with optional parent filtering.
     *
     * @param  bool  $includeChildren
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories(bool $includeChildren = true): \Illuminate\Database\Eloquent\Collection
    {
        $query = Category::query();

        if ($includeChildren) {
            $query->with(['children' => function ($query) {
                $query->orderBy('sort_order');
            }]);
        }

        return $query->orderBy('sort_order')->get();
    }

    /**
     * Get only parent categories (no parent_id).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getParentCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Get featured categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return Category::where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Get category by ID with relationships.
     *
     * @param  int  $id
     * @return Category
     */
    public function getCategoryById(int $id): Category
    {
        return Category::with(['parent', 'children'])->findOrFail($id);
    }

    /**
     * Create a new category.
     *
     * @param  array  $data
     * @return Category
     */
    public function createCategory(array $data): Category
    {
        // Auto-generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return Category::create($data);
    }

    /**
     * Update category.
     *
     * @param  Category  $category
     * @param  array  $data
     * @return Category
     */
    public function updateCategory(Category $category, array $data): Category
    {
        // Auto-generate slug if name changed and slug not provided
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);
        return $category->fresh(['parent', 'children']);
    }

    /**
     * Delete category (soft delete).
     *
     * @param  Category  $category
     * @return bool
     */
    public function deleteCategory(Category $category): bool
    {
        // Check if category has children
        if ($category->children()->count() > 0) {
            return false; // Don't delete if has subcategories
        }

        return $category->delete();
    }

    /**
     * Reorder categories.
     *
     * @param  array  $orders  [['id' => 1, 'sort_order' => 0], ...]
     * @return void
     */
    public function reorderCategories(array $orders): void
    {
        foreach ($orders as $order) {
            Category::where('id', $order['id'])->update([
                'sort_order' => $order['sort_order']
            ]);
        }
    }

    /**
     * Get category tree (nested hierarchy).
     *
     * @return \Illuminate\Support\Collection
     */
    public function getCategoryTree(): \Illuminate\Support\Collection
    {
        return Category::whereNull('parent_id')
            ->with('children.children')
            ->orderBy('sort_order')
            ->get();
    }
}
