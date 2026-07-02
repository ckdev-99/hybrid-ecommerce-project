<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Categories
            ['name' => 'View Categories', 'slug' => 'categories.view', 'module' => 'categories'],
            ['name' => 'Create Categories', 'slug' => 'categories.create', 'module' => 'categories'],
            ['name' => 'Edit Categories', 'slug' => 'categories.edit', 'module' => 'categories'],
            ['name' => 'Delete Categories', 'slug' => 'categories.delete', 'module' => 'categories'],

            // Products
            ['name' => 'View Products', 'slug' => 'products.view', 'module' => 'products'],
            ['name' => 'Create Products', 'slug' => 'products.create', 'module' => 'products'],
            ['name' => 'Edit Products', 'slug' => 'products.edit', 'module' => 'products'],
            ['name' => 'Delete Products', 'slug' => 'products.delete', 'module' => 'products'],
            ['name' => 'Manage Stock', 'slug' => 'products.manage_stock', 'module' => 'products'],

            // Orders
            ['name' => 'View Orders', 'slug' => 'orders.view', 'module' => 'orders'],
            ['name' => 'Manage Orders', 'slug' => 'orders.manage', 'module' => 'orders'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        $this->command->info('Permissions seeded successfully.');
    }
}
