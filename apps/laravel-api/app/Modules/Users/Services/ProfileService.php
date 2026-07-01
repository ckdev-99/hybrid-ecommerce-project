<?php

namespace App\Modules\Users\Services;

use App\Models\User;

class ProfileService
{
    /**
     * Update user profile.
     *
     * @param  User  $user
     * @param  array  $data
     * @return User
     */
    public function updateProfile(User $user, array $data): User
    {
        $fillable = ['name', 'email', 'phone', 'avatar'];
        $updateData = array_intersect_key($data, array_flip($fillable));

        $user->update($updateData);
        return $user->fresh('roles');
    }

    /**
     * Get user by ID with relationships.
     *
     * @param  int  $id
     * @return User
     */
    public function getUserById(int $id): User
    {
        return User::with('roles')->findOrFail($id);
    }

    /**
     * Get all users (admin only).
     *
     * @param  int  $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllUsers(int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return User::with('roles')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Update user status (active/inactive/banned).
     *
     * @param  User  $user
     * @param  string  $status
     * @return User
     */
    public function updateUserStatus(User $user, string $status): User
    {
        $user->update([
            'status' => $status,
            'is_active' => $status !== 'banned',
        ]);

        return $user->fresh('roles');
    }
}
