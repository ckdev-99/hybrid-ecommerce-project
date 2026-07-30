<?php

namespace App\Modules\Categories\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
    public function getParentCategories(): Collection
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
    public function getFeaturedCategories(): Collection
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
        \Log::info('CategoryService::updateCategory - Before processing', [
            'category_id' => $category->id,
            'has_image_in_data' => isset($data['image']),
            'image_type' => isset($data['image']) ? gettype($data['image']) : null,
            'current_category_image' => $category->image,
        ]);

        // Auto-generate slug if name changed and slug not provided
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Handle image uploads
        $image = $data['image'] ?? null;
        $icon = $data['icon'] ?? null;
        unset($data['image'], $data['icon']);

        \Log::info('CategoryService::updateCategory - After extracting image', [
            'image' => $image ? get_class($image) : null,
            'icon' => $icon ? get_class($icon) : null,
        ]);

        // Delete old images if new ones are provided
        if ($image && $category->image) {
            \Log::info('Deleting old image', ['old_image' => $category->image]);
            $this->deleteCategoryImage($category->image);
        }
        if ($icon && $category->icon) {
            $this->deleteCategoryImage($category->icon);
        }

        // Store new images
        if ($image) {
            $storedPath = $this->handleCategoryImage($image, $category->id);
            \Log::info('Stored new image', ['path' => $storedPath]);
            $data['image'] = $storedPath;
        }
        if ($icon) {
            $data['icon'] = $this->handleCategoryImage($icon, $category->id);
        }

        \Log::info('CategoryService::updateCategory - Before update', [
            'data_to_update' => array_keys($data),
            'has_image' => isset($data['image']),
            'image_value' => $data['image'] ?? 'not set',
        ]);

        $category->update($data);

        \Log::info('CategoryService::updateCategory - After update', [
            'category_image' => $category->image,
        ]);

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
            ->with('children.children')
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
        \Log::info('handleCategoryImage called', [
            'image_type' => $image ? get_class($image) : null,
            'category_id' => $categoryId,
            'is_valid' => $image instanceof \Illuminate\Http\UploadedFile,
        ]);

        if (!$image) {
            \Log::warning('handleCategoryImage - no image provided');
            return null;
        }

        try {
            $path = $image->store('categories/' . $categoryId, 'public');
            \Log::info('handleCategoryImage - stored successfully', ['path' => $path]);
            return $path;
        } catch (\Exception $e) {
            \Log::error('handleCategoryImage - failed to store', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
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
