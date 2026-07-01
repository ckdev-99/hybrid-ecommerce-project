<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Users\Resources\UserResource;
use App\Modules\Users\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    /**
     * Display a listing of users (admin only).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $users = $this->profileService->getAllUsers($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'users' => UserResource::collection($users),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->profileService->getUserById($id);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => UserResource::make($user),
            ],
        ]);
    }

    /**
     * Update user status (admin only).
     *
     * @param  Request  $request
     * @param  User  $user
     * @return JsonResponse
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $request->validate(['status' => 'required|in:active,inactive,banned']);

        $user = $this->profileService->updateUserStatus($user, $request->status);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => [
                'user' => UserResource::make($user),
            ],
        ]);
    }
}
