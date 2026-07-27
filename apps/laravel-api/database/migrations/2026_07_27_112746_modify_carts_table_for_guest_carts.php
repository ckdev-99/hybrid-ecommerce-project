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
        Schema::table('carts', function (Blueprint $table) {
            // Make user_id nullable for guest carts
            $table->dropForeign(['user_id']);
            $table->foreignId('user_id')->nullable()->change()->constrained()->nullOnDelete();

            // Add session_id for guest carts
            $table->string('session_id')->nullable()->unique()->after('user_id');

            // Add items_count column
            $table->integer('items_count')->default(0)->after('total');

            // Fix total column precision
            $table->decimal('total', 10, 2)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->change();

            $table->dropColumn(['session_id', 'items_count']);
        });
    }
};
