<?php

namespace App\Modules\Categories\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'parent_id' => $this->parent_id,
            'image_url' => $this->image_url, // Uses getImageUrlAttribute() accessor
            'icon_url' => $this->icon_url, // Uses getIconUrlAttribute() accessor
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            // Relationships when loaded
            'parent' => $this->whenLoaded('parent'),
            'children' => $this->when(
                $this->resource->relationLoaded('children') || $this->resource->relationLoaded('childrenWithParent'),
                CategoryResource::collection(
                    $this->resource->relationLoaded('children')
                        ? $this->resource->children
                        : $this->resource->childrenWithParent
                )
            ),
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
