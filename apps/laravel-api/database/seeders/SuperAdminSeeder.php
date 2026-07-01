<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if SuperAdmin already exists
        $superAdminRole = Role::where('slug', 'superadmin')->first();
        if (!$superAdminRole) {
            $this->command->warn('SuperAdmin role not found. Run RoleSeeder first.');
            return;
        }

        // Check if user already exists
        $existingUser = User::where('email', 'charan06agt@gmail.com')->first();
        if ($existingUser) {
            $this->command->info('SuperAdmin account already exists.');
            return;
        }

        // Create SuperAdmin user
        $superAdmin = User::create([
            'name' => 'Charanjeet Kaur',
            'email' => 'charan06agt@gmail.com',
            'password' => Hash::make('super@admin#123'),
            'phone' => null,
            'status' => 'active',
            'is_active' => true,
        ]);

        // Assign SuperAdmin role
        $superAdmin->assignRole($superAdminRole);

        $this->command->info('✅ SuperAdmin account created successfully!');
        $this->command->table(['SuperAdmin Credentials'], [
            ['Email', 'charan06agt@gmail.com'],
            ['Password', 'super@admin#123'],
        ]);
        $this->command->warn('⚠️  Please change the password after first login!');
    }
}
