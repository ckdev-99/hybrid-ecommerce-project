<?php

namespace App\Modules\Authorization\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Modules\Authorization\Requests\AssignRoleRequest;
use App\Modules\Authorization\Requests\CreateRoleRequest;
use App\Modules\Authorization\Requests\UpdateRoleRequest;
use App\Modules\Authorization\Resources\RoleResource;
use App\Modules\Authorization\Services\RoleService;
use App\Modules\Users\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService
    ) {}

    /**
     * Display a listing of roles.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $roles = $this->roleService->getAllRoles();

        return response()->json([
            'success' => true,
            'data' => [
                'roles' => RoleResource::collection($roles),
            ],
        ]);
    }

    /**
     * Store a newly created role.
     *
     * @param  CreateRoleRequest  $request
     * @return JsonResponse
     */
    public function store(CreateRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->createRole($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully',
            'data' => [
                'role' => RoleResource::make($role),
            ],
        ], 201);
    }

    /**
     * Display the specified role.
     *
     * @param  Role  $role
     * @return JsonResponse
     */
    public function show(Role $role): JsonResponse
    {
        $role = $role->load('users');

        return response()->json([
            'success' => true,
            'data' => [
                'role' => RoleResource::make($role),
            ],
        ]);
    }

    /**
     * Update the specified role.
     *
     * @param  UpdateRoleRequest  $request
     * @param  Role  $role
     * @return JsonResponse
     */
    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $role = $this->roleService->updateRole($role, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => [
                'role' => RoleResource::make($role),
            ],
        ]);
    }

    /**
     * Remove the specified role.
     *
     * @param  Role  $role
     * @return JsonResponse
     */
    public function destroy(Role $role): JsonResponse
    {
        $deleted = $this->roleService->deleteRole($role);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete default system roles',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully',
        ]);
    }

    /**
     * Assign role to user.
     *
     * @param  AssignRoleRequest  $request
     * @param  User  $user
     * @return JsonResponse
     */
    public function assignRole(AssignRoleRequest $request, User $user): JsonResponse
    {
        $role = Role::findOrFail($request->role_id);
        $this->roleService->assignRole($user, $role);

        return response()->json([
            'success' => true,
            'message' => 'Role assigned successfully',
            'data' => [
                'user' => UserResource::make($user->fresh('roles')),
            ],
        ]);
    }

    /**
     * Remove role from user.
     *
     * @param  User  $user
     * @param  Role  $role
     * @return JsonResponse
     */
    public function removeRole(User $user, Role $role): JsonResponse
    {
        $this->roleService->removeRole($user, $role);

        return response()->json([
            'success' => true,
            'message' => 'Role removed successfully',
            'data' => [
                'user' => UserResource::make($user->fresh('roles')),
            ],
        ]);
    }
}
