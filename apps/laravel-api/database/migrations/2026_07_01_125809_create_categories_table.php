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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            // Basic info
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Hierarchy (for subcategories)
            $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();

            // Media
            $table->string('image')->nullable()->comment('Category banner image');
            $table->string('icon')->nullable()->comment('Small icon for UI');

            // Display settings
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false)->comment('Show on homepage');
            $table->integer('sort_order')->default(0)->comment('For ordering categories');

            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('parent_id');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
