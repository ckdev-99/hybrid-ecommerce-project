<?php

namespace App\Modules\Products\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
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
            'url' => $this->url, // Uses getUrlAttribute() accessor for full URL
            'alt' => $this->alt_text, // Frontend expects 'alt'
            'position' => $this->sort_order, // Frontend expects 'position'
            'is_primary' => $this->is_primary,
        ];
    }
}
