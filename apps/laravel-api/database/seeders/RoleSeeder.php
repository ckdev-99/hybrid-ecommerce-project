<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'SuperAdmin',
                'slug' => 'superadmin',
                'description' => 'Full system access - can create admins and manage all settings',
                'level' => 1,
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Store management - can manage products, categories, and orders',
                'level' => 2,
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Regular customer - can browse, add to cart, and checkout',
                'level' => 100,
            ],
        ];

        //create roles 
        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    
        //assign permissions to roles

        // Give SuperAdmin all permissions
        $superAdmin = Role::where('slug', 'superadmin')->first();
        $superAdmin->permissions()->sync(Permission::pluck('id'));

        // Give Admin specific permissions
        $admin = Role::where('slug', 'admin')->first();
        $admin->permissions()->sync(
            Permission::where('module', '!=', 'users')->pluck('id')
        );

        $this->command->info('Roles seeded successfully: SuperAdmin (level 1), Admin (level 2), User (level 100)');
    }
}
