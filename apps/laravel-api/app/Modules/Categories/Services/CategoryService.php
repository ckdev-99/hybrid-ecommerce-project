<?php

namespace App\Modules\Categories\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

class CategoryService
{
    /**
     * Get all categories with optional parent filtering.
     *
     * @param  bool  $includeChildren
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories(bool $includeChildren = true): Collection
    {
        $query = Category::query();

        if ($includeChildren) {
            $query->with(['parent', 'children' => function ($query) {
                $query->orderBy('sort_order');
            }]);
        } else {
            // Always load parent relationship to show parent name
            $query->with('parent');
        }

        return $query->orderBy('sort_order')->get();
    }

    /**
     * Get only parent categories (no parent_id).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getParentCategories(): Collection
    {
        return Category::whereNull('parent_id')
            ->with(['parent', 'children'])
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Get featured categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedCategories(): Collection
    {
        return Category::where('is_featured', true)
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->with('parent')
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
        // Always generate slug from category name - backend managed only
        $slug = Str::slug($data['name']);

        // Check if slug already exists
        $existingCategory = Category::where('slug', $slug)->first();
        if ($existingCategory) {
            // Append a unique suffix if duplicate exists
            $slug = $slug . '-' . time();
        }

        $data['slug'] = $slug;

        // Handle image uploads
        $image = $data['image'] ?? null;
        $icon = $data['icon'] ?? null;
        unset($data['image'], $data['icon']);

        $category = Category::create($data);

        // Store images
        if ($image) {
            $data['image'] = $this->handleCategoryImage($image, $category->id);
        }
        if ($icon) {
            $data['icon'] = $this->handleCategoryImage($icon, $category->id);
        }

        if (!empty($data['image']) || !empty($data['icon'])) {
            $category->update($data);
        }

        return $category->fresh(['parent', 'children']);
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
        // Always regenerate slug from category name if name changed - backend managed only
        if (isset($data['name'])) {
            $slug = Str::slug($data['name']);

            // Check if slug already exists (excluding current category)
            $existingCategory = Category::where('slug', $slug)
                ->where('id', '!=', $category->id)
                ->first();
            if ($existingCategory) {
                // Append a unique suffix if duplicate exists
                $slug = $slug . '-' . time();
            }

            $data['slug'] = $slug;
        }

        // Handle image uploads
        $image = $data['image'] ?? null;
        $icon = $data['icon'] ?? null;
        unset($data['image'], $data['icon']);

        // Delete old images if new ones are provided
        if ($image && $category->image) {
            $this->deleteCategoryImage($category->image);
        }
        if ($icon && $category->icon) {
            $this->deleteCategoryImage($category->icon);
        }

        // Store new images
        if ($image) {
            $storedPath = $this->handleCategoryImage($image, $category->id);
            $data['image'] = $storedPath;
        }
        if ($icon) {
            $data['icon'] = $this->handleCategoryImage($icon, $category->id);
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

        // Delete associated images
        if ($category->image) {
            $this->deleteCategoryImage($category->image);
        }
        if ($category->icon) {
            $this->deleteCategoryImage($category->icon);
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
    public function getCategoryTree(): SupportCollection
    {
        return Category::whereNull('parent_id')
            ->with(['childrenWithParent' => function ($query) {
                $query->with('parent')->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Handle category image upload.
     *
     * @param  \Illuminate\Http\UploadedFile|null  $image
     * @param  int  $categoryId
     * @return string|null
     */
    protected function handleCategoryImage($image, int $categoryId): ?string
    {
        if (!$image) {
            return null;
        }

        try {
            $path = $image->store('categories/' . $categoryId, 'public');
            return $path;
        } catch (Exception) {
            return null;
        }
    }

    /**
     * Delete category image from storage.
     *
     * @param  string|null  $imagePath
     * @return void
     */
    protected function deleteCategoryImage(?string $imagePath): void
    {
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
    }
}
