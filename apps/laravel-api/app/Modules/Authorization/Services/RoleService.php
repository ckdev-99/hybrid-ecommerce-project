<?php

namespace App\Modules\Authorization\Services;

use App\Models\Role;
use App\Models\User;

class RoleService
{
    /**
     * Get all roles.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllRoles(): \Illuminate\Database\Eloquent\Collection
    {
        return Role::orderBy('level')->get();
    }

    /**
     * Get role by ID.
     *
     * @param  int  $id
     * @return Role
     */
    public function getRoleById(int $id): Role
    {
        return Role::findOrFail($id);
    }

    /**
     * Create a new role.
     *
     * @param  array  $data
     * @return Role
     */
    public function createRole(array $data): Role
    {
        return Role::create($data);
    }

    /**
     * Update role.
     *
     * @param  Role  $role
     * @param  array  $data
     * @return Role
     */
    public function updateRole(Role $role, array $data): Role
    {
        $role->update($data);
        return $role->fresh();
    }

    /**
     * Delete role.
     *
     * @param  Role  $role
     * @return bool
     */
    public function deleteRole(Role $role): bool
    {
        // Prevent deleting default roles
        if (in_array($role->slug, ['superadmin', 'admin', 'user'])) {
            return false;
        }

        return $role->delete();
    }

    /**
     * Assign role to user.
     *
     * @param  User  $user
     * @param  Role  $role
     * @return void
     */
    public function assignRole(User $user, Role $role): void
    {
        $user->assignRole($role);
    }

    /**
     * Remove role from user.
     *
     * @param  User  $user
     * @param  Role  $role
     * @return void
     */
    public function removeRole(User $user, Role $role): void
    {
        $user->removeRole($role);
    }
}
