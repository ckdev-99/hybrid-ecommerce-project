<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'category_id',
        'sku',
        'barcode',
        'price',
        'compare_price',
        'cost_price',
        'tax_percent',
        'stock_qty',
        'low_stock_threshold',
        'track_stock',
        'allow_backorders',
        'is_active',
        'is_featured',
        'weight',
        'length',
        'width',
        'height',
        'brand',
        'warranty',
        'meta_title',
        'meta_description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'stock_qty' => 'integer',
        'low_stock_threshold' => 'integer',
        'track_stock' => 'boolean',
        'allow_backorders' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'weight' => 'decimal:2',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
    ];

    /**
     * Category this product belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Images for this product.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Get the primary image for this product.
     */
    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    /**
     * Check if product is in stock.
     */
    public function inStock(): bool
    {
        if (!$this->track_stock) {
            return true;
        }

        return $this->stock_qty > 0 || $this->allow_backorders;
    }

    /**
     * Check if stock is low.
     */
    public function isLowStock(): bool
    {
        if (!$this->track_stock) {
            return false;
        }

        return $this->stock_qty <= $this->low_stock_threshold;
    }

    /**
     * Get the discounted price if available.
     */
    public function getFinalPriceAttribute(): float
    {
        return $this->compare_price ?? $this->price;
    }

    /**
     * Check if product is on sale.
     */
    public function onSale(): bool
    {
        return !is_null($this->compare_price) && $this->compare_price > 0;
    }

    /**
     * Calculate discount percentage.
     */
    public function discountPercentage(): int
    {
        if (!$this->onSale()) {
            return 0;
        }

        return (int) round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }
}
