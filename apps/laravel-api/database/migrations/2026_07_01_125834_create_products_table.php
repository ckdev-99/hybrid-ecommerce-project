<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Basic info
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            // Category
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();

            // Product identifiers
            $table->string('sku')->unique()->comment('Stock Keeping Unit');
            $table->string('barcode')->nullable()->comment('ISBN, UPC, EAN');

            // Pricing
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable()->comment('Original price for discounts');
            $table->decimal('cost_price', 10, 2)->nullable()->comment('For profit calculation');
            $table->decimal('tax_percent', 5, 2)->default(0)->comment('Tax percentage');

            // Inventory
            $table->integer('stock_qty')->default(0);
            $table->integer('low_stock_threshold')->default(5)->comment('Alert when below this');
            $table->boolean('track_stock')->default(true);
            $table->boolean('allow_backorders')->default(false);

            // Product flags
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false)->comment('Show in featured section');

            // Shipping
            $table->decimal('weight', 8, 2)->nullable()->comment('Weight in kg');
            $table->decimal('length', 8, 2)->nullable()->comment('Length in cm');
            $table->decimal('width', 8, 2)->nullable()->comment('Width in cm');
            $table->decimal('height', 8, 2)->nullable()->comment('Height in cm');

            // Brand info
            $table->string('brand')->nullable();
            $table->string('warranty')->nullable()->comment('e.g., "1 Year"');

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('category_id');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('sku');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
