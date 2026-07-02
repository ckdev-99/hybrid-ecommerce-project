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
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();

            // Product relationship
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();

            // Image info
            $table->string('image_path')->comment('URL to image file');
            $table->string('alt_text')->nullable()->comment('Alt text for accessibility & SEO');
            $table->integer('sort_order')->default(0)->comment('Image order');
            $table->boolean('is_primary')->default(false)->comment('Main product image');

            $table->timestamps();

            // Indexes
            $table->index('product_id');
            $table->index('is_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
