<?php

namespace App\Modules\Products\Resources;

use App\Modules\Categories\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'short_description' => $this->short_description,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'price' => (float) $this->price,
            'compare_price' => $this->compare_price ? (float) $this->compare_price : null,
            'cost_price' => $this->cost_price ? (float) $this->cost_price : null,
            'tax_percent' => (float) $this->tax_percent,
            'stock_qty' => $this->stock_qty,
            'low_stock_threshold' => $this->low_stock_threshold,
            'track_stock' => $this->track_stock,
            'allow_backorders' => $this->allow_backorders,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'weight' => $this->weight ? (float) $this->weight : null,
            'length' => $this->length ? (float) $this->length : null,
            'width' => $this->width ? (float) $this->width : null,
            'height' => $this->height ? (float) $this->height : null,
            'brand' => $this->brand,
            'warranty' => $this->warranty,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            // Computed fields
            'final_price' => $this->final_price,
            'on_sale' => $this->onSale(),
            'discount_percentage' => $this->discountPercentage(),
            'in_stock' => $this->inStock(),
            'is_low_stock' => $this->isLowStock(),

            // Relationships when loaded
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'primary_image' => ProductImageResource::make($this->whenLoaded('primaryImage')),
        ];
    }
}
