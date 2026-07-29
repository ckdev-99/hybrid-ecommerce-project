<?php

namespace App\Modules\Cart\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Modules\Products\Resources\ProductResource;

class CartItemResource extends JsonResource
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
            'product' => ProductResource::make($this->whenLoaded('product')),
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->price,
            'total' => (float) ($this->price * $this->quantity),
        ];
    }
}
